import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useInView, AnimatePresence, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowDown, Menu, X, Check, Loader2 } from 'lucide-react';
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

// --- Utility Components ---

const Magnetic = ({ children }: { children?: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

const ScrambleText = ({ text, className = "", hover = false }: { text: string, className?: string, hover?: boolean }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  useEffect(() => {
    if (!isInView && !hover) return;
    if (hover && !isHovered) {
        setDisplayText(text);
        return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(text.split("").map((letter, index) => {
        if (index < iteration) return text[index];
        if (letter === ' ') return ' ';
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [isInView, isHovered, hover, text]);

  return (
    <span
        ref={ref}
        className={className}
        onMouseEnter={() => hover && setIsHovered(true)}
        onMouseLeave={() => hover && setIsHovered(false)}
    >
        {displayText}
    </span>
  );
};

const RevealText = ({ children, delay = 0, className = "" }: { children?: React.ReactNode, delay?: number, className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const SectionHeader = ({ number, title }: { number: string, title: string }) => (
  <div className="flex flex-col md:flex-row items-baseline border-t border-lab-black/20 pt-6 pb-12 mb-8">
    <div className="mr-6 text-lab-olive mb-2 md:mb-0">
        <span className="font-mono text-sm md:text-base">(</span>
        <ScrambleText text={number} className="font-mono text-sm md:text-base" />
        <span className="font-mono text-sm md:text-base">)</span>
    </div>
    <h2 className="text-2xl md:text-4xl font-sans tracking-tight font-medium text-lab-black">{title}</h2>
  </div>
);

const LabGrid = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-8 ${className}`}>
    {children}
  </div>
);

const TimeDisplay = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const dalTime = new Date().toLocaleTimeString('en-US', {
        timeZone: 'America/Chicago',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setTime(dalTime);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2 font-mono text-sm text-gray-500" aria-label="Current time in Dallas">
      <div className="w-2 h-2 rounded-full bg-lab-olive animate-pulse" aria-hidden="true" />
      <span>DAL {time}</span>
    </div>
  );
};

const Logo = ({ className, dark = false }: { className?: string, dark?: boolean }) => (
  <LogoSvg className={`${className} ${dark ? 'text-lab-black' : 'text-lab-white'}`} />
);

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

      if (shouldReduceMotion) {
        setMessage(text);
        const focusTimeout = setTimeout(() => textareaRef.current?.focus(), 800);
        return () => clearTimeout(focusTimeout);
      }

      setMessage('');

      let typingInterval: ReturnType<typeof setInterval>;
      const startDelay = 700;

      const startTimeout = setTimeout(() => {
        if (!textareaRef.current) return;
        textareaRef.current.focus();

        let i = 0;
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
      message: message, // Use React state directly to capture auto-filled text
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
        setMessage('');
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
        className="bg-lab-black/5 border border-lab-olive/30 p-8 rounded-sm text-center py-20 h-full flex flex-col items-center justify-center"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-lab-olive/20 text-lab-olive mb-4">
          <Check size={24} aria-hidden="true" />
        </div>
        <h3 className="font-sans text-xl text-lab-black mb-2 font-medium">Message Received</h3>
        <p className="font-serif text-gray-600">I'll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="name" className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">Name *</label>
        <input
          type="text"
          name="name"
          id="name"
          required
          aria-required="true"
          placeholder="Your name"
          className="w-full bg-white border border-lab-black/10 rounded-sm p-3 text-lab-black placeholder-gray-400 focus:border-lab-olive focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label htmlFor="email" className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">Email *</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          aria-required="true"
          placeholder="your.email@example.com"
          className="w-full bg-white border border-lab-black/10 rounded-sm p-3 text-lab-black placeholder-gray-400 focus:border-lab-olive focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label htmlFor="message" className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">Message *</label>
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
          className="w-full bg-white border border-lab-black/10 rounded-sm p-3 text-lab-black placeholder-gray-400 focus:border-lab-olive focus:outline-none transition-colors resize-none"
        ></textarea>
      </div>

      <div className="pt-2">
        <label className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-4">I'm interested in...</label>
        <div className="space-y-3">
          {INTEREST_OPTIONS.map((option, i) => (
            <label key={i} className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  name="interests"
                  value={option}
                  className="peer appearance-none w-5 h-5 border border-lab-black/20 rounded-sm bg-white checked:bg-lab-olive checked:border-lab-olive transition-all mt-0.5 focus:ring-2 focus:ring-lab-olive focus:ring-offset-2 focus:ring-offset-white"
                />
                <Check size={12} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%-2px)] text-white opacity-0 peer-checked:opacity-100 pointer-events-none" aria-hidden="true" />
              </div>
              <span className="text-gray-700 group-hover:text-lab-black transition-colors font-serif text-lg leading-snug select-none">
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-lab-black hover:bg-lab-olive text-white font-mono text-sm uppercase tracking-widest py-4 rounded-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-lab-olive focus:ring-offset-2 focus:ring-offset-white"
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
        <p role="alert" className="text-red-600 font-mono text-xs text-center">Something went wrong. Please try again.</p>
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
      <label htmlFor="newsletter-email" className="font-mono text-xs uppercase tracking-widest text-gray-500">Stay Updated</label>
      <div className="flex gap-0">
        <input
          type="email"
          name="email"
          id="newsletter-email"
          required
          aria-required="true"
          placeholder="Email address"
          className="bg-white border border-lab-black/10 border-r-0 rounded-l-sm p-2 text-sm text-lab-black placeholder-gray-400 focus:border-lab-olive focus:outline-none transition-colors w-full"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          disabled={status === 'submitting'}
          className="bg-lab-black/10 hover:bg-lab-olive border border-lab-black/10 border-l-0 rounded-r-sm px-4 text-gray-700 hover:text-white transition-colors disabled:opacity-50 focus:ring-2 focus:ring-lab-olive focus:ring-offset-2 focus:ring-offset-white"
        >
          {status === 'submitting' ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <ArrowRight size={14} aria-hidden="true" />}
        </button>
      </div>
      {status === 'error' && <p role="alert" className="text-red-600 font-mono text-[10px]">Error subscribing.</p>}
    </form>
  );
};

// --- Sections ---

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const navItems = [
      { name: "Practice", href: "#practice" },
      { name: "Atlas", href: "#atlas" },
      { name: "Engagements", href: "#engagement" },
      { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-lab-white/90 backdrop-blur-md border-b border-lab-black/10" role="navigation" aria-label="Main">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 h-16 md:h-20 flex justify-between items-center relative">
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="z-10 focus:outline-none focus:ring-2 focus:ring-lab-olive focus:ring-offset-2 rounded-sm block" aria-label="quietloudlab home">
          <Logo className="h-4 md:h-5 w-auto hover:opacity-80 transition-opacity" dark />
        </a>

        <div className="hidden md:flex items-center space-x-8 font-mono text-sm uppercase tracking-widest">
           <TimeDisplay />
           <div className="h-4 w-px bg-gray-300 mx-2" />
           {navItems.map((item) => (
               <React.Fragment key={item.name}>
                   <Magnetic>
                       <a href={item.href} className="hover:text-lab-olive transition-colors focus:outline-none focus:text-lab-olive block px-2 py-1 text-lab-black">
                           {item.name}
                       </a>
                   </Magnetic>
               </React.Fragment>
           ))}
        </div>

        <button
          className="md:hidden z-50 p-2 focus:outline-none focus:ring-2 focus:ring-lab-olive"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-lab-olive origin-left"
        style={{ scaleX }}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 w-full bg-lab-white border-b border-lab-black/10 p-4 flex flex-col space-y-4 md:hidden"
          >
             {navItems.map(item => (
                 <a key={item.name} href={item.href} className="font-mono text-base uppercase p-2 block focus:outline-none focus:ring-2 focus:ring-lab-olive text-lab-black" onClick={() => setIsOpen(false)}>{item.name}</a>
             ))}
             <div className="pt-4 border-t border-gray-200">
               <TimeDisplay />
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();

  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="min-h-[90vh] flex flex-col justify-center px-6 md:px-12 max-w-screen-xl mx-auto pt-32 md:pt-40 overflow-hidden" aria-label="Introduction">
      <LabGrid>
        <div className="col-span-1 md:col-span-8 relative">

          {/* Headline - Layered for Parallax */}
          <div className="relative z-0">
            <RevealText className="mb-6">
                <h1 className="text-5xl md:text-6xl lg:text-8xl font-sans tracking-tight leading-tight font-medium text-lab-black selection:bg-lab-olive selection:text-white">
                  Design and research for more human futures
                </h1>
            </RevealText>
          </div>

          {/* The Content "Gap" - Glass effect */}
          <div className="relative z-10 mt-8 md:mt-16">
            <RevealText delay={0.2}>
              <div className="max-w-2xl bg-white/80 backdrop-blur-xl p-8 -ml-4 md:-ml-8 rounded-2xl border border-white/50 shadow-sm relative">
                <p className="text-xl md:text-2xl font-serif text-gray-700 leading-relaxed">
                  quietloudlab helps teams, startups, and organizations navigate complex or emerging technologies. We perform strategy work and build tools, frameworks, futures, and prototypes that validate and challenge the trajectory of investment before costly commitments are made.
                </p>
              </div>
            </RevealText>

            <RevealText delay={0.3}>
              <div className="mt-8 flex flex-col md:flex-row gap-4 relative z-20 pl-1">
                <Magnetic>
                  <a href="#engagement" className="group inline-flex items-center gap-2 bg-lab-black text-white px-8 py-3 font-mono text-sm uppercase tracking-widest hover:bg-lab-olive transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lab-olive shadow-lg">
                     See Engagements <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                  </a>
                </Magnetic>
                <Magnetic>
                   <a href="#contact" className="inline-flex items-center gap-2 border border-lab-black bg-white/50 backdrop-blur-sm text-lab-black px-8 py-3 font-mono text-sm uppercase tracking-widest hover:bg-lab-black hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lab-black">
                     Start a Conversation
                   </a>
                </Magnetic>
              </div>
            </RevealText>
          </div>
        </div>

        <div className="col-span-1 md:col-span-3 flex flex-col justify-end pb-4 hidden md:flex">
          <RevealText delay={0.4}>
            <div className="font-mono text-sm md:text-base leading-relaxed border-l border-lab-black pl-4">
              <p className="mb-4 text-lab-olive">
                [ EST. 2024 ]
              </p>
              <p className="text-gray-500">
                Exploring spaces between people, systems, technology, and futures.
              </p>
            </div>
          </RevealText>
        </div>
      </LabGrid>

      <motion.div style={{ opacity }} className="mt-20 md:mt-32 border-t border-lab-black/20 pt-4 flex justify-between items-center" aria-hidden="true">
        <span className="font-mono text-sm text-gray-500">SCROLL TO EXPLORE</span>
        <ArrowDown size={16} className="text-gray-500 animate-bounce" />
      </motion.div>
    </section>
  );
};

const Practice = () => {
  return (
    <section className="py-20 md:py-32 px-6 md:px-12 max-w-screen-xl mx-auto" id="practice" aria-labelledby="practice-heading">
      <SectionHeader number="01" title="Areas of Practice" />

      <LabGrid>
        <div className="col-span-1 md:col-span-7">
          <div className="grid grid-cols-1 gap-12">
            {PRACTICE_AREAS.map((area, i) => (
              <RevealText key={i} delay={i * 0.1}>
                <div className="group border-l-2 border-transparent hover:border-lab-olive pl-6 -ml-6 transition-all">
                  <h3 className="font-sans text-xl md:text-2xl font-medium mb-3 group-hover:text-lab-olive transition-colors text-lab-black">
                    {area.title}
                  </h3>
                  <p className="font-serif text-lg text-gray-600 leading-relaxed">
                    {area.desc}
                  </p>
                </div>
              </RevealText>
            ))}
          </div>
        </div>

        {/* The Dispatch (Sticky) */}
        <div className="col-span-1 md:col-span-5 relative" aria-labelledby="dispatch-heading">
           <div className="md:sticky md:top-32">
             <RevealText delay={0.2}>
                <div className="bg-lab-concrete p-6 md:p-8 border border-lab-black/5 rounded-lg">
                  <h2 id="dispatch-heading" className="font-sans text-lg font-medium text-lab-black mb-4">The Dispatch</h2>
                  <p className="font-serif text-gray-600 mb-6">
                    Occasional notes on systems, futures, and the lab's work. No spam, just signal.
                  </p>
                  <NewsletterForm />
                </div>
             </RevealText>
           </div>
        </div>
      </LabGrid>
    </section>
  );
};

const Atlas = () => {
  const dimensions = [
    { name: 'AI Patterns', desc: 'Probabilistic capabilities' },
    { name: 'Human Actions', desc: 'Where agency lives' },
    { name: 'System Ops', desc: 'Deterministic operations' },
    { name: 'Data', desc: 'What flows through' },
    { name: 'Constraints', desc: 'What cannot be violated' },
    { name: 'Touchpoints', desc: 'Where systems surface' },
  ];

  return (
    <section className="py-20 md:py-32 bg-lab-black text-lab-white relative overflow-hidden" id="atlas" aria-label="The Atlas Framework">
      {/* Dynamic Background */}
      <div
        className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-lab-olive rounded-full pointer-events-none"
        style={{
          opacity: 0.25,
          filter: 'blur(100px)',
        }}
      />

      <div className="max-w-screen-xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-sm text-lab-olive">(02)</span>
            <span className="font-mono text-sm text-lab-olive uppercase tracking-widest block">Open Source Tool</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-sans tracking-tight mb-8">The AI<br/>Interaction Atlas</h2>

        <LabGrid className="mb-16">
          <div className="col-span-1 md:col-span-7">
            <p className="font-serif text-xl md:text-2xl text-gray-300 leading-relaxed mb-6">
              A shared language for designing human-AI interaction systems.
            </p>
            <p className="font-serif text-lg text-gray-400 leading-relaxed mb-8">
              AI systems are designed at the wrong level of abstraction. Teams say "add an agent" or "use an LLM" instead of asking what matters: What's probabilistic vs. deterministic? Where does human judgment remain essential? What constraints govern safety and trust?
            </p>
            <p className="font-serif text-lg text-gray-400 leading-relaxed">
              The Atlas makes invisible systems visible—a vocabulary for designing AI as legible, inspectable systems where capabilities, constraints, and responsibility are explicit by design.
            </p>
          </div>

          <div className="col-span-1 md:col-span-5 flex items-start justify-end">
            <div className="font-mono text-sm text-gray-500 space-y-1 text-right">
              <p>Open Source • Apache 2.0</p>
              <p>6 Dimensions • 100+ Patterns</p>
              <p className="text-gray-600 text-xs mt-4">npm install @quietloudlab/ai-interaction-atlas</p>
            </div>
          </div>
        </LabGrid>

        {/* Six Dimensions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/10 mb-12">
          {dimensions.map((dim, i) => (
            <div key={i} className="bg-lab-black p-6 hover:bg-white/5 transition-colors group">
              <h3 className="font-sans text-base md:text-lg mb-1 group-hover:text-lab-olive transition-colors">{dim.name}</h3>
              <p className="font-mono text-xs text-gray-500">{dim.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Magnetic>
            <a href="https://atlas.quietloudlab.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-lab-white text-lab-black px-8 py-4 font-mono text-sm uppercase tracking-widest hover:bg-lab-olive hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white group">
              Explore the Atlas <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </Magnetic>
          <Magnetic>
            <a href="https://github.com/quietloudlab/ai-interaction-atlas" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 font-mono text-sm uppercase tracking-widest hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white group">
              View on GitHub
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
};

const Engagements = ({ onInquire }: { onInquire: (title: string, isCustom?: boolean) => void }) => {
  return (
    <section className="py-20 md:py-32 px-6 md:px-12 max-w-screen-xl mx-auto bg-lab-concrete" id="engagement" aria-labelledby="engagement-heading">
      <SectionHeader number="03" title="Engagement Models" />

      <RevealText>
        <div className="max-w-3xl mb-16">
          <p className="font-serif text-xl md:text-2xl text-gray-700 leading-relaxed">
            quietloudlab works directly with small teams and organizations designing complex systems—especially AI—at moments of uncertainty or risk. Engagements focus on making assumptions visible, aligning stakeholders, and surfacing consequences before decisions are locked into code.
          </p>
        </div>
      </RevealText>

      {/* CSS-based interaction using group/list for scroll-friendly hover */}
      <div className="flex flex-col gap-8 md:gap-0 group/list">
        {OFFERINGS.map((offer, index) => (
          <RevealText key={offer.title} delay={index * 0.1}>
            <div
              className="group border-t border-lab-black/20 py-8 md:py-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 transition-all duration-500 hover:bg-white/50 opacity-100 group-hover/list:opacity-50 hover:!opacity-100 px-4 md:px-8 -mx-4 md:-mx-8 rounded-lg"
            >

              {/* Left Column: Identity & Specs */}
              <div className="md:col-span-4 flex flex-col">
                <div>
                  <span className="font-mono text-sm text-lab-olive mb-3 block">(0{index + 1})</span>
                  <h3 className="text-2xl md:text-3xl font-sans tracking-tight mb-3 leading-none text-lab-black">
                    {offer.title}
                  </h3>
                  {offer.format && (
                    <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
                      Typical engagement: {offer.format}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column: Narrative & CTA */}
              <div className="md:col-span-8 flex flex-col justify-between">
                <div className="mb-6">
                  <p className="font-serif text-lg md:text-xl text-gray-800 leading-relaxed mb-4">
                    {offer.fit}
                  </p>
                  {offer.outcome && (
                    <p className="font-serif text-base text-gray-600 leading-relaxed">
                      {offer.outcome}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => onInquire(offer.title, offer.isCustom)}
                    className="bg-transparent border border-lab-black px-6 py-3 font-mono text-sm uppercase tracking-widest hover:bg-lab-black hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-lab-olive focus:ring-offset-2 group/btn inline-flex items-center gap-2"
                    aria-label={offer.isCustom ? "Let's define the brief" : `Inquire about ${offer.title}`}
                  >
                    <ScrambleText text={offer.isCustom ? "Let's Define the Brief" : "Inquire"} hover={true} />
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </RevealText>
        ))}
        {/* Closing border */}
        <div className="border-t border-lab-black/20" />
      </div>
    </section>
  );
};

const Contact = ({ contactIntent }: { contactIntent: ContactIntent | null }) => {
  return (
    <section id="contact" className="py-20 md:py-32 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="contact-heading">
      <SectionHeader number="04" title="Start a Conversation" />

      <LabGrid>
        <div className="col-span-1 md:col-span-7">
          <RevealText>
            <p className="font-serif text-gray-600 mb-8 text-lg md:text-xl max-w-2xl">
              If you are designing or deploying a system where clarity matters, we'd love to hear from you. Use the form below to inquire about engagements or workshops.
            </p>
          </RevealText>
          <RevealText delay={0.1}>
            <ContactForm contactIntent={contactIntent} />
          </RevealText>
        </div>

        <div className="col-span-1 md:col-span-5 hidden md:block">
          <RevealText delay={0.2}>
            <div className="md:sticky md:top-32 font-mono text-sm text-gray-500 space-y-8 pl-8 border-l border-lab-black/10">
              <div>
                <p className="uppercase tracking-widest mb-2 text-lab-olive">Location</p>
                <p>Dallas, TX / Remote</p>
              </div>
              <div>
                <p className="uppercase tracking-widest mb-2 text-lab-olive">Email</p>
                <a href="mailto:brandon@quietloudlab.com" className="hover:text-lab-olive transition-colors">brandon@quietloudlab.com</a>
              </div>
              <div>
                <p className="uppercase tracking-widest mb-2 text-lab-olive">Connect</p>
                <a href="https://www.linkedin.com/company/quietloudlab" target="_blank" rel="noopener noreferrer" className="hover:text-lab-olive transition-colors">LinkedIn</a>
              </div>
            </div>
          </RevealText>
        </div>
      </LabGrid>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-lab-black text-lab-white py-16 px-6 md:px-12 border-t border-white/10" role="contentinfo">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div>
            <Logo className="h-5 w-auto mb-6" />
            <p className="font-mono text-sm text-gray-400 max-w-xs">
              Systems Thinking + Critical Futures
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-12 font-mono text-sm uppercase tracking-widest text-gray-400">
            <a href="https://www.linkedin.com/company/quietloudlab" target="_blank" rel="noopener noreferrer" className="hover:text-lab-olive transition-colors focus:outline-none focus:text-lab-olive">LinkedIn</a>
            <a href="mailto:brandon@quietloudlab.com" className="hover:text-lab-olive transition-colors focus:outline-none focus:text-lab-olive">Email</a>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-lab-olive transition-colors focus:outline-none focus:text-lab-olive text-left">
               Back to Top &uarr;
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t border-white/20 pt-8 font-mono text-xs text-gray-500">
          <div className="mb-4 md:mb-0">
            <span>&copy; 2026 quietloudlab. All rights reserved.</span>
          </div>
          <div>
            <span>Dallas, TX / Remote</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- App ---

const App = () => {
  const [contactIntent, setContactIntent] = useState<ContactIntent | null>(null);

  const handleInquire = (title: string, isCustom = false) => {
    const text = isCustom
      ? "I'm not sure exactly what we need yet, but I'd like to discuss a potential collaboration."
      : `I'm interested in exploring the "${title}" engagement for my team.`;

    setContactIntent({ text, id: Date.now() });

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-lab-white min-h-screen selection:bg-lab-olive selection:text-white relative">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-lab-black focus:text-lab-white focus:p-4 focus:font-mono focus:text-sm">Skip to content</a>

      <Navigation />

      <main id="main-content">
        <Hero />
        <Practice />
        <Atlas />
        <Engagements onInquire={handleInquire} />
        <Contact contactIntent={contactIntent} />
      </main>

      <Footer />

      {/* Mobile Nav Bar */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 w-full bg-lab-white border-t border-lab-black/10 p-4 flex justify-between overflow-x-auto gap-6 z-40">
        <a href="#practice" className="font-mono text-xs uppercase tracking-widest text-gray-600 hover:text-lab-olive transition-colors">Practice</a>
        <a href="#atlas" className="font-mono text-xs uppercase tracking-widest text-gray-600 hover:text-lab-olive transition-colors">Atlas</a>
        <a href="#engagement" className="font-mono text-xs uppercase tracking-widest text-gray-600 hover:text-lab-olive transition-colors">Join</a>
        <a href="#contact" className="font-mono text-xs uppercase tracking-widest text-gray-600 hover:text-lab-olive transition-colors">Contact</a>
      </nav>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
