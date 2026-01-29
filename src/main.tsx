import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Loader2, Check } from 'lucide-react';
import LogoSvg from './img/quietloudlab_logo_white.svg?react';

// --- Data ---

const PRACTICE_AREAS = [
  {
    title: "Legible Systems",
    desc: "Making assumptions, constraints, and flows visible in complex technical systems. We believe a system cannot be governed if it cannot be seen."
  },
  {
    title: "Human–AI Co-Creativity",
    desc: "Designing interactions where AI supports thinking and agency rather than replacing it. We optimize for 'human-in-the-loop' by default."
  },
  {
    title: "Constraints as Design Material",
    desc: "Treating limits, policies, and responsibilities as first-class design inputs, not afterthoughts. Friction is often a feature."
  },
  {
    title: "Tools for Thoughtful Work",
    desc: "Building and studying tools that support sensemaking, reflection, and intentional action over raw speed or scale."
  }
];

const OFFERINGS = [
  {
    title: "Before the Build",
    fit: "For teams about to invest in AI and needing clarity on what to build, why, and where human judgment belongs.",
    outcome: "We work with you to map the system before it exists—surfacing assumptions, constraints, and responsibilities so the first build is the right build.",
    format: "2–4 weeks"
  },
  {
    title: "Mid-Build Clarity",
    fit: "For teams where the prototype worked but production is chaos, or where design, engineering, and product are talking past each other.",
    outcome: "We make the system visible—identifying where confusion lives, what's actually being decided by AI vs. humans, and what constraints have been ignored.",
    format: "2–3 weeks"
  },
  {
    title: "Strategic Validation",
    fit: "For leaders who need to pressure-test an AI investment, product direction, or roadmap before committing further resources.",
    outcome: "We build the argument for or against—with prototypes, system maps, or decision frameworks that make the tradeoffs explicit.",
    format: "4–6 weeks"
  },
  {
    title: "Custom Engagement",
    fit: "Not sure where to start? We often design engagements around emerging problems or unusual constraints.",
    outcome: "",
    format: "",
    isCustom: true
  }
];

const INTEREST_OPTIONS = [
  "Exploring how quietloudlab can support my team",
  "Co-designing a new product, service, or solution",
  "Prototyping an idea to test or explore",
  "Running a workshop with my team",
  "Learning how to design for creative AI (individually or as a team)",
  "Framing a problem, opportunity, or future state",
  "Scheduling a 30-minute consultation chat"
];

// --- Components ---

const FadeIn = ({ children, delay = 0, className = "" }: { children?: React.ReactNode, delay?: number, className?: string }) => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Logo = ({ className }: { className?: string }) => (
  <LogoSvg className={className} />
);

const SectionLabel = ({ text, as: Tag = 'h2', id }: { text: string, as?: 'h2' | 'h3' | 'span' | 'div', id?: string }) => (
  <Tag id={id} className="block font-mono text-xs uppercase tracking-widest text-gray-400 mb-6 border-b border-white/10 pb-2">
    {text}
  </Tag>
);

const NavItem = ({ label, targetId }: { label: string, targetId: string }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  return (
    <a 
      href={`#${targetId}`}
      onClick={handleClick}
      className="font-mono text-xs md:text-sm uppercase tracking-widest text-gray-400 hover:text-lab-white transition-colors pb-1 border-b-2 border-transparent hover:border-lab-olive focus:outline-none focus:text-lab-white focus:border-lab-olive"
    >
      {label}
    </a>
  );
};

// --- Forms ---

type ContactIntent = {
  text: string;
  id: number;
};

const ContactForm = ({ contactIntent }: { contactIntent: ContactIntent | null }) => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (contactIntent && contactIntent.text) {
      const { text } = contactIntent;

      // If reduced motion is preferred, skip animation
      if (shouldReduceMotion) {
        setMessage(text);
        // Small timeout to allow scroll to finish before focusing
        const focusTimeout = setTimeout(() => textareaRef.current?.focus(), 800);
        return () => clearTimeout(focusTimeout);
      }

      // Reset and prepare for typing
      setMessage('');
      
      let typingInterval: ReturnType<typeof setInterval>;
      
      // Delay typing start to allow smooth scroll to complete (approx 600-800ms)
      const startDelay = 700;
      
      const startTimeout = setTimeout(() => {
        if (!textareaRef.current) return;
        textareaRef.current.focus();
        
        let i = 0;
        // Fast mechanical typing speed
        typingInterval = setInterval(() => {
          setMessage(text.substring(0, i + 1));
          i++;
          if (i === text.length) {
            clearInterval(typingInterval);
          }
        }, 15);
      }, startDelay);

      return () => {
        clearTimeout(startTimeout);
        if (typingInterval) clearInterval(typingInterval);
      };
    }
  }, [contactIntent, shouldReduceMotion]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string | string[]> = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      interests: formData.getAll('interests') as string[],
    };

    try {
      const response = await fetch("https://submit-form.com/zJR7lYKAh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
        setMessage(''); // Clear message on success
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div 
        role="alert" 
        className="bg-white/5 border border-lab-olive/30 p-8 rounded-sm text-center py-20 h-full flex flex-col items-center justify-center"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-lab-olive/20 text-lab-olive mb-4">
          <Check size={24} aria-hidden="true" />
        </div>
        <h3 className="font-sans text-xl text-lab-white mb-2 font-medium">Message Received</h3>
        <p className="font-serif text-gray-300">I'll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="name" className="block font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">Name *</label>
        <input 
          type="text" 
          name="name" 
          id="name"
          required
          aria-required="true"
          placeholder="Your name"
          className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-lab-white placeholder-gray-500 focus:border-lab-olive focus:outline-none transition-colors"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">Email *</label>
        <input 
          type="email" 
          name="email" 
          id="email"
          required
          aria-required="true"
          placeholder="your.email@example.com"
          className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-lab-white placeholder-gray-500 focus:border-lab-olive focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label htmlFor="message" className="block font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">Message *</label>
        <textarea 
          ref={textareaRef}
          name="message" 
          id="message"
          required
          aria-required="true"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your project or inquiry..."
          className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-lab-white placeholder-gray-500 focus:border-lab-olive focus:outline-none transition-colors resize-none"
        ></textarea>
      </div>

      <div className="pt-2">
        <label className="block font-mono text-xs uppercase tracking-widest text-gray-400 mb-4">I'm interested in...</label>
        <div className="space-y-3">
          {INTEREST_OPTIONS.map((option, i) => (
            <label key={i} className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  name="interests" 
                  value={option}
                  className="peer appearance-none w-5 h-5 border border-white/20 rounded-sm bg-white/5 checked:bg-lab-olive checked:border-lab-olive transition-all mt-0.5 focus:ring-2 focus:ring-lab-olive focus:ring-offset-2 focus:ring-offset-black"
                />
                <Check size={12} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%-2px)] text-white opacity-0 peer-checked:opacity-100 pointer-events-none" aria-hidden="true" />
              </div>
              <span className="text-gray-300 group-hover:text-gray-100 transition-colors font-serif text-lg leading-snug select-none">
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={status === 'submitting'}
        className="w-full bg-white/10 hover:bg-lab-olive text-lab-white font-mono text-sm uppercase tracking-widest py-4 rounded-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-lab-olive focus:ring-offset-2 focus:ring-offset-black"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
      
      {status === 'error' && (
        <p role="alert" className="text-red-400 font-mono text-xs text-center">Something went wrong. Please try again.</p>
      )}
    </form>
  );
};

const NewsletterForm = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const response = await fetch("https://submit-form.com/buMSWec82", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div role="status" className="text-sm font-mono text-lab-olive flex items-center gap-2">
        <Check size={14} aria-hidden="true" /> Subscribed to updates.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <label htmlFor="newsletter-email" className="font-mono text-xs uppercase tracking-widest text-gray-400">Stay Updated</label>
      <div className="flex gap-0">
        <input 
          type="email" 
          name="email"
          id="newsletter-email"
          required
          aria-required="true"
          placeholder="Email address"
          className="bg-white/5 border border-white/10 border-r-0 rounded-l-sm p-2 text-sm text-lab-white placeholder-gray-500 focus:border-lab-olive focus:outline-none transition-colors w-full"
        />
        <button 
          type="submit"
          aria-label="Subscribe"
          disabled={status === 'submitting'}
          className="bg-white/10 hover:bg-lab-olive border border-white/10 border-l-0 rounded-r-sm px-4 text-gray-200 hover:text-white transition-colors disabled:opacity-50 focus:ring-2 focus:ring-lab-olive focus:ring-offset-2 focus:ring-offset-black"
        >
          {status === 'submitting' ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <ArrowRight size={14} aria-hidden="true" />}
        </button>
      </div>
      {status === 'error' && <p role="alert" className="text-red-400 font-mono text-[10px]">Error subscribing.</p>}
    </form>
  );
};

// --- App Layout ---

const App = () => {
  const [contactIntent, setContactIntent] = useState<ContactIntent | null>(null);

  const handleInquire = (title: string, isCustom = false) => {
    const text = isCustom 
      ? "I'm not sure exactly what we need yet, but I'd like to discuss a potential collaboration."
      : `I'm interested in exploring the "${title}" engagement for my team.`;
    
    // Use timestamp ID to ensure effect triggers even if same option selected twice
    setContactIntent({ text, id: Date.now() });
    
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-lab-black text-lab-white selection:bg-lab-olive selection:text-white flex flex-col items-center">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-lab-white focus:text-lab-black focus:p-4 focus:font-mono focus:text-sm">Skip to content</a>
      
      {/* Navigation */}
      <nav role="navigation" aria-label="Main Navigation" className="fixed top-0 left-0 w-full z-50 bg-lab-black/95 backdrop-blur-sm border-b border-white/5 h-16 md:h-20 flex items-center">
        <div className="w-full max-w-screen-xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="z-10 focus:outline-none focus:ring-2 focus:ring-lab-olive focus:ring-offset-2 focus:ring-offset-lab-black rounded-sm block text-lab-white" aria-label="quietloudlab home">
            <Logo className="h-4 md:h-5 w-auto hover:opacity-80 transition-opacity" />
          </a>
          
          <div className="hidden md:flex gap-8">
            <NavItem label="Practice" targetId="practice" />
            <NavItem label="Engagement" targetId="engagement" />
            <NavItem label="Contact" targetId="contact" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" className="w-full max-w-screen-xl mx-auto px-6 md:px-12 pt-32 md:pt-40 min-h-screen flex flex-col pb-24">
        
        {/* Hero */}
        <div className="w-full mb-32 md:mb-48">
          <FadeIn>
            <h1 className="font-sans text-5xl md:text-6xl lg:text-8xl font-medium tracking-tight leading-[1.05] mb-10 text-lab-white max-w-6xl">
              A design and research lab exploring future objects for thinking and creating.
            </h1>
            
            <p className="font-serif max-w-3xl text-xl md:text-3xl text-gray-300 leading-relaxed pt-4">
              quietloudlab helps teams, startups, and organizations navigate complex or emerging technologies. 
              <br /><br />
              We perform strategy work and build tools, frameworks, futures, and prototypes that validate and challenge the trajectory of investment before costly commitments are made.
            </p>
          </FadeIn>
        </div>

        {/* Practice Areas (Left) & Dispatch Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-32 md:mb-48">
          
          {/* Left: Practice Areas */}
          <section id="practice" className="lg:col-span-7" aria-labelledby="practice-heading">
            <FadeIn>
              <SectionLabel text="Areas of Practice" as="h2" id="practice-heading" />
              <div className="grid grid-cols-1 gap-12 max-w-2xl">
                {PRACTICE_AREAS.map((area, i) => (
                  <div key={i} className="group">
                    <h3 className="font-sans text-xl font-medium mb-2 group-hover:text-lab-olive transition-colors text-gray-200">
                      {area.title}
                    </h3>
                    <p className="font-serif text-lg text-gray-300 leading-relaxed">
                      {area.desc}
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </section>

          {/* Right: The Dispatch (Sticky) */}
          <aside className="lg:col-span-5 relative" aria-labelledby="dispatch-heading">
             <div className="lg:sticky lg:top-32">
               <FadeIn delay={0.2}>
                  <div className="bg-white/5 p-6 md:p-8 border border-white/5">
                    <h2 id="dispatch-heading" className="font-sans text-lg font-medium text-lab-white mb-4">The Dispatch</h2>
                    <p className="font-serif text-gray-300 mb-6">
                      Occasional notes on systems, futures, and the lab's work. No spam, just signal.
                    </p>
                    <NewsletterForm />
                  </div>
               </FadeIn>
             </div>
          </aside>

        </div>

        {/* Engagement Models */}
        <section id="engagement" className="mb-32 md:mb-48" aria-labelledby="engagement-heading">
          <FadeIn>
             <div className="max-w-3xl mb-16">
                <SectionLabel text="Working Together" as="span" />
                <h2 id="engagement-heading" className="font-sans text-3xl md:text-4xl font-medium tracking-tight mb-6 text-lab-white">
                  Engagement Models
                </h2>
                <p className="font-serif text-lg text-gray-300 leading-relaxed">
                  quietloudlab works directly with small teams and organizations designing complex systems—especially AI—at moments of uncertainty or risk. Engagements focus on making assumptions visible, aligning stakeholders, and surfacing consequences before decisions are locked into code.
                </p>
             </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {OFFERINGS.map((offer, i) => (
                <div key={i} className="flex flex-col bg-white/5 p-8 border border-white/5 hover:bg-white/[0.02] hover:border-lab-olive/40 transition-all duration-300 group">
                  <div className="flex-grow">
                    <h3 className="font-sans text-2xl font-medium mb-4 text-lab-white">{offer.title}</h3>

                    <div className="space-y-4">
                      <p className="font-serif text-gray-300 text-lg leading-snug">{offer.fit}</p>
                      {offer.outcome && (
                        <p className="font-serif text-gray-400 text-base">{offer.outcome}</p>
                      )}
                      {offer.format && (
                        <p className="font-mono text-xs uppercase tracking-widest text-lab-olive">Typical engagement: {offer.format}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleInquire(offer.title, (offer as any).isCustom)}
                    className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-lab-olive hover:text-white transition-colors group-hover:border-white/20 focus:outline-none focus:text-white group/btn"
                    aria-label={(offer as any).isCustom ? "Let's define the brief" : `Inquire about ${offer.title}`}
                  >
                    {(offer as any).isCustom ? "Let's define the brief" : "Inquire about this"} <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

          </FadeIn>
        </section>

        {/* Contact Section */}
        <section id="contact" className=" pt-16 border-t border-white/10" aria-labelledby="contact-heading">
            <FadeIn>
              <div className="max-w-3xl">
                  <SectionLabel text="Start a Conversation" as="h2" id="contact-heading" />
                  <p className="font-serif text-gray-300 mb-8 text-lg">
                    If you are designing or deploying a system where clarity matters, we'd love to hear from you. Use the form below to inquire about engagements or workshops.
                  </p>
                  <ContactForm contactIntent={contactIntent} />
              </div>
            </FadeIn>
        </section>

        {/* Footer */}
        <footer role="contentinfo" className="mt-20 pt-10 border-t border-white/5 pb-10">
            <FadeIn>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                   <div className="font-mono text-xs uppercase tracking-widest text-gray-400 space-y-1">
                        <p>&copy; 2026 quietloudlab.</p>
                        <p>Systems Thinking + Critical Futures.</p>
                   </div>
                   
                   <div className="flex flex-col md:flex-row gap-4 md:gap-6 font-mono text-xs uppercase tracking-widest text-gray-400 md:items-center">
                        <div className="flex gap-6">
                            <a href="https://www.linkedin.com/company/quietloudlab" target="_blank" rel="noopener noreferrer" className="hover:text-lab-olive transition-colors focus:outline-none focus:text-lab-olive focus:underline">LinkedIn</a>
                            <a href="mailto:brandon@quietloudlab.com" className="hover:text-lab-olive transition-colors focus:outline-none focus:text-lab-olive focus:underline">Email</a>
                        </div>
                        <span className="hidden md:inline text-white/20">|</span>
                        <span className="text-gray-400">Dallas, TX / Remote</span>
                        <span className="hidden md:inline text-white/20">|</span>
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-lab-olive transition-colors focus:outline-none focus:text-lab-olive focus:underline text-left">
                           Back to Top &uarr;
                        </button>
                   </div>
                </div>
            </FadeIn>
        </footer>

      </main>
      
      {/* Mobile Nav Bar */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 w-full bg-lab-black border-t border-white/10 p-4 flex justify-between overflow-x-auto gap-6 z-40">
           <NavItem label="Practice" targetId="practice" />
           <NavItem label="Join" targetId="engagement" />
           <NavItem label="Contact" targetId="contact" />
      </nav>

    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);