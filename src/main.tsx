import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useInView, AnimatePresence, useSpring, useTransform, useReducedMotion, useMotionValueEvent } from 'framer-motion';
import { ArrowRight, ArrowDown, Menu, X, Check, Loader2, BrainCircuit, User, Settings, Database, SlidersHorizontal, Smartphone } from 'lucide-react';
import LogoSvg from './img/quietloudlab_logo_white.svg?react';

// Fathom Analytics
declare global {
  interface Window {
    fathom?: {
      trackEvent: (name: string, opts?: { _value?: number }) => void;
    };
  }
}

const trackEvent = (name: string) => {
  if (window.fathom) {
    window.fathom.trackEvent(name);
  }
};

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


type TrailImageItem = {
  description: string;
  media?: string;
};

const HERO_TRAIL_IMAGES: TrailImageItem[] = [
  { description: 'Trail image', media: '/images/trail/img0.png' },
  { description: 'Trail image', media: '/images/trail/img1.png' },
  { description: 'Trail video', media: '/images/trail/gif1.webm' },
  { description: 'Trail image', media: '/images/trail/img2.jpg' },
  { description: 'Trail image', media: '/images/trail/img3.jpg' },
  { description: 'Trail video', media: '/images/trail/gif2.webm' },
  { description: 'Trail image', media: '/images/trail/img4.png' },
  { description: 'Trail image', media: '/images/trail/img8.png' },
  { description: 'Trail video', media: '/images/trail/gif5.webm' },
  { description: 'Trail image', media: '/images/trail/img5.jpg' },
  { description: 'Trail video', media: '/images/trail/gif3.webm' },
  { description: 'Trail image', media: '/images/trail/img6.png' },
  { description: 'Trail image', media: '/images/trail/img9.png' },
  { description: 'Trail image', media: '/images/trail/img7.png' },
  { description: 'Trail video', media: '/images/trail/gif6.webm' },
];

type PhaseShowcaseItem = {
  title: string;
  timeline: string;
  problem: string;
  action: string;
  outcome: string;
  engagements: string[][];
  image: string;
  secondaryImage?: string;
};

const METHODOLOGY_PHASES: PhaseShowcaseItem[] = [
  {
    title: 'Explore',
    timeline: 'Timeline: 3 - 10 days',
    problem:
      'Are your experiments fit for scale? Is a chatbot really the right move? AI provides countless opportunities for innovation, but do you know if the one you chose is right for your users?',
    action:
      "Together, we'll dive into the context you're experimenting within to quickly and thoroughly map and plan the AI system you should build.",
    outcome:
      'A legible, prioritized vision for AI systems that solve real problems for real people, and a strategy your team can reason from.',
    engagements: [
      ['AI Opportunity Discovery', 'Identify which problems AI is particularly well-suited to solve, and which are not.'],
      ['AI Interaction Exploration', 'Define the core purpose, functionality, and interaction model of your AI solution.'],
      ['Innovation Workshops', 'Quickly align the team on what needs to be built, why, and how.'],
    ],
    image: '/images/hwh/explore.jpg',
    secondaryImage: '/images/hwh/explore2.webp',
  },
  {
    title: 'Validate',
    timeline: 'Timeline: 2 - 4 weeks',
    problem:
      'Do your users truly understand the new AI tool you\'re building? Do your stakeholders see the value? How might we prove the concept before securing budget or spending months building?',
    action:
      "We'll build tangible, interactive prototypes of your AI system that work on real data, capture insight with real users and stakeholders, and validate the behavior of the product.",
    outcome:
      'Validated product direction and the insights needed to secure buy-in, surfaced through a high-fidelity experiential prototype we test and iterate on directly with real users.',
    engagements: [
      ['Experiential Prototyping', 'Build interactive, testable interfaces that simulate the AI experience.'],
      ['Behavioral Testing', 'Put the prototype in front of humans to validate the interaction and uncover friction points early.'],
      ['Executive Show-and-Tell', 'Create high-impact visual artifacts designed specifically to secure internal alignment and funding.'],
    ],
    image: '/images/hwh/validate.png',
    secondaryImage: '/images/hwh/validate2.webp',
  },
  {
    title: 'Design',
    timeline: 'Timeline: 4 - 6 weeks',
    problem:
      'What does an AI system look like with a person in the middle of it? Is the shape of the system right for your users? Moving from a promising concept to a buildable product is notoriously messy.',
    action:
      "Together, we'll translate your AI concepts into a buildable architecture and interaction design that maps what the system needs to know, do, and what that means for the person using it.",
    outcome:
      'Actionable system blueprints and interaction models that your team can reason from. We frame the key system experience, design, and technical constraints so your team builds exactly what needs to be built.',
    engagements: [
      ['System & Architecture Mapping', 'Define the layer beneath the interaction: data flows, model constraints, and system logic.'],
      ['Human-AI Workflow Design', 'Map exactly how the human and the intelligent system will collaborate step-by-step.'],
      ['Structural Concept Design', 'Build the structural and interaction models that prove the logic of the system holds up against human context and complexity.'],
    ],
    image: '/images/hwh/design.webp',
    secondaryImage: '/images/hwh/design2.webp',
  },
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

// --- Mouse Trail ---

type TrailItem = {
  id: number;
  left: number;
  top: number;
  rotation: number;
  index: number;
  exiting?: boolean;
};

const ImagePlaceholder = ({
  aspectRatio = '1 / 1',
  description,
  className = '',
  radius,
  index,
  media,
}: {
  aspectRatio?: string;
  description: string;
  className?: string;
  radius?: string;
  index?: number;
  media?: string;
}) => (
  <div
    className={`relative overflow-hidden bg-lab-concrete ${className}`}
    style={{ aspectRatio, borderRadius: radius ?? undefined }}
    aria-label={description}
    role="img"
  >
    {media && media.endsWith('.webm') ? (
      <video
        src={media}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
    ) : media ? (
      <img
        src={media}
        alt={description}
        className="absolute inset-0 w-full h-full object-cover"
      />
    ) : (
      <>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.8),_transparent_55%),linear-gradient(135deg,_rgba(107,116,86,0.12),_rgba(255,227,77,0.18))]" />
        <div className="absolute inset-0 p-4 text-gray-500">
          {index ? <div className="mb-4 text-xs font-bold">#{index}</div> : null}
          <div className="flex h-full items-center justify-center text-center text-xs font-medium leading-5 sm:text-sm">
            {description}
          </div>
        </div>
      </>
    )}
  </div>
);

const useMouseTrail = (items: TrailImageItem[]) => {
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));
  const containerRef = useRef<HTMLElement>(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const idRef = useRef(0);
  const mobileVideos = React.useMemo(() => items.filter(item => item.media?.endsWith('.webm')), [items]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    // Videos advance via onEnded, no interval needed
    return;
  }, [isMobile, mobileVideos.length]);

  useEffect(() => {
    const exitingItems = trail.filter((item) => item.exiting);
    if (!exitingItems.length) return;
    const timeouts = exitingItems.map((item) =>
      window.setTimeout(() => {
        setTrail((current) => current.filter((entry) => entry.id !== item.id));
      }, 320),
    );
    return () => { timeouts.forEach((t) => window.clearTimeout(t)); };
  }, [trail]);

  const onMove = (e: React.MouseEvent) => {
    if (isMobile || !containerRef.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150) return;
    lastPos.current = { x: e.clientX, y: e.clientY };
    const rect = containerRef.current.getBoundingClientRect();
    const nextItem: TrailItem = {
      id: idRef.current++,
      left: e.clientX - rect.left - 120,
      top: e.clientY - rect.top - 80,
      rotation: Math.random() * 10 - 5,
      index: idRef.current % items.length,
    };
    setTrail((current) => {
      const visible = current.filter((item) => !item.exiting);
      const nextTrail = [...current, nextItem];
      if (visible.length >= 9) {
        const oldestVisible = nextTrail.find((item) => !item.exiting);
        if (oldestVisible) {
          return nextTrail.map((item) => (item.id === oldestVisible.id ? { ...item, exiting: true } : item));
        }
      }
      return nextTrail;
    });
  };

  const advanceMobile = () => setMobileIndex((current) => (current + 1) % mobileVideos.length);
  return { trail, isMobile, mobileIndex, mobileVideos, onMove, containerRef, items, advanceMobile };
};

const MobileVideoPlayer = ({ videos, index, onEnded }: { videos: TrailImageItem[], index: number, onEnded: () => void }) => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === index) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [index]);

  return (
    <div className="absolute inset-0 opacity-30">
      {videos.map((vid, i) => (
        <video
          key={i}
          ref={(el) => { videoRefs.current[i] = el; }}
          src={vid.media}
          muted
          playsInline
          onEnded={() => i === index && onEnded()}
          className={`absolute inset-0 w-full h-full object-cover ${i === index ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  );
};

const MouseTrailLayer = ({ state }: { state: ReturnType<typeof useMouseTrail> }) => {
  const { trail, isMobile, mobileIndex, mobileVideos, items, advanceMobile } = state;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {!isMobile ? (
        <AnimatePresence>
          {trail.map((item, order) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: item.exiting ? 0 : 1, scale: item.exiting ? 0.98 : 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: item.exiting ? 0.3 : 0.2 }}
              className="absolute w-[180px] sm:w-[216px]"
              style={{
                left: item.left,
                top: item.top,
                rotate: `${item.rotation}deg`,
                zIndex: order + 1,
              }}
            >
              <ImagePlaceholder
                index={item.index + 1}
                description={items[item.index].description}
                media={items[item.index].media}
                aspectRatio="1 / 1"
                className="shadow-lg"
                radius="16px"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      ) : (
        <MobileVideoPlayer videos={mobileVideos} index={mobileIndex} onEnded={advanceMobile} />
      )}
    </div>
  );
};

// --- Sticky Phase Showcase ---

const OliveTag = ({ children }: { children?: React.ReactNode }) => (
  <span className="inline-block bg-lab-olive/20 text-lab-olive px-2 py-1 text-xs font-mono uppercase tracking-widest">
    {children}
  </span>
);

const StickyPhaseShowcase = ({ phases }: { phases: PhaseShowcaseItem[] }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const markerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLDivElement>,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const segment = 1 / phases.length;
    const next = Math.min(Math.floor(value / segment), phases.length - 1);
    setActive(next);
  });

  const scrollToPhase = (index: number) => {
    const marker = markerRefs.current[index];
    if (marker) marker.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' as const } } };
  const fadeUpSlow = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } } };

  return (
    <>
      {/* Desktop */}
      <div ref={ref} className="relative hidden xl:block" style={{ height: `${phases.length * 100}svh` }}>
        {/* Scroll markers for click-to-navigate */}
        {phases.map((phase, i) => (
          <div key={phase.title} ref={(node) => { markerRefs.current[i] = node; }} className="absolute" style={{ top: `${(i / phases.length) * 100}%` }} />
        ))}

        <div className="sticky top-0 relative flex h-screen flex-col pt-[max(3svh,1.5rem)] pb-[max(4svh,2rem)]">
          <div className="w-full px-6 md:px-12 flex-1 min-h-0 overflow-hidden">
            <div className="grid h-full gap-[clamp(24px,2.5vw,88px)] grid-cols-[0.94fr_1.16fr_1fr]">
              {/* Left: Phase titles */}
              <div className="flex min-w-0 flex-col justify-start pt-[min(5.5svh,4.25rem)]">
                <p className="font-mono text-sm uppercase tracking-widest text-lab-olive mb-6">How we help</p>
                <div className="relative flex-1">
                  {phases.map((phase, index) => (
                    <div key={phase.title} className="relative leading-none py-[clamp(0.9rem,1.9svh,1.6rem)] pl-[clamp(1.2rem,1.5vw,1.8rem)]">
                      {index === active && (
                        <motion.span
                          layoutId="phase-dot"
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-[8px] w-[8px] rounded-[1px] bg-lab-olive"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => scrollToPhase(index)}
                        className={`font-sans font-medium transition-colors duration-200 cursor-pointer hover:text-lab-olive ${index === active ? 'text-lab-black' : 'text-gray-400'}`}
                        style={{
                          fontSize: 'clamp(3.5rem, min(7.4vw, 8svh), 9rem)',
                          lineHeight: 0.86,
                          letterSpacing: '-0.07em',
                          display: 'inline-block',
                          background: 'none',
                          border: 'none',
                          padding: 0,
                        }}
                      >
                        {phase.title}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Middle: Problem / Action / Outcome + secondary image */}
              <div className="flex flex-col min-w-0 pt-[min(10svh,9rem)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={phases[active].title}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
                    className="flex flex-col flex-1"
                  >
                    <div className="space-y-[clamp(1.2rem,3svh,3.6rem)]">
                      <motion.div variants={fadeUp}>
                        <OliveTag>Problem</OliveTag>
                        <p className="mt-3 max-w-[44ch] font-sans text-gray-600 leading-[1.7]" style={{ fontSize: 'clamp(0.875rem, min(1.8vw, 2.2svh), 1.7rem)' }}>
                          {phases[active].problem}
                        </p>
                      </motion.div>
                      <motion.div variants={fadeUp}>
                        <OliveTag>What we&apos;ll do</OliveTag>
                        <p className="mt-3 max-w-[44ch] font-sans text-gray-600 leading-[1.7]" style={{ fontSize: 'clamp(0.875rem, min(1.8vw, 2.2svh), 1.7rem)' }}>
                          {phases[active].action}
                        </p>
                      </motion.div>
                      <motion.div variants={fadeUp}>
                        <OliveTag>Outcome</OliveTag>
                        <p className="mt-3 max-w-[44ch] font-sans text-gray-600 leading-[1.7]" style={{ fontSize: 'clamp(0.875rem, min(1.8vw, 2.2svh), 1.7rem)' }}>
                          {phases[active].outcome}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right: Timeline, Engagements */}
              <div className="flex flex-col min-w-0 pt-[min(10svh,9rem)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${phases[active].title}-meta`}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } }, hidden: {} }}
                    className="flex flex-col"
                  >
                    <motion.div className="max-w-[22rem] ml-auto" variants={fadeUp}>
                      <p className="font-sans font-medium text-lab-black" style={{ fontSize: 'clamp(0.8rem, 1.8svh, 1rem)' }}>Typical Engagements</p>
                      <div className="space-y-[clamp(0.5rem,1.5svh,1rem)]" style={{ marginTop: 'clamp(0.5rem,1.5svh,1rem)' }}>
                        {phases[active].engagements.map(([title, body]) => (
                          <div key={title}>
                            <p className="font-sans font-medium text-lab-black" style={{ fontSize: 'clamp(0.75rem, 1.6svh, 0.875rem)' }}>{title}</p>
                            <p className="mt-0.5" style={{ fontSize: 'clamp(0.75rem, 1.6svh, 0.875rem)' }}>{body}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
          {/* Secondary image — under middle column */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`img2-${phases[active].title}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.45 }}
              className="absolute bottom-[max(4svh,2rem)] right-[34%] w-[clamp(6rem,calc(6vw+5svh),16rem)] aspect-square overflow-hidden hidden [@media(min-height:800px)]:block"
            >
              <ImagePlaceholder
                description={phases[active].title}
                media={phases[active].secondaryImage}
                className="w-full h-full"
                radius="20px"
              />
            </motion.div>
          </AnimatePresence>

          {/* Primary image — bottom right */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${phases[active].title}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.2 }}
              className="absolute bottom-[max(4svh,2rem)] right-6 md:right-12"
            >
              {/* Primary image */}
              <motion.div
                className="w-[clamp(10rem,calc(14vw+14svh),42rem)] aspect-square overflow-hidden"
                variants={fadeUpSlow}
              >
                <ImagePlaceholder
                  description={phases[active].title}
                  media={phases[active].image}
                  className="w-full h-full"
                  radius="28px"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
          <div className="px-6 md:px-12 mt-[clamp(0.5rem,1.5svh,1rem)]">
            <Magnetic>
              <a href="#contact" onClick={() => trackEvent('HWH CTA: Start a Conversation')} className="inline-flex items-center gap-2 bg-lab-black text-white px-8 py-3 font-mono text-sm uppercase tracking-widest hover:bg-lab-olive transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lab-olive">
                Start a Conversation <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet */}
      <div className="space-y-12 px-6 md:px-12 pt-12 md:pt-16 xl:hidden">
        {phases.map((phase) => (
          <div key={phase.title} className="border-b border-lab-black/10 pb-12">
            <div className="font-sans font-medium text-lab-black" style={{ fontSize: 'clamp(3rem, 13vw, 4.5rem)', lineHeight: 0.92, letterSpacing: '-0.06em' }}>
              {phase.title}
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <OliveTag>Problem</OliveTag>
                  <p className="mt-3 font-serif text-lg text-gray-600 leading-relaxed">{phase.problem}</p>
                </div>
                <div>
                  <OliveTag>What we&apos;ll do</OliveTag>
                  <p className="mt-3 font-serif text-lg text-gray-600 leading-relaxed">{phase.action}</p>
                </div>
                <div>
                  <OliveTag>Outcome</OliveTag>
                  <p className="mt-3 font-serif text-lg text-gray-600 leading-relaxed">{phase.outcome}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="font-sans text-base font-medium text-lab-black">Typical Engagements</p>
                  <div className="mt-3 space-y-4 font-serif text-base text-gray-600 leading-relaxed">
                    {phase.engagements.map(([title, body]) => (
                      <div key={title}>
                        <p className="font-sans font-medium text-lab-black">{title}</p>
                        <p>{body}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <ImagePlaceholder description={phase.title} media={phase.image} aspectRatio="4 / 5" radius="22px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
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
        trackEvent('Contact Form Submitted');
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
    <form onSubmit={onSubmit} className="space-y-6">
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
        <label htmlFor="message" className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">Message</label>
        <textarea
          ref={textareaRef}
          name="message"
          id="message"
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
        trackEvent('Newsletter Subscribed');
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
      { name: "Tools", href: "#atlas" },
      { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-lab-white/90 backdrop-blur-md border-b border-lab-black/10" role="navigation" aria-label="Main">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 h-12 md:h-14 flex justify-between items-center relative">
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="z-10 focus:outline-none focus:ring-2 focus:ring-lab-olive focus:ring-offset-2 rounded-sm block" aria-label="quietloudlab home">
          <Logo className="h-3 md:h-3.5 w-auto hover:opacity-80 transition-opacity" dark />
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
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef as React.RefObject<HTMLElement>, offset: ['start start', 'end start'] });
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, 1000]);
  const trailState = useMouseTrail(HERO_TRAIL_IMAGES);

  const setRefs = (el: HTMLElement | null) => {
    (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
    (trailState.containerRef as React.MutableRefObject<HTMLElement | null>).current = el;
  };

  return (
    <>
    <div className="relative overflow-hidden bg-[#F7F7F9]">
    <section ref={setRefs} onMouseMove={trailState.onMove} className="relative flex flex-col justify-start overflow-hidden" style={{ minHeight: 'calc(100svh - 3.5rem)' }} aria-label="Introduction">
      <MouseTrailLayer state={trailState} />
      <div className="max-w-screen-xl mx-auto w-full px-6 md:px-12 pt-32 md:pt-[14vh] relative z-10 flex flex-col flex-1">
        <motion.div style={{ y: headlineY }} className="relative" onMouseMove={e => e.stopPropagation()}>
          <RevealText className="mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-sans tracking-tight leading-tight font-medium text-lab-black selection:bg-lab-olive selection:text-white">
              Innovation strategy & design for the human layer of intelligent systems
            </h1>
          </RevealText>
        </motion.div>

        <div className="mt-auto border-t border-lab-black/20 pt-4 pb-[4vh] flex justify-between items-center" onMouseMove={e => e.stopPropagation()}>
          <RevealText delay={0.2}>
            <div className="flex flex-col md:flex-row gap-4">
              <Magnetic>
                 <a href="#contact" onClick={() => trackEvent('Hero CTA: Start a Conversation')} className="inline-flex items-center gap-2 border border-lab-black bg-white/50 backdrop-blur-sm text-lab-black px-8 py-3 font-mono text-sm uppercase tracking-widest hover:bg-lab-black hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lab-black">
                   Start a Conversation
                 </a>
              </Magnetic>
            </div>
          </RevealText>
          <ArrowDown size={16} className="text-gray-500 animate-bounce hidden md:block" />
        </div>
      </div>
    </section>
    </div>

    {/* Intro */}
    <section className="pt-40 md:pt-52 pb-40 md:pb-52 px-6 md:px-12">
      <div className="max-w-screen-2xl mx-auto">
        <RevealText>
          <p className="font-mono text-sm text-gray-500 uppercase tracking-widest mb-6">[ EST. 2024 ] Exploring spaces between people, systems, technology, and futures.</p>
        </RevealText>
        <RevealText delay={0.1}>
          <p className="text-3xl md:text-5xl lg:text-6xl font-sans text-gray-700" style={{ lineHeight: 1.6 }}>
            quietloudlab is a partner for building with emerging technologies in complex environments. We help future-facing clients and partners see the current state for what it is, decide what needs to be made, and make it land with the people we build for. We perform strategy, design systems, facilitate teams in exploration, and prototype new concepts.
          </p>
        </RevealText>
      </div>
    </section>
    </>
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

const HouseBuiltTools = () => {
  return (
    <section className="py-20 md:py-32 px-6 md:px-12 max-w-[1800px] mx-auto" id="atlas" aria-label="House-built Tools">
      <SectionHeader number="02" title="Tools" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 auto-rows-fr">
        {/* AI Interaction Atlas */}
        <RevealText className="h-full">
          <div className="bg-lab-black text-lab-white rounded-[20px] flex flex-col relative overflow-hidden h-full">
            {/* Content */}
            <div className="relative z-10 p-6 md:p-8 lg:p-10 pb-0 md:pb-0 lg:pb-0">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-3xl md:text-4xl font-sans tracking-tight leading-[1.1]">AI Interaction<br/>Atlas</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white shrink-0 mt-1 hidden sm:block">Open Source • Apache 2.0</span>
              </div>
              <p className="font-sans text-[15px] text-gray-400 leading-relaxed max-w-lg mb-2">
                A shared vocabulary for designing and governing AI systems, explicitly defining capabilities, constraints, interactions and responsibility.
              </p>
            </div>

            {/* Six Dimensions Grid */}
            <div className="relative z-10 px-6 md:px-8 lg:px-10 my-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/10 rounded-xl overflow-hidden">
                {[
                  { icon: BrainCircuit, color: 'text-purple-400', name: 'AI Patterns', desc: 'Probabilistic capabilities: detect, classify, transform, generate.' },
                  { icon: User, color: 'text-blue-400', name: 'Human Actions', desc: 'Where agency lives: review, decide, configure, approve.' },
                  { icon: Settings, color: 'text-gray-400', name: 'System Ops', desc: 'Deterministic operations: routing, caching, logging.' },
                  { icon: Database, color: 'text-amber-400', name: 'Data', desc: 'What flows through: inputs, outputs, context.' },
                  { icon: SlidersHorizontal, color: 'text-red-400', name: 'Constraints', desc: 'What cannot be violated: latency, privacy, accuracy.' },
                  { icon: Smartphone, color: 'text-cyan-400', name: 'Touchpoints', desc: 'Where systems surface: screens, voice, notifications.' },
                ].map((dim) => (
                  <div key={dim.name} className="bg-lab-black p-3 lg:p-4">
                    <dim.icon size={18} className={`${dim.color} mb-2`} />
                    <p className="font-sans text-[13px] font-medium text-white mb-1">{dim.name}</p>
                    <p className="font-mono text-[10px] text-gray-500 leading-relaxed">{dim.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1" />

            {/* Buttons pinned to bottom-left */}
            <div className="relative z-10 px-6 md:px-8 lg:px-10 py-5 flex flex-wrap gap-3">
              <a href="https://ai-interaction.com" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('Atlas Link Clicked')} className="inline-flex items-center gap-2 bg-lab-white text-lab-black px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-widest hover:bg-lab-olive hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white group/btn">
                Explore <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
              </a>
              <a href="https://github.com/quietloudlab/ai-interaction-atlas" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('GitHub Link Clicked')} className="inline-flex items-center gap-2 border border-white/15 text-gray-400 px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white">
                GitHub
              </a>
            </div>
          </div>
        </RevealText>

        {/* AI Interaction Studio */}
        <RevealText delay={0.1} className="h-full">
          <div className="bg-lab-black text-lab-white rounded-[20px] flex flex-col relative overflow-hidden h-full min-h-[420px]">
            {/* Background image — 50% card height, right-aligned, overflows right on small screens */}
            <img
              src="/images/atlas/edge-routing.png"
              alt=""
              aria-hidden="true"
              className="absolute right-0 rounded-tl-xl pointer-events-none object-cover object-left-top"
              style={{ bottom: '10%', height: '50%', width: 'auto', minWidth: '600px' }}
            />

            {/* Content with gradient overlay */}
            <div className="relative z-10 p-6 md:p-8 lg:p-10 pb-0 bg-gradient-to-b from-lab-black via-lab-black/90 to-transparent">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-3xl md:text-4xl font-sans tracking-tight leading-[1.1]">AI Interaction<br/>Studio</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white shrink-0 mt-1 hidden sm:block">Visual Mapping Tool</span>
              </div>
              <p className="font-sans text-[15px] text-gray-400 leading-relaxed max-w-lg mb-4">
                Ideate and visualize any human-AI experience, documenting how the system lives in the world, built on the Atlas taxonomy.
              </p>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Button pinned to bottom-left */}
            <div className="relative z-10 px-6 md:px-8 lg:px-10 py-5">
              <a href="https://studio.ai-interaction.com" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('Studio Link Clicked')} className="inline-flex items-center gap-2 bg-lab-white text-lab-black px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-widest hover:bg-lab-olive hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white group/btn">
                Map your AI System <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </RevealText>
      </div>
    </section>
  );
};


const Contact = ({ contactIntent }: { contactIntent: ContactIntent | null }) => {
  return (
    <section id="contact" className="py-20 md:py-32 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="contact-heading">
      <SectionHeader number="03" title="Start a Conversation" />

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
                <a href="mailto:brandon@quietloudlab.com" onClick={() => trackEvent('Email Link Clicked')} className="hover:text-lab-olive transition-colors">brandon@quietloudlab.com</a>
              </div>
              <div>
                <p className="uppercase tracking-widest mb-2 text-lab-olive">Connect</p>
                <a href="https://www.linkedin.com/company/quietloudlab" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('LinkedIn Link Clicked')} className="hover:text-lab-olive transition-colors">LinkedIn</a>
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
            <a href="https://www.linkedin.com/company/quietloudlab" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('LinkedIn Link Clicked')} className="hover:text-lab-olive transition-colors focus:outline-none focus:text-lab-olive">LinkedIn</a>
            <a href="mailto:brandon@quietloudlab.com" onClick={() => trackEvent('Email Link Clicked')} className="hover:text-lab-olive transition-colors focus:outline-none focus:text-lab-olive">Email</a>
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
  return (
    <div className="w-full bg-lab-white min-h-screen selection:bg-lab-olive selection:text-white relative">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-lab-black focus:text-lab-white focus:p-4 focus:font-mono focus:text-sm">Skip to content</a>

      <Navigation />

      <main id="main-content">
        <Hero />
        <div className="bg-lab-olive/20">
          <StickyPhaseShowcase phases={METHODOLOGY_PHASES} />
        </div>
        <Practice />
        <HouseBuiltTools />
        <Contact contactIntent={null} />
      </main>

      <Footer />

      {/* Mobile Nav Bar */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 w-full bg-lab-white border-t border-lab-black/10 p-4 flex justify-between overflow-x-auto gap-6 z-40">
        <a href="#practice" className="font-mono text-xs uppercase tracking-widest text-gray-600 hover:text-lab-olive transition-colors">Practice</a>
        <a href="#atlas" className="font-mono text-xs uppercase tracking-widest text-gray-600 hover:text-lab-olive transition-colors">Atlas</a>
        <a href="#contact" className="font-mono text-xs uppercase tracking-widest text-gray-600 hover:text-lab-olive transition-colors">Contact</a>
      </nav>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
