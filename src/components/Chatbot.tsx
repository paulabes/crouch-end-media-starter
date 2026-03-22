import React, { useState, useEffect, useRef } from 'react';
import { siteConfig } from '../../site.config';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const PRIMARY = siteConfig.colors.primary;
const BG = siteConfig.colors.background;

// Helper to make phone numbers and page links clickable
const formatMessageContent = (content: string) => {
  const phoneRegex = /(\+\d{1,3}\s?\d{4}\s?\d{6})/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = phoneRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }
    const cleanNumber = match[1].replace(/\s/g, '');
    parts.push(
      <a key={`phone-${match.index}`} href={`tel:${cleanNumber}`} className={`text-[${PRIMARY}] underline hover:no-underline`}>
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [content];
};

const defaultMessage: Message = { role: 'assistant', content: siteConfig.chatbot.greeting };

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([defaultMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [statusText, setStatusText] = useState('Active');
  const [isOnline, setIsOnline] = useState(true);
  const [limitReached, setLimitReached] = useState(false);
  const [abuseStrikes, setAbuseStrikes] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [mobileViewportStyle, setMobileViewportStyle] = useState<React.CSSProperties>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const resetChat = () => {
    setMessages([defaultMessage]);
    setLimitReached(false);
    sessionStorage.removeItem('chatbot-messages');
  };

  useEffect(() => {
    const savedMessages = sessionStorage.getItem('chatbot-messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch {
        // Invalid JSON, use default
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && messages.length > 0) {
      sessionStorage.setItem('chatbot-messages', JSON.stringify(messages));
    }
  }, [messages, isHydrated]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    const viewport = window.visualViewport;
    if (!viewport) return;

    const updateGeometry = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setMobileViewportStyle({
          position: 'fixed',
          top: `${viewport.offsetTop}px`,
          height: `${viewport.height}px`,
          width: '100%',
          bottom: 'auto'
        });
      } else {
        setMobileViewportStyle({});
      }
    };

    viewport.addEventListener('resize', updateGeometry);
    viewport.addEventListener('scroll', updateGeometry);
    window.addEventListener('resize', updateGeometry);
    updateGeometry();

    return () => {
      viewport.removeEventListener('resize', updateGeometry);
      viewport.removeEventListener('scroll', updateGeometry);
      window.removeEventListener('resize', updateGeometry);
    };
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsTyping(true);
    setStatusText('Active');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) })
      });

      if (!response.ok) throw new Error('Chat failed');

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'assistant' as const,
        content: data.message
      }]);
      setIsOnline(true);
      setStatusText('Active');

      if (data.blocked) {
        const newStrikes = abuseStrikes + 1;
        setAbuseStrikes(newStrikes);
        if (newStrikes >= 2) {
          setLimitReached(true);
        }
      }

      if (data.limitReached) {
        setLimitReached(true);
      }

    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant' as const,
        content: `Apologies, a slight technical hiccup. Try again or call us on ${siteConfig.phone}.`
      }]);
      setIsOnline(false);
      setStatusText('Inactive');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`fixed z-[100] transition-all duration-500 font-grotesk ${isOpen ? 'inset-0 md:inset-auto md:bottom-8 md:right-8 md:w-[400px] md:h-[600px]' : 'bottom-8 right-8'}`}>
      {!isOpen && (
        <div className="relative">
          <span className={`absolute inset-0 w-16 h-16 rounded-full bg-[${PRIMARY}] animate-ping opacity-30`}></span>
          <span className={`absolute inset-0 w-16 h-16 rounded-full bg-[${PRIMARY}] animate-ping opacity-20`} style={{ animationDelay: '0.5s' }}></span>
          <span className={`absolute inset-0 w-16 h-16 rounded-full bg-[${PRIMARY}] animate-ping opacity-10`} style={{ animationDelay: '1s' }}></span>
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open chat"
            className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl bg-[${PRIMARY}] hover:scale-110 transition-all duration-300`}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          </button>
        </div>
      )}

      {isOpen && (
        <div
          className={`w-full h-full bg-[${BG}] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden animate-in fade-in duration-300`}
          style={mobileViewportStyle}
        >
          <div className="bg-black p-6 flex justify-between items-center shrink-0">
            <div>
              <h3 className="text-white font-grotesk text-xl">{siteConfig.chatbot.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">{statusText}</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className={`p-2 text-white hover:text-[${PRIMARY}] transition-colors`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-white/50 backdrop-blur-sm" role="log" aria-live="polite" aria-label="Chat messages">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 text-sm font-bold leading-relaxed ${msg.role === 'user'
                  ? 'bg-black text-white'
                  : msg.role === 'system'
                    ? 'bg-zinc-100 text-zinc-400 text-[10px] uppercase tracking-widest text-center border-none py-2 px-4 italic font-bold'
                    : `bg-zinc-100 text-zinc-900 border-l-4 border-[${PRIMARY}]`
                  }`}>
                  {msg.content ? formatMessageContent(msg.content) : (msg.role === 'assistant' && isTyping && <span className="animate-pulse italic opacity-50">Thinking...</span>)}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t border-zinc-100 shrink-0 pb-safe">
            {limitReached ? (
              <button
                onClick={resetChat}
                className={`w-full bg-[${PRIMARY}] text-white p-4 text-sm font-bold hover:bg-[${siteConfig.colors.primaryHover}] transition-colors`}
              >
                Start new chat
              </button>
            ) : (
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={siteConfig.chatbot.placeholder}
                  className={`w-full bg-zinc-50 border-b-2 border-zinc-200 p-4 pr-12 text-sm font-bold focus:border-[${PRIMARY}] outline-none transition-colors`}
                />
                <button
                  onClick={handleSend}
                  disabled={isTyping}
                  aria-label="Send message"
                  className={`absolute right-2 text-[${PRIMARY}] p-2 hover:scale-110 transition-transform disabled:opacity-30`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
