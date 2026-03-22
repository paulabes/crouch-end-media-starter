import React, { useState, useEffect, useRef } from 'react';
import { siteConfig } from '../../site.config';

const PRIMARY = siteConfig.colors.primary;
const BG = siteConfig.colors.background;

interface FieldValidation {
  valid: boolean;
  message?: string;
  isGibberish?: boolean;
}

interface ValidationState {
  name: FieldValidation;
  email: FieldValidation;
  phone: FieldValidation;
  brief: FieldValidation;
}

const ContactForm: React.FC = () => {
  const [budget, setBudget] = useState(5000);
  const [formStatus, setFormStatus] = useState<'idle' | 'validating' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formLoadTime] = useState(Date.now());
  const [fieldErrors, setFieldErrors] = useState<ValidationState | null>(null);
  const [briefAskedOnce, setBriefAskedOnce] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const formElementRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (formRef.current) observer.observe(formRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (formStatus === 'success' && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [formStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('validating');
    setErrorMessage('');
    setFieldErrors(null);

    const form = formElementRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || undefined,
      brief: formData.get('brief') as string,
      budget: budget,
      _honeypot: formData.get('_honeypot') as string || '',
      _timestamp: formLoadTime,
    };

    try {
      let validationPassed = true;
      try {
        const validateResponse = await fetch('/api/validate-contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (validateResponse.ok) {
          const validation = await validateResponse.json();
          if (!validation.valid) {
            const briefInvalid = validation.fields.brief && !validation.fields.brief.valid;
            const isGibberish = validation.fields.brief?.isGibberish;
            const otherFieldsInvalid =
              (validation.fields.name && !validation.fields.name.valid) ||
              (validation.fields.email && !validation.fields.email.valid) ||
              (validation.fields.phone && !validation.fields.phone.valid);

            if (briefInvalid && !otherFieldsInvalid && briefAskedOnce && !isGibberish) {
              validationPassed = true;
            } else {
              setFieldErrors(validation.fields);
              setFormStatus('error');
              if (briefInvalid && !briefAskedOnce) {
                setErrorMessage(validation.fields.brief.message || 'Please provide more detail about your project.');
                setBriefAskedOnce(true);
              } else if (otherFieldsInvalid) {
                setErrorMessage('');
              }
              validationPassed = false;
            }
          }
        }
      } catch {
        console.log('Validation API failed, continuing to submit');
      }

      if (!validationPassed) return;

      setFormStatus('sending');

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setFormStatus('success');
        setFieldErrors(null);
        form.reset();
        setBudget(5000);
      } else {
        setFormStatus('error');
        setErrorMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setFormStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  const formatBudget = (val: number) => {
    if (val >= 15000) return '£15,000+';
    return `£${val.toLocaleString()}`;
  };

  return (
    <div ref={formRef} className="bg-white p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-zinc-100">
      {formStatus === 'success' ? (
        <div className="-m-8 md:-m-12 bg-green-50 p-12 md:p-16 text-center animate-in fade-in zoom-in duration-500">
          <svg className="w-12 h-12 text-green-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          <h3 className="font-grotesk text-2xl md:text-3xl mb-3 leading-tight text-green-800">Message sent.</h3>
          <p className="font-grotesk text-green-800 font-bold">Thank you. We'll be in touch soon to discuss your project.</p>
          <button
            type="button"
            onClick={() => setFormStatus('idle')}
            className="mt-6 text-green-700 font-grotesk font-bold text-sm uppercase tracking-widest hover:underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form ref={formElementRef} onSubmit={handleSubmit} className="space-y-10 relative">
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <input type="text" name="_honeypot" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="contact-name" className="block font-grotesk font-bold text-xs uppercase tracking-widest text-zinc-400 mb-4">Full Name</label>
              <input
                id="contact-name" name="name" required type="text"
                className={`w-full border-b-2 p-5 font-grotesk text-lg outline-none transition-colors ${fieldErrors?.name && !fieldErrors.name.valid ? 'bg-red-50 border-red-500' : `bg-[${BG}] border-zinc-200 focus:border-[${PRIMARY}]`}`}
                placeholder="Your Name"
                onChange={() => fieldErrors && setFieldErrors({ ...fieldErrors, name: { valid: true } })}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block font-grotesk font-bold text-xs uppercase tracking-widest text-zinc-400 mb-4">Email Address</label>
              <input
                id="contact-email" name="email" required type="email"
                className={`w-full border-b-2 p-5 font-grotesk text-lg outline-none transition-colors ${fieldErrors?.email && !fieldErrors.email.valid ? 'bg-red-50 border-red-500' : `bg-[${BG}] border-zinc-200 focus:border-[${PRIMARY}]`}`}
                placeholder="name@domain.com"
                onChange={() => fieldErrors && setFieldErrors({ ...fieldErrors, email: { valid: true } })}
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-phone" className="block font-grotesk font-bold text-xs uppercase tracking-widest text-zinc-400 mb-4">Telephone Number</label>
            <input
              id="contact-phone" name="phone" type="tel"
              className={`w-full border-b-2 p-5 font-grotesk text-lg outline-none transition-colors ${fieldErrors?.phone && !fieldErrors.phone.valid ? 'bg-red-50 border-red-500' : `bg-[${BG}] border-zinc-200 focus:border-[${PRIMARY}]`}`}
              placeholder="+44 (0) ..."
              onChange={() => fieldErrors && setFieldErrors({ ...fieldErrors, phone: { valid: true } })}
            />
          </div>

          <div>
            <div className="flex justify-between items-end mb-8">
              <label htmlFor="contact-budget" className="block font-grotesk font-bold text-xs uppercase tracking-widest text-zinc-400">Estimated Budget</label>
              <span className={`font-grotesk text-2xl md:text-4xl text-[${PRIMARY}]`}>{formatBudget(budget)}</span>
            </div>
            <input
              id="contact-budget" name="budget" type="range"
              min="500" max="15000" step="500" value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
            />
            <div className="flex justify-between mt-4 font-grotesk text-xs font-bold text-zinc-400 uppercase tracking-widest">
              <span>£500</span>
              <span>£7,500</span>
              <span>£15,000+</span>
            </div>
          </div>

          <div>
            <label htmlFor="contact-brief" className="block font-grotesk font-bold text-xs uppercase tracking-widest text-zinc-400 mb-4">Project Brief</label>
            <textarea
              id="contact-brief" name="brief" required rows={4}
              className={`w-full border-b-2 p-5 font-grotesk text-lg outline-none transition-colors resize-none ${fieldErrors?.brief && !fieldErrors.brief.valid ? 'bg-red-50 border-red-500' : `bg-[${BG}] border-zinc-200 focus:border-[${PRIMARY}]`}`}
              placeholder="Describe your project..."
              onChange={() => fieldErrors && setFieldErrors({ ...fieldErrors, brief: { valid: true } })}
            />
          </div>

          {formStatus === 'error' && errorMessage && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="font-grotesk text-sm">{errorMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={formStatus === 'validating' || formStatus === 'sending'}
            className="w-full bg-[#2563eb] text-white py-4 font-grotesk font-bold uppercase tracking-widest text-sm hover:bg-[#1d4ed8] transition-all disabled:opacity-50 flex items-center justify-center gap-4"
          >
            {formStatus === 'validating' ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Checking...
              </>
            ) : formStatus === 'sending' ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Sending...
              </>
            ) : 'Send Enquiry'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
