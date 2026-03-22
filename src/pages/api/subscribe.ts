import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';

export const prerender = false;

const RATE_LIMIT_WINDOW = 60 * 60;
const MAX_REQUESTS = 3;

const disposableDomains = [
  'tempmail', 'throwaway', 'guerrilla', 'mailinator', '10minute',
  'temp-mail', 'fakeinbox', 'yopmail', 'trashmail', 'sharklasers',
];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const clientIP =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const redis = new Redis({
      url: import.meta.env.UPSTASH_REDIS_REST_URL,
      token: import.meta.env.UPSTASH_REDIS_REST_TOKEN,
    });

    const key = `subscribe:${clientIP}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, RATE_LIMIT_WINDOW);
    if (count > MAX_REQUESTS) {
      return new Response(
        JSON.stringify({ success: false, error: 'Too many attempts. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const email: string = (body.email || '').trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please enter a valid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const domain = email.split('@')[1]?.toLowerCase() || '';
    if (disposableDomains.some((d) => domain.includes(d))) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please use a permanent email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = import.meta.env.RESEND_API_KEY;
    const audienceId = import.meta.env.RESEND_AUDIENCE_ID;

    if (!apiKey || !audienceId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Subscription service not configured.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(apiKey);
    await resend.contacts.create({ audienceId, email, unsubscribed: false });

    return new Response(
      JSON.stringify({ success: true, message: "You're subscribed! New articles will land in your inbox." }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err: unknown) {
    const message = (err as { message?: string })?.message || '';
    if (message.toLowerCase().includes('already exists') || (err as { statusCode?: number })?.statusCode === 409) {
      return new Response(
        JSON.stringify({ success: true, message: "You're already subscribed." }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
