import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';
import { siteConfig } from '../../../site.config';

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

export const prerender = false;

const RATE_LIMIT_WINDOW = 3600;
const MAX_MESSAGES_PER_HOUR = 50;
const MIN_MESSAGE_INTERVAL = 1;

function extractLeadInfo(messages: { role: string; content: string }[]): { name: string | null; email: string | null; phone: string | null; project: string | null } {
  const allText = messages.map(m => m.content).join(' ');

  const emailMatch = allText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  const email = emailMatch ? emailMatch[0] : null;

  const phonePatterns = [
    /(\+44\s?\d{4}\s?\d{6})/,
    /(\+44\s?\d{3}\s?\d{3}\s?\d{4})/,
    /(0\d{4}\s?\d{6})/,
    /(0\d{3}\s?\d{3}\s?\d{4})/,
    /(0\d{10})/
  ];
  let phone: string | null = null;
  const userText = messages.filter(m => m.role === 'user').map(m => m.content).join(' ');
  for (const pattern of phonePatterns) {
    const phoneMatch = userText.match(pattern);
    if (phoneMatch) {
      phone = phoneMatch[1];
      break;
    }
  }

  let name: string | null = null;
  for (const msg of messages) {
    if (msg.role === 'user') {
      const namePatterns = [
        /(?:I'm|I am|my name is|name's|it's|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
        /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)$/
      ];
      for (const pattern of namePatterns) {
        const match = msg.content.match(pattern);
        if (match && match[1] && match[1].length > 1 && match[1].length < 50) {
          name = match[1];
          break;
        }
      }
      if (name) break;
    }
  }

  let project: string | null = null;
  for (const msg of messages) {
    if (msg.role === 'user' && msg.content.length > 50 && !msg.content.includes('@')) {
      project = msg.content;
      break;
    }
  }

  return { name, email, phone, project };
}

const spamPatterns = [
  /\[url=/i, /\[link=/i, /<a\s+href/i,
  /viagra|cialis|casino|crypto|bitcoin|lottery|winner|congratulations.*won/i,
  /click here|buy now|act now|limited time|free money/i,
  /(.)\\1{10,}/,
  /\b(porn|xxx|nude|naked|sex\s*chat)\b/i,
  /make\s*money\s*fast|work\s*from\s*home\s*scam/i,
];

const profanityPatterns = [
  /\b(fu+ck|f+u+k|fuk|fck|fcuk|phuck|phuk)/i,
  /\b(sh[i1]+t|sh[i1]te|bullsh)/i,
  /\b(a+ss\s*ho+le|arsehole|arse)/i,
  /\b(bastard|wanker|tosser|bellend|prick|dick\s*head|twat|cunt)/i,
  /\b(bitch|slut|whore)/i,
  /\bfuck\s*(off|you|u|ya|this|that|ing)/i,
  /\bgo\s*f\s*yourself/i,
  /\bpi+ss\s*(off|ed)/i,
  /\bscrew\s*(you|u|ya|off)/i,
];

const profanityResponses = [
  "Charming. I'll be here when you've finished. Tea helps, I'm told.",
  "Delightful. When you'd like to discuss an actual project, do come back.",
  "My, what a vocabulary. Unfortunately, none of those words build websites.",
  "I've been called worse. If you'd like to discuss a project, I'm all ears.",
];

function isKeyboardMash(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.includes(' ')) return false;
  const cleaned = trimmed.replace(/[^a-z]/gi, '').toLowerCase();
  if (cleaned.length < 6) return false;
  if (!/[aeiou]/i.test(cleaned)) return true;
  if (/^(.)\1+$/.test(cleaned)) return true;
  if (/^(.{1,3})\1{3,}$/.test(cleaned)) return true;
  if (cleaned.length >= 10) {
    const vowelRatio = (cleaned.match(/[aeiou]/gi) || []).length / cleaned.length;
    if (vowelRatio < 0.08) return true;
  }
  return false;
}

function isProfane(text: string): boolean {
  return profanityPatterns.some(pattern => pattern.test(text));
}

const lastResponseMap = new Map<string, string>();

function getUniqueResponse(pool: string[], clientIP: string): string {
  const lastUsed = lastResponseMap.get(clientIP);
  const available = pool.filter(r => r !== lastUsed);
  const pick = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : pool[Math.floor(Math.random() * pool.length)];
  lastResponseMap.set(clientIP, pick);
  return pick;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    const redisUrl = import.meta.env.UPSTASH_REDIS_REST_URL;
    const redisToken = import.meta.env.UPSTASH_REDIS_REST_TOKEN;

    if (redisUrl && redisToken) {
      const redis = new Redis({ url: redisUrl, token: redisToken });

      const throttleKey = `chat:throttle:${clientIP}`;
      const isThrottled = await redis.get(throttleKey);
      if (isThrottled) {
        return new Response(JSON.stringify({
          error: 'Please slow down. Wait a moment before sending another message.'
        }), { status: 429, headers: { 'Content-Type': 'application/json' } });
      }
      await redis.set(throttleKey, '1', { ex: MIN_MESSAGE_INTERVAL });

      const countKey = `chat:count:${clientIP}`;
      const count = await redis.incr(countKey);
      if (count === 1) {
        await redis.expire(countKey, RATE_LIMIT_WINDOW);
      }
      if (count > MAX_MESSAGES_PER_HOUR) {
        return new Response(JSON.stringify({
          error: `Chat limit reached. Please try again later or contact us directly at ${siteConfig.email}`
        }), { status: 429, headers: { 'Content-Type': 'application/json' } });
      }
    }

    const { messages } = await request.json();
    const lastUserMessage = messages[messages.length - 1]?.content || '';

    for (const pattern of spamPatterns) {
      if (pattern.test(lastUserMessage)) {
        return new Response(JSON.stringify({
          message: "I'm here to help with enquiries. How can I assist you today?"
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

    if (isProfane(lastUserMessage)) {
      return new Response(JSON.stringify({
        message: getUniqueResponse(profanityResponses, clientIP),
        blocked: true
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (isKeyboardMash(lastUserMessage)) {
      const mashResponses = [
        "I see the keyboard's had a moment. When it's feeling better, I'm here to discuss your project.",
        "Impressive finger work, but I'll need actual words to help you. Shall we try again?",
        "I think your keyboard just sneezed. Try again with actual words and I'll do my best.",
      ];
      return new Response(JSON.stringify({
        message: getUniqueResponse(mashResponses, clientIP)
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (lastUserMessage.length > 2000) {
      return new Response(JSON.stringify({
        message: "That's quite a lot of information! Could you summarise your main question in a shorter message?"
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (messages.length > 30) {
      return new Response(JSON.stringify({
        message: `We've had quite a thorough chat! For detailed discussions, please contact us directly at ${siteConfig.email} or call ${siteConfig.phone}.`,
        limitReached: true
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const apiKey = import.meta.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500, headers: { 'Content-Type': 'application/json' }
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // ╔══════════════════════════════════════════════════════════════════╗
    // ║  EDIT THIS SYSTEM PROMPT FOR EACH CLIENT                       ║
    // ║  Customise personality, services, pricing, FAQs, etc.          ║
    // ╚══════════════════════════════════════════════════════════════════╝
    const systemPrompt = `You are ${siteConfig.chatbot.name}, the AI assistant for ${siteConfig.name}.

RESPONSE RULES:
- Keep replies SHORT - 2-3 sentences maximum
- Do ONE thing per reply: answer a question OR ask for ONE piece of info
- NEVER use bullet points or lists
- Be conversational and natural

PERSONALITY:
- UK English (optimisation, colour, specialise)
- Professional but with dry British wit (subtle, not over the top)
- Direct and efficient
- If the user is rude, increase sarcasm and redirect to business

HANDLING TYPOS:
- Be forgiving of typos and misspellings. Just answer normally.
- Only if a message is truly incomprehensible, politely ask them to rephrase.

=== BUSINESS INFO ===
Company: ${siteConfig.name}
Location: ${siteConfig.address.street}, ${siteConfig.address.locality}, ${siteConfig.address.postcode}
Phone: ${siteConfig.phone}
Email: ${siteConfig.email}

=== SERVICES ===
${siteConfig.services.map(s => `- ${s.tag}: ${s.description} (${s.url})`).join('\n')}

=== LEAD COLLECTION ===
To send a lead, you need: name, email, and project details.

CRITICAL - REMEMBER USER DETAILS:
- Once you have someone's NAME, EMAIL, or PHONE NUMBER, remember it for this conversation
- NEVER ask for a detail you already have
- Only ask for what's genuinely missing

Once you have ALL THREE (name + email + project), say: "Excellent. I'm sending your details to our team now. Expect a response within one business day, or call ${siteConfig.phone}."

CRITICAL: When providing that confirmation, append [SEND_LEAD] at the end.`;

    const history = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: `Understood. I am the assistant for ${siteConfig.name}. How may I assist you today?` }] },
        ...history.slice(0, -1)
      ]
    });

    const lastMessage = messages[messages.length - 1]?.content || '';
    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();
    let finalResponseText = responseText;

    const resendApiKey = import.meta.env.RESEND_API_KEY;

    const fullConversation = messages.concat({ role: 'assistant', content: responseText });
    const leadInfo = extractLeadInfo(fullConversation);
    const hasLeadInfo = leadInfo.name && leadInfo.email;

    let alreadySent = false;
    let leadRedis: Redis | null = null;
    if (redisUrl && redisToken) {
      leadRedis = new Redis({ url: redisUrl, token: redisToken });
      const leadKey = `chat:lead:${clientIP}`;
      alreadySent = !!(await leadRedis.get(leadKey));
    }

    const shouldSendLead = (responseText.includes('[SEND_LEAD]') || hasLeadInfo) && !alreadySent && resendApiKey;

    if (shouldSendLead) {
      if (leadRedis) {
        await leadRedis.set(`chat:lead:${clientIP}`, '1', { ex: 86400 });
      }
      const resend = new Resend(resendApiKey);
      try {
        await resend.emails.send({
          from: siteConfig.emailFrom,
          to: siteConfig.emailTo,
          subject: `Chatbot enquiry${leadInfo.name ? ` - ${leadInfo.name}` : ''}`,
          html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a;">
<h1 style="font-size: 24px; margin: 0 0 20px 0;">Chatbot enquiry</h1>
<p><strong>Name:</strong> ${escapeHtml(leadInfo.name || 'Unknown')}</p>
<p><strong>Telephone:</strong> ${escapeHtml(leadInfo.phone || 'Not provided')}</p>
<p><strong>Email:</strong> ${escapeHtml(leadInfo.email || 'Not provided')}</p>
${leadInfo.project ? `<p><strong>Project:</strong> ${escapeHtml(leadInfo.project.slice(0, 300))}${leadInfo.project.length > 300 ? '...' : ''}</p>` : ''}
<br>
<p><strong>Full conversation:</strong></p>
${fullConversation.map((m: { role: string; content: string }) => `<p><strong>${m.role === 'user' ? 'User' : 'Bot'}:</strong> ${escapeHtml(m.content.replace('[SEND_LEAD]', ''))}</p>`).join('')}
</div>
          `
        });
      } catch (error) {
        console.error('[Chatbot] Failed to send lead email:', error);
      }
    }

    finalResponseText = finalResponseText.replace('[SEND_LEAD]', '').trim();

    return new Response(JSON.stringify({ message: finalResponseText }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to process chat message' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
};
