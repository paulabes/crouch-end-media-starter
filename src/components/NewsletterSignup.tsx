import { useState } from 'react';
import { siteConfig } from '../../site.config';

const PRIMARY = siteConfig.colors.primary;

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section className={`py-32 px-6 md:px-12 relative overflow-hidden bg-[${PRIMARY}]/10`}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, transparent 20%, black 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 20%, black 80%)',
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className={`inline-block px-3 py-1 bg-[${PRIMARY}]/20 border border-[${PRIMARY}]/40 text-[${PRIMARY}] font-grotesk text-xs font-bold uppercase tracking-widest mb-6`}>
          Newsletter
        </div>

        <h2 className="text-black tracking-tight mb-6">
          Stay in the loop.
        </h2>

        <p className="font-grotesk text-xl leading-relaxed font-bold text-zinc-700 max-w-2xl mx-auto mb-12">
          Latest news, tips, and insights — straight to your inbox. No spam.
        </p>

        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot((e.target as HTMLInputElement).value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
        />

        {status === 'success' ? (
          <p className={`text-[${PRIMARY}] font-grotesk font-bold text-lg`}>{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
              placeholder="your@email.com"
              required
              maxLength={254}
              disabled={status === 'loading'}
              className={`flex-1 bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 px-4 py-4 font-grotesk focus:outline-none focus:border-[${PRIMARY}] disabled:opacity-50`}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#2563eb] text-white font-grotesk font-bold uppercase tracking-widest text-sm hover:bg-[#1d4ed8] transition-all duration-300 disabled:opacity-50 whitespace-nowrap"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              {status !== 'loading' && (
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              )}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-red-600 text-sm font-grotesk mt-4">{message}</p>
        )}
      </div>
    </section>
  );
}
