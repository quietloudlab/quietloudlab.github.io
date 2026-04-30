import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useInView, AnimatePresence, useSpring, useTransform, useReducedMotion, useMotionValueEvent } from 'framer-motion';
import { ArrowRight, ArrowDown, Menu, X, Check, Loader2, BrainCircuit, User, Settings, Database, SlidersHorizontal, Smartphone, Users, Compass, Code2, Building2, Video, Mic, Plus, type LucideIcon } from 'lucide-react';
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

// --- Routing (minimal, dependency-free) ---

const usePath = () => {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const onChange = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);
  return path;
};

const navigateTo = (to: string) => {
  const [, hash] = to.split('#');
  if (to === window.location.pathname + window.location.hash) {
    if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  requestAnimationFrame(() => {
    if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  });
};

const PageLink = ({
  to,
  children,
  className,
  onClick,
  ...rest
}: {
  to: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'>) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onClick?.();
    navigateTo(to);
  };
  return (
    <a href={to} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
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
    <div className="flex items-center space-x-2 font-mono text-sm text-gray-600" aria-label="Current time in Dallas">
      <div className="w-2 h-2 rounded-full bg-lab-olive animate-pulse" aria-hidden="true" />
      <span>DAL {time}</span>
    </div>
  );
};

const Logo = ({ className, dark = false }: { className?: string, dark?: boolean }) => (
  <LogoSvg className={`${className} ${dark ? 'text-lab-black' : 'text-lab-white'}`} />
);

// --- Shape System ---
// Library of organic SVG clip-path shapes. Each shape is a normalized
// objectBoundingBox path (coordinates 0-1) so the same definition scales
// to any container size. Apply via the `shape` prop on ImagePlaceholder,
// the <Shaped> wrapper, or directly: style={{ clipPath: 'url(#qll-shape-cookie)' }}.

const polarShape = (
  radiusFn: (theta: number) => number,
  segments = 144,
) => {
  const points: string[] = [];
  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    const r = radiusFn(t);
    const x = (0.5 + r * Math.cos(t)).toFixed(4);
    const y = (0.5 + r * Math.sin(t)).toFixed(4);
    points.push(`${x},${y}`);
  }
  return `M ${points[0]} ${points.slice(1).map((p) => `L ${p}`).join(' ')} Z`;
};

const SHAPES = {
  circle:  'M 0.5,0 A 0.5,0.5 0 1,1 0.5,1 A 0.5,0.5 0 1,1 0.5,0 Z',
  soft:    'M 0.2,0 L 0.8,0 C 0.91,0 1,0.09 1,0.2 L 1,0.8 C 1,0.91 0.91,1 0.8,1 L 0.2,1 C 0.09,1 0,0.91 0,0.8 L 0,0.2 C 0,0.09 0.09,0 0.2,0 Z',
  softer:  'M 0.4,0 L 0.6,0 C 0.82,0 1,0.18 1,0.4 L 1,0.6 C 1,0.82 0.82,1 0.6,1 L 0.4,1 C 0.18,1 0,0.82 0,0.6 L 0,0.4 C 0,0.18 0.18,0 0.4,0 Z',
  pill:    'M 0.25,0 L 0.75,0 A 0.25,0.5 0 0,1 0.75,1 L 0.25,1 A 0.25,0.5 0 0,1 0.25,0 Z',
  arch:    'M 0,1 L 0,0.5 C 0,0.22 0.22,0 0.5,0 C 0.78,0 1,0.22 1,0.5 L 1,1 Z',
  diamond: 'M 0.5,0 L 1,0.5 L 0.5,1 L 0,0.5 Z',
  cookie:  polarShape((t) => 0.45 + 0.05 * Math.cos(8 * t)),
  flower:  polarShape((t) => 0.42 + 0.08 * Math.cos(6 * t)),
  clover:  polarShape((t) => 0.4 + 0.1 * Math.cos(4 * t + Math.PI / 4)),
  pebble:  polarShape((t) => 0.44 + 0.04 * Math.cos(3 * t + 0.5) + 0.02 * Math.sin(2 * t)),
} as const;

type ShapeName = keyof typeof SHAPES;

const SHAPE_ID_PREFIX = 'qll-shape';
const shapeUrl = (shape: ShapeName) => `url(#${SHAPE_ID_PREFIX}-${shape})`;

const ShapeDefs = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="0"
    height="0"
    style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
  >
    <defs>
      {Object.entries(SHAPES).map(([name, d]) => (
        <clipPath
          key={name}
          id={`${SHAPE_ID_PREFIX}-${name}`}
          clipPathUnits="objectBoundingBox"
        >
          <path d={d} />
        </clipPath>
      ))}
    </defs>
  </svg>
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
  shape,
  index,
  media,
}: {
  aspectRatio?: string;
  description: string;
  className?: string;
  radius?: string;
  shape?: ShapeName;
  index?: number;
  media?: string;
}) => (
  <div
    className={`relative overflow-hidden bg-lab-concrete ${className}`}
    style={{
      aspectRatio,
      borderRadius: shape ? undefined : radius ?? undefined,
      clipPath: shape ? shapeUrl(shape) : undefined,
    }}
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
        <div className="absolute inset-0 p-4 text-gray-600">
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
        <label htmlFor="name" className="block font-mono text-xs uppercase tracking-widest text-gray-600 mb-2">Name *</label>
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
        <label htmlFor="email" className="block font-mono text-xs uppercase tracking-widest text-gray-600 mb-2">Email *</label>
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
        <label htmlFor="message" className="block font-mono text-xs uppercase tracking-widest text-gray-600 mb-2">Message</label>
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
        <label className="block font-mono text-xs uppercase tracking-widest text-gray-600 mb-4">I'm interested in...</label>
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
      <label htmlFor="newsletter-email" className="font-mono text-xs uppercase tracking-widest text-gray-600">Stay Updated</label>
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
      {status === 'error' && <p role="alert" className="text-red-600 font-mono text-xs">Error subscribing.</p>}
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
      { name: "Practice", href: "/#practice" },
      { name: "Tools", href: "/#atlas" },
      { name: "Speaking", href: "/speaking" },
      { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-lab-white/90 backdrop-blur-md border-b border-lab-black/10" role="navigation" aria-label="Main">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 h-12 md:h-14 flex justify-between items-center relative">
        <PageLink to="/" className="z-10 focus:outline-none focus:ring-2 focus:ring-lab-olive focus:ring-offset-2 rounded-sm block" aria-label="quietloudlab home">
          <Logo className="h-3 md:h-3.5 w-auto hover:opacity-80 transition-opacity" dark />
        </PageLink>

        <div className="hidden md:flex items-center space-x-8 font-mono text-sm uppercase tracking-widest">
           <TimeDisplay />
           <div className="h-4 w-px bg-gray-300 mx-2" />
           {navItems.map((item) => (
               <React.Fragment key={item.name}>
                   <Magnetic>
                       <PageLink to={item.href} className="hover:text-lab-olive transition-colors focus:outline-none focus:text-lab-olive block px-2 py-1 text-lab-black">
                           {item.name}
                       </PageLink>
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
                 <PageLink key={item.name} to={item.href} className="font-mono text-base uppercase p-2 block focus:outline-none focus:ring-2 focus:ring-lab-olive text-lab-black" onClick={() => setIsOpen(false)}>{item.name}</PageLink>
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
      </div>

      {/* CTA pinned to bottom of hero, not affected by scroll transforms */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 md:px-12">
        <div className="max-w-screen-xl mx-auto w-full border-t border-lab-black/20 pt-4 pb-[4vh] flex justify-between items-center">
          <div className="flex flex-col md:flex-row gap-4">
            <Magnetic>
               <a href="#contact" onClick={() => trackEvent('Hero CTA: Start a Conversation')} className="inline-flex items-center gap-2 border border-lab-black bg-white/50 backdrop-blur-sm text-lab-black px-8 py-3 font-mono text-sm uppercase tracking-widest hover:bg-lab-black hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lab-black">
                 Start a Conversation
               </a>
            </Magnetic>
          </div>
          <ArrowDown size={16} className="text-gray-600 animate-bounce hidden md:block" />
        </div>
      </div>
    </section>
    </div>

    {/* Intro */}
    <section className="pt-40 md:pt-52 pb-40 md:pb-52 px-6 md:px-12">
      <div className="max-w-screen-2xl mx-auto">
        <RevealText>
          <p className="font-mono text-sm text-gray-600 uppercase tracking-widest mb-6">[ EST. 2024 ] Exploring spaces between people, systems, technology, and futures.</p>
        </RevealText>
        <RevealText delay={0.1}>
          <p className="text-3xl md:text-5xl lg:text-6xl font-sans text-gray-700" style={{ lineHeight: 1.6 }}>
            quietloudlab is a partner for building with emerging technologies in complex environments. We help future-facing clients and partners see the current state for what it is, decide what needs to be made, and make it land with the people we build for. We perform strategy, design systems, facilitate teams in exploration, and prototype new concepts.
          </p>
        </RevealText>
        <RevealText delay={0.2}>
          <div className="mt-12">
            <a href="https://calendly.com/brandonaharwood/ai-interaction-review" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('Book AI Interaction Review')} className="inline-flex items-center gap-2 bg-lab-black text-white px-8 py-4 font-mono text-sm uppercase tracking-widest hover:bg-lab-olive transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lab-black">
              Book an AI Interaction Review <ArrowRight size={14} />
            </a>
            <p className="mt-4 max-w-2xl font-sans text-base text-gray-600 leading-relaxed">
              A free 30-minute session where we look at your AI product or concept through the lens of the Atlas and identify the biggest gaps in how your system works for your users. You&apos;ll leave with 2–3 specific things to fix or explore.
            </p>
          </div>
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
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-white shrink-0 mt-1 hidden sm:block">Open Source • Apache 2.0</span>
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
                    <p className="font-mono text-xs text-gray-600 leading-relaxed">{dim.desc}</p>
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
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-white shrink-0 mt-1 hidden sm:block">Visual Mapping Tool</span>
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
            <div className="md:sticky md:top-32 font-mono text-sm text-gray-600 space-y-8 pl-8 border-l border-lab-black/10">
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

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t border-white/20 pt-8 font-mono text-xs text-gray-600">
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

// --- Speaking: shared primitives ---

type StatusTone = 'confirmed' | 'pending';

const SpeakingStatusBadge = ({ label, tone }: { label: string; tone: StatusTone }) => {
  const toneClass =
    tone === 'confirmed'
      ? 'bg-lab-olive/15 text-[#3d4332] border-lab-olive/30'
      : 'bg-lab-black/5 text-gray-700 border-lab-black/10';
  const dotClass = tone === 'confirmed' ? 'bg-lab-olive' : 'bg-gray-400';
  return (
    <span className={`inline-flex items-center gap-2 border px-2 py-1 font-mono text-xs uppercase tracking-widest ${toneClass}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
      {label}
    </span>
  );
};

const SpeakingBackLink = () => (
  <PageLink
    to="/speaking"
    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-600 hover:text-lab-olive transition-colors focus:outline-none focus:text-lab-olive"
  >
    <span aria-hidden="true">←</span> Speaking
  </PageLink>
);

const DetailSectionHeader = ({ id, number, title, kicker }: { id?: string; number?: string; title: string; kicker?: string }) => (
  <div className="flex flex-col md:flex-row items-baseline border-t border-lab-black/20 pt-6 pb-10 md:pb-12 mb-8">
    {number ? (
      <div className="mr-6 text-lab-olive mb-2 md:mb-0">
        <span className="font-mono text-sm md:text-base">(</span>
        <ScrambleText text={number} className="font-mono text-sm md:text-base" />
        <span className="font-mono text-sm md:text-base">)</span>
      </div>
    ) : null}
    <h2 id={id} className="text-2xl md:text-4xl font-sans font-medium text-lab-black">{title}</h2>
    {kicker ? <p className="md:ml-auto mt-3 md:mt-0 font-mono text-xs uppercase tracking-widest text-gray-600">{kicker}</p> : null}
  </div>
);

// --- Speaking: hub data ---

type SpeakingCard = {
  id: string;
  sortDate: string;
  formatTag: string;
  title: string;
  date: string;
  location: string;
  venue?: string;
  summary: string;
  href: string;
  status?: { label: string; tone: StatusTone };
};

const UPCOMING_CARDS: SpeakingCard[] = [
  {
    id: 'idea-lab-mastermind-2026',
    sortDate: '2026-05-05',
    formatTag: 'Lunch Talk · Chamber Members Only',
    title: 'Idea Lab Mastermind',
    date: 'Tue, May 5, 2026 · 11:30–1:00',
    location: 'Dallas, TX',
    venue: "McRae's American Bistro",
    summary: 'A 60-minute lunch session for East Dallas chamber members on practical AI for small business — what it actually solves, and how to set up Claude Cowork on a real problem.',
    href: '/speaking/idea-lab-mastermind',
  },
  {
    id: 'uxlx-2026',
    sortDate: '2026-05-12',
    formatTag: 'Conference · Talk + Workshop',
    title: 'UXLX 2026',
    date: 'May 12–15, 2026',
    location: 'Lisbon, Portugal',
    summary: 'A keynote and a three-hour workshop on the UXLX program — a week with the European design community.',
    href: '/speaking/uxlx-2026',
  },
  {
    id: 'ai-as-design-material-2026',
    sortDate: '2026-05-29',
    formatTag: 'Public Workshop · Two Dates',
    title: 'AI as a Design Material',
    date: 'May 29 & 30, 2026',
    location: 'The Hague · Amsterdam',
    summary: 'A three-hour working session on evaluating AI as a design material, co-facilitated with Matthijs Zwinderman. Running on back-to-back days across the Netherlands.',
    href: '/speaking/ai-as-design-material',
    status: { label: 'Two sessions', tone: 'confirmed' },
  },
];

const OPEN_WINDOWS_CARDS: SpeakingCard[] = [
  {
    id: 'barcelona-2026',
    sortDate: '2026-05-17',
    formatTag: 'Open Window · Seeking Partners',
    title: 'Barcelona',
    date: 'May 17–22, 2026',
    location: 'Spain',
    summary: 'Open dates for private in-company workshops, co-hosted public sessions, or dropping into a local event. A few ways we could put something together.',
    href: '/speaking/barcelona-2026',
  },
  {
    id: 'berlin-2026',
    sortDate: '2026-05-22',
    formatTag: 'Open Window · Seeking Partners',
    title: 'Berlin',
    date: 'May 22–27, 2026',
    location: 'Germany',
    summary: 'Same setup as Barcelona — open to private sessions, co-hosted workshops, or a guest talk at an existing event.',
    href: '/speaking/berlin-2026',
  },
];

type PastEvent = {
  id: string;
  date: string;
  title: string;
  location: string;
  format: string;
  link?: { label: string; href: string };
};

const PAST_EVENTS: PastEvent[] = [];

// --- Speaking: city option (Barcelona / Berlin) data ---

type EngagementOption = {
  icon: LucideIcon;
  title: string;
  fitsWhen: string;
  description: string;
};

const ENGAGEMENT_OPTIONS: EngagementOption[] = [
  {
    icon: Building2,
    title: 'Private in-company workshop',
    fitsWhen: 'Your team has a specific AI product or initiative to work through.',
    description: "A half- or full-day session built entirely around your organization's product, users, and the design decisions you're facing. Same frameworks; outputs are yours.",
  },
  {
    icon: Users,
    title: 'Co-hosted public workshop',
    fitsWhen: "You run a design community or innovation hub and want to put on a public session.",
    description: 'You bring the audience; we bring the workshop. Open to attendees from across your community, ticketed on the honor-system tier structure we use elsewhere.',
  },
  {
    icon: Video,
    title: 'Remote session',
    fitsWhen: "The calendar doesn't align for in-person, but the team still wants the workshop.",
    description: "Same three-hour session, held remotely. Works best for distributed teams or when the in-person window doesn't quite fit.",
  },
  {
    icon: Mic,
    title: 'Guest talk at a local event',
    fitsWhen: "You're organizing a meetup, conference, or internal event and want a talk on AI design.",
    description: 'A keynote-style session on AI as a design material, the human layer, or whatever angle fits the room. Shorter and lighter-weight than a workshop.',
  },
];

type CityOptionConfig = {
  slug: string;
  city: string;
  country: string;
  dateRange: string;
  shortDate: string;
  lead: string;
  engagements: EngagementOption[];
};

const CITY_OPTIONS: Record<string, CityOptionConfig> = {
  'barcelona-2026': {
    slug: 'barcelona-2026',
    city: 'Barcelona',
    country: 'Spain',
    dateRange: 'May 17–22, 2026',
    shortDate: 'May 17–22',
    lead: "Brandon is in Barcelona from May 17–22, 2026. Nothing on the calendar is confirmed yet, which means there's still room to put something together. A few ways that could work:",
    engagements: ENGAGEMENT_OPTIONS,
  },
  'berlin-2026': {
    slug: 'berlin-2026',
    city: 'Berlin',
    country: 'Germany',
    dateRange: 'May 22–27, 2026',
    shortDate: 'May 22–27',
    lead: "Brandon is in Berlin from May 22–27, 2026. Same setup as Barcelona: open for private sessions, co-hosted workshops, or dropping into an existing event. A few shapes this could take:",
    engagements: ENGAGEMENT_OPTIONS,
  },
};

// --- Speaking: hub components ---

const SpeakingHubHero = () => (
  <div className="bg-[#F7F7F9]">
    <section className="pt-28 md:pt-36 pb-16 md:pb-24 px-6 md:px-12 max-w-screen-xl mx-auto" aria-label="Speaking introduction">
      <RevealText>
        <p className="font-mono text-sm text-gray-600 uppercase tracking-widest mb-6">
          [ NOW SPEAKING ] Talks · Workshops · Appearances
        </p>
      </RevealText>
      <RevealText delay={0.1}>
        <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] font-sans tracking-tight leading-[1.05] font-medium text-lab-black max-w-5xl mb-8">
          Rooms we're showing up in.
        </h1>
      </RevealText>
      <RevealText delay={0.2}>
        <p className="font-sans text-lg md:text-2xl text-gray-700 max-w-3xl leading-relaxed">
          Public talks, workshops, and appearances. If you want us in a room of your own, there's a CTA at the bottom.
        </p>
      </RevealText>
    </section>
  </div>
);

type HubCardVariant = 'upcoming' | 'open-window';

const SpeakingHubCard = ({ card, variant = 'upcoming' }: { card: SpeakingCard; variant?: HubCardVariant }) => {
  const isOpenWindow = variant === 'open-window';
  const surfaceClass = isOpenWindow
    ? 'bg-lab-concrete border border-lab-black/10 hover:border-lab-olive'
    : 'bg-lab-white border border-lab-black/15 hover:border-lab-olive';
  const ctaLabel = isOpenWindow ? 'Explore options' : 'Learn more';
  return (
    <PageLink
      to={card.href}
      onClick={() => trackEvent(`Speaking Hub: ${card.id}`)}
      className={`group block rounded-2xl p-6 md:p-7 h-full flex flex-col transition-colors focus:outline-none focus:border-lab-olive focus:ring-2 focus:ring-lab-olive focus:ring-offset-2 ${surfaceClass}`}
    >
      <div className="flex justify-between items-start gap-3 mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-lab-olive leading-snug">
          {card.formatTag}
        </p>
        {card.status ? <SpeakingStatusBadge label={card.status.label} tone={card.status.tone} /> : null}
      </div>
      <h3 className="font-sans text-2xl md:text-[1.625rem] font-medium tracking-tight leading-tight text-lab-black group-hover:text-lab-olive transition-colors">
        {card.title}
      </h3>
      <p className="mt-4 font-serif text-base text-gray-600 leading-relaxed flex-1">
        {card.summary}
      </p>
      <div className="mt-6 pt-5 border-t border-lab-black/10 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-lab-olive" aria-hidden="true" />
        <p className="font-mono text-xs uppercase tracking-widest text-gray-600 leading-relaxed">
          {card.date}
        </p>
      </div>
      <p className="font-mono text-xs uppercase tracking-widest text-gray-600 leading-relaxed mt-1 ml-4">
        {card.location}
        {card.venue ? ` · ${card.venue}` : ''}
      </p>
      <p className="mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-lab-black">
        {ctaLabel}
        <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </p>
    </PageLink>
  );
};

const SpeakingUpcoming = () => {
  const cards: Array<{ card: SpeakingCard; variant: HubCardVariant }> = [
    ...UPCOMING_CARDS.map((card) => ({ card, variant: 'upcoming' as const })),
    ...OPEN_WINDOWS_CARDS.map((card) => ({ card, variant: 'open-window' as const })),
  ].sort((a, b) => a.card.sortDate.localeCompare(b.card.sortDate));
  return (
    <section id="upcoming" className="py-16 md:py-24 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="upcoming-heading">
      <div className="flex flex-col md:flex-row items-baseline border-t border-lab-black/20 pt-6 pb-10 md:pb-12 mb-8">
        <div className="mr-6 text-lab-olive mb-2 md:mb-0">
          <span className="font-mono text-sm md:text-base">(</span>
          <ScrambleText text="01" className="font-mono text-sm md:text-base" />
          <span className="font-mono text-sm md:text-base">)</span>
        </div>
        <h2 id="upcoming-heading" className="text-2xl md:text-4xl font-sans tracking-tight font-medium text-lab-black">
          Upcoming
        </h2>
        <p className="md:ml-auto mt-3 md:mt-0 font-mono text-xs uppercase tracking-widest text-gray-600">
          Europe · May 2026
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cards.map(({ card, variant }, i) => (
          <RevealText key={card.id} delay={i * 0.08}>
            <SpeakingHubCard card={card} variant={variant} />
          </RevealText>
        ))}
      </div>
    </section>
  );
};

const SpeakingPast = () => (
  <section id="past" className="py-16 md:py-24 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="past-heading">
    <div className="flex flex-col md:flex-row items-baseline border-t border-lab-black/20 pt-6 pb-10 md:pb-12 mb-8">
      <div className="mr-6 text-lab-olive mb-2 md:mb-0">
        <span className="font-mono text-sm md:text-base">(</span>
        <ScrambleText text="02" className="font-mono text-sm md:text-base" />
        <span className="font-mono text-sm md:text-base">)</span>
      </div>
      <h2 id="past-heading" className="text-2xl md:text-4xl font-sans tracking-tight font-medium text-lab-black">
        Past
      </h2>
    </div>
    <RevealText>
      <div className="border-t border-lab-black/15">
        {PAST_EVENTS.map((event) => (
          <div key={event.id} className="border-b border-lab-black/15 py-5 md:py-6 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6">
            <p className="md:col-span-2 font-mono text-sm text-gray-600">{event.date}</p>
            <div className="md:col-span-6">
              <p className="font-mono text-xs uppercase tracking-widest text-lab-olive mb-1">{event.format}</p>
              <h3 className="font-sans text-lg md:text-xl font-medium tracking-tight text-lab-black">{event.title}</h3>
            </div>
            <p className="md:col-span-2 font-mono text-sm text-gray-600">{event.location}</p>
            <div className="md:col-span-2 md:text-right">
              {event.link ? (
                <a
                  href={event.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent(`Speaking Past: ${event.id}`)}
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-lab-black hover:text-lab-olive transition-colors"
                >
                  {event.link.label} <ArrowRight size={12} aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </RevealText>
  </section>
);

const SpeakingHireCTA = ({ number }: { number: string }) => (
  <section id="hire" className="py-20 md:py-32 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="hire-heading">
    <div className="flex flex-col md:flex-row items-baseline border-t border-lab-black/20 pt-6 pb-10 md:pb-12 mb-8">
      <div className="mr-6 text-lab-olive mb-2 md:mb-0">
        <span className="font-mono text-sm md:text-base">(</span>
        <ScrambleText text={number} className="font-mono text-sm md:text-base" />
        <span className="font-mono text-sm md:text-base">)</span>
      </div>
      <h2 id="hire-heading" className="text-2xl md:text-4xl font-sans tracking-tight font-medium text-lab-black">
        Bring quietloudlab to your team
      </h2>
    </div>
    <LabGrid>
      <div className="col-span-1 md:col-span-7">
        <RevealText>
          <p className="font-serif text-xl md:text-2xl text-gray-700 leading-relaxed max-w-2xl">
            If you're starting an AI initiative or shipping an AI-enabled product, we run talks, workshops, and private in-company sessions that might fit. Thirty minutes on a call is usually enough to tell.
          </p>
        </RevealText>
        <RevealText delay={0.15}>
          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <a
                href="https://cal.com/quietloudlab/speaking-event-collaborations"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('Speaking: Hub Calendly')}
                className="inline-flex items-center gap-2 bg-lab-black text-white px-8 py-4 font-mono text-sm uppercase tracking-widest hover:bg-lab-olive transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lab-olive"
              >
                Book a 30-min call <ArrowRight size={14} aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="mailto:brandon@quietloudlab.com?subject=Speaking%20%2F%20Workshop%20Inquiry"
                onClick={() => trackEvent('Speaking: Hub Email')}
                className="inline-flex items-center gap-2 border border-lab-black/20 text-lab-black px-8 py-4 font-mono text-sm uppercase tracking-widest hover:border-lab-olive hover:text-lab-olive transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lab-olive"
              >
                Send an email
              </a>
            </Magnetic>
          </div>
        </RevealText>
      </div>

      <div className="col-span-1 md:col-span-5 hidden md:block">
        <RevealText delay={0.2}>
          <div className="md:sticky md:top-32 font-mono text-sm text-gray-600 space-y-8 pl-8 border-l border-lab-black/10">
            <div>
              <p className="uppercase tracking-widest mb-2 text-lab-olive">Formats</p>
              <p className="leading-relaxed">Keynote · 45–60 min<br />Workshop · 3 hrs — full day<br />Private in-company · Half / full day</p>
            </div>
            <div>
              <p className="uppercase tracking-widest mb-2 text-lab-olive">Based</p>
              <p>Dallas, TX · Amsterdam (late 2026)</p>
            </div>
            <div>
              <p className="uppercase tracking-widest mb-2 text-lab-olive">Email</p>
              <a
                href="mailto:brandon@quietloudlab.com"
                onClick={() => trackEvent('Speaking: Hub Direct Email')}
                className="hover:text-lab-olive transition-colors"
              >
                brandon@quietloudlab.com
              </a>
            </div>
          </div>
        </RevealText>
      </div>
    </LabGrid>
  </section>
);

const SpeakingPage = () => {
  useEffect(() => {
    document.title = 'Speaking · quietloudlab';
  }, []);
  const showPast = PAST_EVENTS.length > 0;
  const hireNumber = showPast ? '03' : '02';
  return (
    <PageShell>
      <SpeakingHubHero />
      <SpeakingUpcoming />
      {showPast ? <SpeakingPast /> : null}
      <SpeakingHireCTA number={hireNumber} />
    </PageShell>
  );
};

// --- Speaking detail: shared hero ---

const DetailHero = ({
  eyebrow,
  title,
  lead,
  meta,
  cta,
  decoration,
  notice,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  meta: Array<{ key: string; value: React.ReactNode }>;
  cta?: React.ReactNode;
  decoration?: React.ReactNode;
  notice?: React.ReactNode;
}) => (
  <div className="bg-[#F7F7F9] relative isolate">
    <section className="pt-24 md:pt-32 pb-16 md:pb-20 px-6 md:px-12 max-w-screen-xl mx-auto relative" aria-label="Event overview">
      {decoration}
      <RevealText>
        <div className="mb-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <SpeakingBackLink />
          {notice ? <div className="md:max-w-md">{notice}</div> : null}
        </div>
      </RevealText>
      <LabGrid>
        <div className="col-span-1 md:col-span-8">
          <RevealText>
            <p className="font-mono text-xs uppercase tracking-widest text-lab-olive mb-6">
              {eyebrow}
            </p>
          </RevealText>
          <RevealText delay={0.08}>
            <h1 className="text-4xl md:text-6xl lg:text-[4.25rem] font-sans tracking-tight leading-[1.05] font-medium text-lab-black mb-8">
              {title}
            </h1>
          </RevealText>
          <RevealText delay={0.14}>
            <p className="font-sans text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl">
              {lead}
            </p>
          </RevealText>
          {cta ? (
            <RevealText delay={0.2}>
              <div className="mt-8">{cta}</div>
            </RevealText>
          ) : null}
        </div>
        <div className="col-span-1 md:col-span-4">
          <RevealText delay={0.2}>
            <dl className="bg-lab-white rounded-2xl border border-lab-black/10 p-5 md:p-6 md:mt-8">
              {meta.map((row, i) => (
                <div key={row.key} className={`flex justify-between items-baseline py-2.5 gap-6 ${i < meta.length - 1 ? 'border-b border-lab-black/10' : ''}`}>
                  <dt className="font-mono text-xs uppercase tracking-widest text-gray-600">
                    {row.key}
                  </dt>
                  <dd className="font-mono text-sm text-lab-black text-right">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </RevealText>
        </div>
      </LabGrid>
    </section>
  </div>
);

// --- Speaking detail: UXLX 2026 ---

// --- Speaking detail: Idea Lab Mastermind (Greater East Dallas Chamber) ---

const IDEA_LAB_REGISTER_URL = 'https://business.eastdallaschamber.com/gedcc-calendar/Details/idea-lab-mastermind-1712133?sourceTypeId=Hub';

type IdeaLabTopic = {
  tag: string;
  title: string;
  body: string;
};

const IDEA_LAB_TOPICS: IdeaLabTopic[] = [
  {
    tag: 'Part one',
    title: 'Why organizations actually use AI',
    body: 'Not "AI for everything" and not "AI is overhyped." We work through the handful of reasons organizations adopt AI — and the traps they tend to fall into along the way.',
  },
  {
    tag: 'Part two',
    title: 'The five kinds of problems AI solves',
    body: "A practical framework for recognizing which problems in your operations are AI-shaped, and which aren't. If you can name the problem, you can usually see the solution.",
  },
  {
    tag: 'Part three',
    title: 'Claude Cowork, set up live',
    body: "We take one problem from the room and configure Claude Cowork to work on it in real time. Bring a laptop if you want to follow along — optional, not required.",
  },
];

const IdeaLabMastermindPage = () => {
  useEffect(() => { document.title = 'Idea Lab Mastermind · Speaking · quietloudlab'; }, []);

  return (
    <PageShell>
      <DetailHero
        eyebrow="Lunch Talk · Greater East Dallas Chamber"
        title="Idea Lab Mastermind"
        lead="A 60-minute lunch session for East Dallas chamber members on practical AI for small business — what it actually solves, where it fits in your operations, and how to set up Claude Cowork on a real problem from the room."
        meta={[
          { key: 'Date', value: 'Tue, May 5, 2026' },
          { key: 'Time', value: '11:30 AM – 1:00 PM' },
          { key: 'Venue', value: "McRae's American Bistro" },
          { key: 'Access', value: 'Members · Free' },
        ]}
      />

      <section className="py-16 md:py-24 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="idea-lab-cover-heading">
        <DetailSectionHeader id="idea-lab-cover-heading" number="01" title="What we'll cover" kicker="Three parts in sixty minutes" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {IDEA_LAB_TOPICS.map((topic, i) => (
            <RevealText key={topic.title} delay={i * 0.08}>
              <div className="bg-lab-concrete rounded-2xl p-6 md:p-7 h-full flex flex-col">
                <OliveTag>{topic.tag}</OliveTag>
                <h3 className="mt-4 font-sans text-xl md:text-2xl font-medium tracking-tight leading-tight text-lab-black mb-3">{topic.title}</h3>
                <p className="font-serif text-base text-gray-600 leading-relaxed">{topic.body}</p>
              </div>
            </RevealText>
          ))}
        </div>

        <RevealText delay={0.2}>
          <div className="mt-8 bg-lab-olive/10 rounded-xl p-5 md:p-6 flex flex-col md:flex-row gap-3 md:gap-6 items-start md:items-baseline">
            <p className="font-mono text-xs uppercase tracking-widest text-lab-olive shrink-0">
              Bring if you want
            </p>
            <p className="font-sans text-sm md:text-base text-gray-700 leading-relaxed">
              A laptop, a problem from your own work, and an open mind. Lunch is available for purchase from the venue directly.
            </p>
          </div>
        </RevealText>
      </section>

      <section className="pb-20 md:pb-32 px-6 md:px-12 max-w-screen-xl mx-auto">
        <RevealText>
          <div className="bg-lab-concrete rounded-2xl p-6 md:p-10">
            <LabGrid>
              <div className="col-span-1 md:col-span-7">
                <p className="font-mono text-xs uppercase tracking-widest text-lab-olive mb-4">Members only · Space limited</p>
                <h3 className="font-sans text-2xl md:text-3xl font-medium tracking-tight text-lab-black mb-4">
                  Register through the chamber.
                </h3>
                <p className="font-serif text-base md:text-lg text-gray-600 leading-relaxed max-w-xl">
                  Registration happens through the Greater East Dallas Chamber of Commerce portal. You'll need to sign in with your active membership email. If you're not a chamber member but the topic sounds useful, reach out directly and we can talk about whether a private version makes sense.
                </p>
              </div>
              <div className="col-span-1 md:col-span-5 flex flex-col md:items-end justify-end gap-3 mt-6 md:mt-0">
                <a
                  href={IDEA_LAB_REGISTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('Speaking Detail: Idea Lab Register')}
                  className="inline-flex items-center gap-2 bg-lab-black text-white px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-lab-olive transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lab-olive"
                >
                  Register via chamber <ArrowRight size={14} aria-hidden="true" />
                </a>
                <a
                  href="mailto:brandon@quietloudlab.com?subject=Idea%20Lab%20Mastermind%20%E2%80%94%20May%205"
                  onClick={() => trackEvent('Speaking Detail: Idea Lab Email')}
                  className="inline-flex items-center gap-2 border border-lab-black/20 text-lab-black px-6 py-3 font-mono text-xs uppercase tracking-widest hover:border-lab-olive hover:text-lab-olive transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lab-olive"
                >
                  Say hello
                </a>
              </div>
            </LabGrid>
          </div>
        </RevealText>
      </section>
    </PageShell>
  );
};

const UXLX_PROGRAM_URL = 'https://ux-lx.com/speakers/brandon-harwood.html';

const UXLXDetailPage = () => {
  useEffect(() => { document.title = 'UXLX 2026 · Speaking · quietloudlab'; }, []);

  const sessions: Array<{
    type: string;
    title: string;
    description: string;
    duration: string;
    href: string;
    event: string;
  }> = [
    {
      type: 'Talk',
      title: 'The Wobbly Chair at the Table',
      description:
        "How design's pursuit of institutional legitimacy may have enabled its own commodification — and what designers can do about it now. A love letter to the field, not a polemic.",
      duration: '45–60 min · Main stage',
      href: `${UXLX_PROGRAM_URL}#talk`,
      event: 'Speaking Detail: UXLX Talk',
    },
    {
      type: 'Workshop',
      title: 'Designing AI within Creative Fields',
      description:
        'A three-hour session on setting meaningful boundaries for AI in creative work — so it supports the human decisions instead of replacing them.',
      duration: '3 hours · Workshop program',
      href: `${UXLX_PROGRAM_URL}#workshop`,
      event: 'Speaking Detail: UXLX Workshop',
    },
  ];

  return (
    <PageShell>
      <DetailHero
        eyebrow="Conference · Speaker + Workshop Facilitator"
        title="UXLX 2026"
        lead="Brandon is on the UXLX program twice — once as a speaker, once as a workshop facilitator. A week with the European design community in Lisbon."
        meta={[
          { key: 'Dates', value: 'May 12–15, 2026' },
          { key: 'Location', value: 'Lisbon, Portugal' },
          { key: 'Role', value: 'Speaker + Facilitator' },
          { key: 'Sessions', value: 'Talk · Workshop' },
        ]}
      />

      <section className="py-16 md:py-24 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="uxlx-sessions-heading">
        <DetailSectionHeader id="uxlx-sessions-heading" number="01" title="On the program" kicker="Two sessions at UXLX" />
        <div className="space-y-6">
          {sessions.map((session, i) => (
            <RevealText key={session.title} delay={i * 0.08}>
              <article className="border-t border-lab-black/15 pt-8 md:pt-10 pb-8">
                <LabGrid>
                  <div className="col-span-1 md:col-span-3">
                    <OliveTag>{session.type}</OliveTag>
                    <p className="mt-4 font-mono text-xs uppercase tracking-widest text-gray-600 leading-relaxed">
                      {session.duration}
                    </p>
                  </div>
                  <div className="col-span-1 md:col-span-9">
                    <h3 className="font-sans text-2xl md:text-3xl font-medium tracking-tight leading-tight text-lab-black mb-4">
                      {session.title}
                    </h3>
                    <p className="font-serif text-lg text-gray-600 leading-relaxed max-w-2xl">
                      {session.description}
                    </p>
                    <a
                      href={session.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent(session.event)}
                      className="mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-lab-black hover:text-lab-olive transition-colors focus:outline-none focus:text-lab-olive"
                    >
                      See on UXLX program <ArrowRight size={12} aria-hidden="true" />
                    </a>
                  </div>
                </LabGrid>
              </article>
            </RevealText>
          ))}
        </div>
      </section>

      <section className="pb-20 md:pb-32 px-6 md:px-12 max-w-screen-xl mx-auto">
        <RevealText>
          <div className="bg-lab-concrete rounded-2xl p-6 md:p-10">
            <LabGrid>
              <div className="col-span-1 md:col-span-7">
                <p className="font-mono text-xs uppercase tracking-widest text-lab-olive mb-4">If you'll be in Lisbon</p>
                <h3 className="font-sans text-2xl md:text-3xl font-medium tracking-tight text-lab-black mb-4">
                  Say hello at UXLX.
                </h3>
                <p className="font-serif text-base md:text-lg text-gray-600 leading-relaxed max-w-xl">
                  If you're attending the conference, reach out and let's grab coffee between sessions.
                </p>
              </div>
              <div className="col-span-1 md:col-span-5 flex flex-col md:items-end justify-end gap-3 mt-6 md:mt-0">
                <a
                  href={UXLX_PROGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('Speaking Detail: UXLX Program')}
                  className="inline-flex items-center gap-2 bg-lab-black text-white px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-lab-olive transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lab-olive"
                >
                  UXLX Program <ArrowRight size={14} aria-hidden="true" />
                </a>
                <a
                  href="mailto:brandon@quietloudlab.com?subject=Say%20hello%20at%20UXLX"
                  onClick={() => trackEvent('Speaking Detail: UXLX Email')}
                  className="inline-flex items-center gap-2 border border-lab-black/20 text-lab-black px-6 py-3 font-mono text-xs uppercase tracking-widest hover:border-lab-olive hover:text-lab-olive transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lab-olive"
                >
                  Say hello
                </a>
              </div>
            </LabGrid>
          </div>
        </RevealText>
      </section>
    </PageShell>
  );
};

// --- Speaking detail: AI as a Design Material ---

type WorkshopAudience = {
  icon: LucideIcon;
  title: string;
  description: string;
  note?: string;
};

const WORKSHOP_AUDIENCES: WorkshopAudience[] = [
  {
    icon: Compass,
    title: 'Designers',
    description: 'This workshop was built with you in mind.',
  },
  {
    icon: Users,
    title: 'Product managers',
    description: "Trying to figure out what to build.",
  },
  {
    icon: Building2,
    title: 'Founders',
    description: 'Wondering where AI fits in your business.',
  },
  {
    icon: Code2,
    title: 'Developers',
    description: "Evaluating what's feasible.",
  },
];

const WORKSHOP_OUTCOMES = [
  'Treat AI as a design material, with specific functions and values, rather than a magic fix to slap on top of an existing experience.',
  "Identify gaps in your users' context worth designing AI solutions for vs. gaps that don't need AI at all.",
  'Determine what AI enablements provide real value for your users and business.',
  'Evaluate which specific AI capabilities create the foundation for a given user experience.',
  'Build a shared language your team can use to clearly communicate around AI design and development.',
];

type WorkshopSession = {
  city: string;
  venue: string;
  date: string;
  status: { label: string; tone: StatusTone };
  rsvpHref: string;
  event: string;
  photo: { src: string; alt: string };
};

const WORKSHOP_SESSIONS: WorkshopSession[] = [
  {
    city: 'The Hague',
    venue: 'Worth Works',
    date: 'Friday, May 29, 2026 · Afternoon',
    status: { label: 'Tickets on sale', tone: 'confirmed' },
    rsvpHref: 'https://www.eventbrite.com/e/workshop-ai-as-a-design-material-the-hague-tickets-1988565280284?aff=oddtdtcreator',
    event: 'Speaking Detail: Hague Tickets',
    photo: { src: '/images/workshop_photos/hague.jpg', alt: 'A scene from The Hague — quiet streets near the workshop venue' },
  },
  {
    city: 'Amsterdam',
    venue: 'Venue TBD',
    date: 'Saturday, May 30, 2026 · Afternoon',
    status: { label: 'Tickets on sale', tone: 'confirmed' },
    rsvpHref: 'https://www.eventbrite.com/e/workshop-ai-as-a-design-material-amsterdam-tickets-1988569576133?aff=oddtdtcreator',
    event: 'Speaking Detail: Amsterdam Tickets',
    photo: { src: '/images/workshop_photos/amsterdam.jpg', alt: 'A scene from Amsterdam — canals and the working neighborhoods' },
  },
];

const WORKSHOP_PRICING = [
  { tier: 'Workshop Registration', sub: 'Select this price if your company is reimbursing you, or directly purchasing your ticket.', amount: '€175' },
  { tier: 'Out-of-pocket / Individual', sub: 'Select this price if you will NOT be reimbursed by your employer or other organization.', amount: '€89' },
  { tier: 'Need a break', sub: "For those whose personal circumstances (student/low income) make participating cost-prohibitive, we offer a very limited number of subsidized tickets.", amount: '€35' },
];

const WORKSHOP_FAQ = [
  {
    q: 'Do I qualify for a €35 ticket?',
    a: "The €35 ticket exists for people who otherwise couldn't afford to attend e.g. students or those currently without work. This is run on the honor system, but there are a very limited amount of tickets at these prices, so please, if you can afford the €89 ticket, purchase that one.",
  },
  {
    q: "How is this different from other AI workshops I've seen?",
    a: "Most AI workshops teach you how to use AI tools more efficiently. This one teaches you how to think about where AI belongs in the first place. You won't leave with a list of prompts. You'll leave with a framework for evaluating AI decisions your team can keep using after the session ends.",
  },
  {
    q: 'What should I bring or prepare?',
    a: "No major prep needed! If you'd like to ground this work in reality, come with a product, project, or design challenge in mind. All materials and canvases are provided on the day of, and an example scenario will be provided for those who want to come in fresh.",
  },
  {
    q: 'Is this workshop in English?',
    a: 'Yes, the session is conducted entirely in English.',
  },
  {
    q: 'Can my whole team attend?',
    a: "Yes, and honestly it works better that way. If you'd like to bring a larger group or want a session built entirely around your organization's context, reach out about a private in-company format or group ticket prices.",
  },
  {
    q: 'My company needs to pay via invoice rather than upfront. Is that possible?',
    a: "Yes. Reach out before the event at brandon@quietloudlab.com and we'll sort it out. This is common, and not a problem.",
  },
  {
    q: 'Do I need to know how to code or have a technical AI background?',
    a: 'No. This workshop is about design thinking and decision-making around AI, not building or implementing it. You bring the product and human context; we bring the framework for working with it.',
  },
];

const WorkshopFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="border-t border-lab-black/15">
      {WORKSHOP_FAQ.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q} className="border-b border-lab-black/15">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex justify-between items-center gap-6 py-5 text-left font-sans text-base md:text-lg text-lab-black hover:text-lab-olive transition-colors focus:outline-none focus:text-lab-olive"
              aria-expanded={isOpen}
            >
              <span className="pr-6">{item.q}</span>
              <Plus size={18} className={`text-gray-600 transition-transform shrink-0 ${isOpen ? 'rotate-45' : ''}`} aria-hidden="true" />
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <p className="font-serif text-base md:text-lg text-gray-600 leading-relaxed pb-6 pr-12 max-w-2xl">{item.a}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

const HAGUE_TICKETS_URL = 'https://www.eventbrite.com/e/workshop-ai-as-a-design-material-the-hague-tickets-1988565280284?aff=oddtdtcreator';
const AMSTERDAM_TICKETS_URL = 'https://www.eventbrite.com/e/workshop-ai-as-a-design-material-amsterdam-tickets-1988569576133?aff=oddtdtcreator';

const HeaderTicketCTA = () => (
  <div>
    <p className="font-mono text-xs uppercase tracking-widest text-gray-600 mb-3">Get tickets</p>
    <div className="flex flex-col sm:flex-row gap-3">
      <a
        href={HAGUE_TICKETS_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('Speaking Header: Hague Tickets')}
        className="inline-flex items-center justify-center gap-2 bg-lab-black text-white px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-lab-olive transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lab-olive"
      >
        The Hague · May 29 <ArrowRight size={12} aria-hidden="true" />
      </a>
      <a
        href={AMSTERDAM_TICKETS_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('Speaking Header: Amsterdam Tickets')}
        className="inline-flex items-center justify-center gap-2 bg-lab-black text-white px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-lab-olive transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lab-olive"
      >
        Amsterdam · May 30 <ArrowRight size={12} aria-hidden="true" />
      </a>
    </div>
    <p className="mt-8 font-mono text-xs uppercase tracking-widest text-gray-600">
      €35 / €89 / €175 ·{' '}
      <a
        href="#sessions-heading"
        onClick={() => trackEvent('Speaking Header: See Pricing')}
        className="text-lab-olive underline decoration-lab-olive/40 hover:decoration-lab-olive transition"
      >
        See pricing details
      </a>
    </p>
  </div>
);

const StickyTicketBar = () => {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const mobileSlide = reduceMotion ? 0 : 60;
  const desktopSlide = reduceMotion ? 0 : -20;

  return (
    <>
      {/* Mobile: full-width bottom bar (sits above the mobile nav) */}
      <AnimatePresence>
        {visible ? (
          <motion.aside
            aria-label="Reserve a workshop seat"
            initial={{ y: mobileSlide, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: mobileSlide, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden fixed bottom-[80px] left-0 right-0 z-30 px-4 flex justify-center pointer-events-none"
          >
            <div className="pointer-events-auto bg-lab-black text-white border border-lab-olive/30 rounded-full shadow-2xl flex items-center gap-2 px-3 py-2 max-w-full">
              <span className="flex items-center gap-2 pl-2 pr-1 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-lab-olive animate-pulse" aria-hidden="true" />
                <p className="font-mono text-xs uppercase tracking-widest text-white">Tickets</p>
              </span>
              <a
                href={HAGUE_TICKETS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('Speaking Sticky: Hague Tickets')}
                className="inline-flex items-center justify-center gap-1.5 bg-white text-lab-black rounded-full px-3 py-2 font-mono text-xs uppercase tracking-widest hover:bg-lab-olive hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-lab-olive focus:ring-offset-2 focus:ring-offset-lab-black whitespace-nowrap"
              >
                The Hague
              </a>
              <a
                href={AMSTERDAM_TICKETS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('Speaking Sticky: Amsterdam Tickets')}
                className="inline-flex items-center justify-center gap-1.5 bg-white text-lab-black rounded-full px-3 py-2 font-mono text-xs uppercase tracking-widest hover:bg-lab-olive hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-lab-olive focus:ring-offset-2 focus:ring-offset-lab-black whitespace-nowrap"
              >
                Amsterdam
              </a>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      {/* Desktop: centered top pill */}
      <AnimatePresence>
        {visible ? (
          <motion.aside
            aria-label="Reserve a workshop seat"
            initial={{ y: desktopSlide, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: desktopSlide, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="hidden md:flex fixed top-[72px] left-0 right-0 z-30 px-6 md:px-12 justify-end pointer-events-none"
          >
            <div className="pointer-events-auto bg-lab-black text-white border border-lab-olive/30 rounded-full shadow-2xl flex items-center gap-2 px-3 py-2 max-w-full">
              <span className="flex items-center gap-2 pl-2 pr-1 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-lab-olive animate-pulse" aria-hidden="true" />
                <p className="font-mono text-xs uppercase tracking-widest text-white">Tickets</p>
              </span>
              <a
                href={HAGUE_TICKETS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('Speaking Sticky: Hague Tickets')}
                className="inline-flex items-center justify-center gap-1.5 bg-white text-lab-black rounded-full px-4 py-2 font-mono text-xs uppercase tracking-widest hover:bg-lab-olive hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-lab-olive focus:ring-offset-2 focus:ring-offset-lab-black whitespace-nowrap"
              >
                The Hague · May 29
              </a>
              <a
                href={AMSTERDAM_TICKETS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('Speaking Sticky: Amsterdam Tickets')}
                className="inline-flex items-center justify-center gap-1.5 bg-white text-lab-black rounded-full px-4 py-2 font-mono text-xs uppercase tracking-widest hover:bg-lab-olive hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-lab-olive focus:ring-offset-2 focus:ring-offset-lab-black whitespace-nowrap"
              >
                Amsterdam · May 30
              </a>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
};

const FloatingPhoto = ({
  src,
  alt,
  shape,
  desktopClass,
  mobileClass = 'mt-10 max-w-[220px] mx-auto',
  hideOnMobile = false,
}: {
  src: string;
  alt: string;
  shape: ShapeName;
  desktopClass: string;
  mobileClass?: string;
  hideOnMobile?: boolean;
}) => (
  <>
    <div className={`hidden md:block absolute -z-10 pointer-events-none ${desktopClass}`}>
      <ImagePlaceholder media={src} description={alt} shape={shape} />
    </div>
    {hideOnMobile ? null : (
      <div className={`block md:hidden ${mobileClass}`}>
        <ImagePlaceholder media={src} description={alt} shape={shape} />
      </div>
    )}
  </>
);

const AIAsDesignMaterialPage = () => {
  useEffect(() => {
    document.title = 'AI as a Design Material · Speaking · quietloudlab';
  }, []);

  return (
    <PageShell>
      <StickyTicketBar />
      <DetailHero
        eyebrow="Workshop Series · Europe · May 2026"
        title="AI as a Design Material"
        lead="A hands-on workshop for designers and product teams who want to build AI that works for real people and real businesses."
        meta={[
          { key: 'Duration', value: '3 hours' },
          { key: 'Format', value: 'In-person' },
          { key: 'Sessions', value: 'The Hague · Amsterdam' },
        ]}
        cta={<HeaderTicketCTA />}
        notice={
          <div className="md:text-right">
            <p className="font-mono text-xs uppercase tracking-widest text-gray-600 mb-1">
              Open Windows in Europe
            </p>
            <div className="flex flex-wrap md:justify-end gap-x-4 gap-y-1">
              <PageLink
                to="/speaking/barcelona-2026"
                onClick={() => trackEvent('Speaking Header: Barcelona Notice')}
                className="font-sans text-sm text-gray-700 hover:text-lab-olive transition-colors inline-flex items-center gap-1.5"
              >
                Barcelona · May 17–22 <ArrowRight size={12} aria-hidden="true" />
              </PageLink>
              <PageLink
                to="/speaking/berlin-2026"
                onClick={() => trackEvent('Speaking Header: Berlin Notice')}
                className="font-sans text-sm text-gray-700 hover:text-lab-olive transition-colors inline-flex items-center gap-1.5"
              >
                Berlin · May 22–27 <ArrowRight size={12} aria-hidden="true" />
              </PageLink>
            </div>
          </div>
        }
        decoration={
          <FloatingPhoto
            src="/images/workshop_photos/workshop1.jpg"
            alt="Workshop participants gathered around a table during a previous AI as a Design Material session"
            shape="soft"
            desktopClass="top-[320px] right-[-160px] w-[440px] aspect-square"
            hideOnMobile
          />
        }
      />

      <section className="pt-24 md:pt-36 pb-24 md:pb-32 px-6 md:px-12 max-w-screen-xl mx-auto" aria-label="Workshop introduction">
        <RevealText>
          <p className="font-serif text-xl md:text-2xl text-lab-black leading-relaxed max-w-2xl">
            Designed to help you think differently about how we make AI systems work well for actual humans, and build the foundational skills for identifying and communicating why &amp; how we might use AI within a larger solution.
          </p>
        </RevealText>
      </section>

      <section className="relative isolate pb-16 md:pb-24 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="audience-heading">
        <DetailSectionHeader id="audience-heading" title="Who this is for" />
        <LabGrid>
          <div className="col-span-1 md:col-span-6">
            <RevealText>
              <p className="font-serif text-lg text-gray-600 leading-relaxed max-w-xl">
                This workshop was built with designers in mind, and the lessons span across product teams. If you're a product manager trying to figure out what to build, a developer evaluating what's feasible, or a founder wondering where AI fits in your business, you'll leave with clarity you didn't walk in with.
              </p>
            </RevealText>
            <RevealText delay={0.1}>
              <div className="mt-20 md:mt-24 max-w-[420px]">
                <ImagePlaceholder
                  media="/images/workshop_photos/ai_actions.png"
                  description="Diagram of AI interaction patterns from the AI Interaction Atlas"
                  shape="soft"
                />
              </div>
            </RevealText>
          </div>
          <div className="col-span-1 md:col-span-5 md:col-start-8">
            <div className="grid grid-cols-1 gap-4">
              {WORKSHOP_AUDIENCES.map((audience, i) => {
                const Icon = audience.icon;
                return (
                  <RevealText key={audience.title} delay={i * 0.06}>
                    <div className="bg-lab-concrete rounded-2xl p-6 h-full">
                      <Icon size={20} className="text-lab-olive mb-4" aria-hidden="true" strokeWidth={1.5} />
                      <h3 className="font-sans text-lg font-medium text-lab-black mb-2 leading-snug">{audience.title}</h3>
                      <p className="font-serif text-sm text-gray-600 leading-relaxed">{audience.description}</p>
                      {audience.note ? <p className="mt-3 pt-3 border-t border-lab-black/10 font-mono text-xs uppercase tracking-widest text-gray-600 italic">{audience.note}</p> : null}
                    </div>
                  </RevealText>
                );
              })}
            </div>
          </div>
        </LabGrid>
      </section>

      <section className="relative isolate pt-8 md:pt-12 pb-20 md:pb-32 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="cover-heading">
        <DetailSectionHeader id="cover-heading" title="What we cover" />

        <RevealText>
          <p className="mt-12 md:mt-16 font-serif text-xl md:text-2xl text-lab-black leading-relaxed max-w-3xl">
            You'll leave with a conceptual foundation and a working toolkit for designing innovative and useful AI solutions (beyond building chatbots). You'll pull from modular tools and activities based on the actual needs of your team and users. The workshop is not a fixed script, but adapts to your use case.
          </p>
        </RevealText>

        <LabGrid className="mt-16 md:mt-24 items-start">
          <div className="col-span-1 md:col-span-6 space-y-6 md:space-y-7">
            <RevealText>
              <p className="font-mono text-xs uppercase tracking-widest text-lab-olive mb-2">
                The premise
              </p>
            </RevealText>
            <RevealText delay={0.06}>
              <p className="font-serif text-base md:text-lg text-gray-600 leading-relaxed max-w-xl">
                AI is a powerful technology that seems to be the answer to every problem, but in reality only provides value when designed right. Wanting AI and knowing where it belongs are two very different things.
              </p>
            </RevealText>
            <RevealText delay={0.12}>
              <p className="font-serif text-base md:text-lg text-gray-600 leading-relaxed max-w-xl">
                Too often, teams are compelled to implement AI (often by their stakeholders) without ever asking the important questions: does the problem truly call for AI? What's the ROI? Where specifically is AI needed? How might we best take advantage of the capabilities AI can perform? What happens to the people we design AI solutions for?
              </p>
            </RevealText>
          </div>
          <div className="col-span-1 md:col-span-5 md:col-start-8 mt-10 md:mt-0">
            <RevealText delay={0.14}>
              <div className="bg-lab-concrete rounded-2xl p-6 md:p-8">
                <p className="font-mono text-xs uppercase tracking-widest text-lab-olive mb-6">
                  In this three-hour workshop you'll learn how to
                </p>
                <ul className="space-y-5 md:space-y-6">
                  {WORKSHOP_OUTCOMES.map((outcome) => (
                    <li key={outcome} className="flex gap-3.5 font-sans text-base text-lab-black leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-lab-olive shrink-0" aria-hidden="true" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealText>
          </div>
        </LabGrid>

        <RevealText delay={0.2}>
          <figure className="mt-20 md:mt-28 max-w-2xl ml-auto">
            <blockquote className="font-serif italic text-xl md:text-2xl text-lab-black leading-relaxed">
              You can design AI systems that genuinely improve people's work and lives, but it requires a new framing that understands the materiality of AI within the contexts we build.
            </blockquote>
          </figure>
        </RevealText>

        <RevealText delay={0.26}>
          <div className="mt-16 md:mt-20 bg-lab-concrete rounded-xl p-5 md:p-6 flex flex-col md:flex-row gap-3 md:gap-6 items-start md:items-baseline">
            <p className="font-mono text-xs uppercase tracking-widest text-gray-600 shrink-0">Built on</p>
            <p className="font-sans text-base text-lab-black leading-relaxed">
              The workshop runs on the{' '}
              <a href="https://ai-interaction.com" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('Speaking Detail: Atlas Link')} className="underline decoration-lab-olive/60 hover:decoration-lab-olive transition">
                AI Interaction Atlas
              </a>
              , an open-source framework for mapping AI capabilities across human interactions.
            </p>
          </div>
        </RevealText>

        <FloatingPhoto
          src="/images/workshop_photos/workshop2.jpeg"
          alt="A small group working through workshop activities together"
          shape="pebble"
          desktopClass="left-[-30px] bottom-[120px] w-[460px] aspect-square"
        />
      </section>

      <section className="relative isolate py-16 md:py-24 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="sessions-heading">
        <DetailSectionHeader id="sessions-heading" title="Sessions" />
        <LabGrid>
          <div className="col-span-1 md:col-span-6">
            <div className="border-t border-lab-black/15">
              {WORKSHOP_SESSIONS.map((session, i) => (
                <RevealText key={session.city} delay={i * 0.08}>
                  <a
                    id={session.city === 'The Hague' ? 'hague' : 'amsterdam'}
                    href={session.rsvpHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent(session.event)}
                    className="group block border-b border-lab-black/15 py-6 md:py-7 scroll-mt-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-olive focus-visible:ring-offset-4"
                    aria-label={`${session.city} — get tickets on Eventbrite`}
                  >
                    <div className="flex gap-4 md:gap-6 items-start">
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs uppercase tracking-widest text-lab-olive mb-3">
                          Session {i + 1}
                        </p>
                        <h3 className="font-sans text-2xl md:text-3xl font-medium leading-tight text-lab-black mb-3 group-hover:text-lab-olive transition-colors">
                          {session.city}
                        </h3>
                        <p className="font-mono text-sm text-gray-600 leading-relaxed">{session.venue}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-lab-olive" aria-hidden="true" />
                          <p className="font-mono text-sm text-gray-600 leading-relaxed">{session.date}</p>
                        </div>
                        <div className="mt-5">
                          <span className="inline-flex items-center gap-2 bg-lab-black text-white px-6 py-3 font-mono text-xs uppercase tracking-widest group-hover:bg-lab-olive transition-colors">
                            Get tickets on Eventbrite <ArrowRight size={12} aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                      <div className="w-24 md:w-44 shrink-0">
                        <ImagePlaceholder
                          media={session.photo.src}
                          description={session.photo.alt}
                          shape="soft"
                        />
                      </div>
                    </div>
                  </a>
                </RevealText>
              ))}
            </div>
          </div>
          <div className="col-span-1 md:col-span-5 md:col-start-8">
            <RevealText delay={0.15}>
              <div className="rounded-xl overflow-hidden border border-lab-black/10">
                <div className="px-5 py-3 border-b border-lab-black/10">
                  <p className="font-mono text-xs uppercase tracking-widest text-lab-olive">Ticket pricing — per session</p>
                </div>
                {WORKSHOP_PRICING.map((row, i) => (
                  <div key={row.tier} className={`px-5 py-4 flex justify-between items-center gap-4 bg-lab-white ${i < WORKSHOP_PRICING.length - 1 ? 'border-b border-lab-black/10' : ''}`}>
                    <div>
                      <p className="font-sans text-sm text-lab-black">{row.tier}</p>
                      <p className="mt-0.5 font-mono text-sm text-gray-600 leading-relaxed">{row.sub}</p>
                    </div>
                    <p className="font-sans text-xl text-lab-black font-medium shrink-0">{row.amount}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 font-serif italic text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                Please don't take a €35 ticket if you can afford the Out-of-pocket ticket, and please don't take one and not show up. You're keeping someone else from getting it.
              </p>
            </RevealText>
          </div>
        </LabGrid>
      </section>

      <section className="relative isolate pt-16 md:pt-24 pb-16 md:pb-24 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="facilitators-heading">
        <DetailSectionHeader id="facilitators-heading" title="Facilitators" />
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 md:pt-24">
          <RevealText>
            <div className="relative h-full">
              <div className="hidden md:block absolute top-0 right-4 -translate-y-1/2 w-[180px] aspect-square z-10 pointer-events-none">
                <ImagePlaceholder
                  media="/images/workshop_photos/brandon.jpg"
                  description="Portrait of Brandon Harwood, founder of quietloudlab"
                  shape="pebble"
                />
              </div>
              <div className="bg-lab-concrete rounded-2xl p-6 md:p-8 h-full">
                <div className="block md:hidden mb-6 max-w-[180px]">
                  <ImagePlaceholder
                    media="/images/workshop_photos/brandon.jpg"
                    description="Portrait of Brandon Harwood, founder of quietloudlab"
                    shape="pebble"
                  />
                </div>
                <h3 className="font-sans text-2xl font-medium text-lab-black">Brandon Harwood</h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-lab-olive">Founder, quietloudlab</p>
                <p className="mt-1 font-mono text-sm text-gray-600">Dallas · Amsterdam (late 2026)</p>
                <p className="mt-5 font-serif text-base text-gray-600 leading-relaxed">
                  Brandon Harwood is an independent designer and researcher, founder at quietloudlab, and the creator of the AI Interaction Atlas. He has over a decade of experience at IBM Innovation Studio, designing human-centered AI systems for clients across industry sectors and advising IBM Research on human-AI co-creativity, with research published at CHI 2023 informing his approach to designing AI products that empowers human creativity rather than replace it. Through quietloudlab, he works with startups and innovation teams to design emerging technology experiences grounded in cognitive psychology, practical product strategy, and the everyday human experience.
                </p>
                <ul className="mt-6 space-y-2">
                  {['Decade at IBM Innovation Studio', 'CHI 2023 published research', 'Creator, AI Interaction Atlas', 'Speaker, UXLX 2026'].map((c) => (
                    <li key={c} className="pl-3 border-l-2 border-lab-olive font-mono text-xs uppercase tracking-widest text-lab-black leading-relaxed">{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealText>
          <RevealText delay={0.08}>
            <div className="relative h-full">
              <div className="hidden md:block absolute top-0 right-4 -translate-y-1/2 w-[180px] aspect-square z-10 pointer-events-none">
                <ImagePlaceholder
                  media="/images/workshop_photos/matthijs.jpg"
                  description="Portrait of Matthijs Zwinderman, strategic product designer"
                  shape="pebble"
                />
              </div>
              <div className="bg-lab-concrete rounded-2xl p-6 md:p-8 h-full">
                <div className="block md:hidden mb-6 max-w-[180px]">
                  <ImagePlaceholder
                    media="/images/workshop_photos/matthijs.jpg"
                    description="Portrait of Matthijs Zwinderman, strategic product designer"
                    shape="pebble"
                  />
                </div>
                <h3 className="font-sans text-2xl font-medium text-lab-black">Matthijs Zwinderman</h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-lab-olive">Strategic Product Designer</p>
                <p className="mt-1 font-mono text-sm text-gray-600">The Hague · Netherlands dates only</p>
                <p className="mt-5 font-serif text-base text-gray-600 leading-relaxed">
                  Matthijs Zwinderman's background covers AI research (Carnegie Mellon), enterprise service design, and product strategy with Dutch startups, scaleups, and enterprises. He's been building and running design communities in the Netherlands for years, including LeanUX The Hague, using his practical and pragmatic ground-level knowledge to shape every session.
                </p>
                <ul className="mt-6 space-y-2">
                  {['AI Research, Carnegie Mellon University', 'Enterprise service design & product strategy', 'Organizer, LeanUX The Hague'].map((c) => (
                    <li key={c} className="pl-3 border-l-2 border-lab-olive font-mono text-xs uppercase tracking-widest text-lab-black leading-relaxed">{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealText>
        </div>
      </section>

      <section className="relative isolate py-16 md:py-24 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="faq-heading">
        <DetailSectionHeader id="faq-heading" title="FAQ" />
        <LabGrid>
          <div className="col-span-1 md:col-span-4">
            <RevealText>
              <p className="font-serif text-base text-gray-600 leading-relaxed max-w-sm">
                A few common questions about the workshop, format, and logistics. If yours isn't here, ask directly.
              </p>
            </RevealText>
          </div>
          <div className="col-span-1 md:col-span-8">
            <RevealText delay={0.1}>
              <WorkshopFAQ />
            </RevealText>
          </div>
        </LabGrid>

        <FloatingPhoto
          src="/images/workshop_photos/workshop3.jpeg"
          alt="Workshop participants reviewing canvases together"
          shape="soft"
          desktopClass="left-[-40px] bottom-[-40px] w-[320px] aspect-square"
        />
      </section>

      <section className="relative isolate pb-20 md:pb-32 px-6 md:px-12 max-w-screen-xl mx-auto">
        <RevealText>
          <div className="bg-lab-concrete rounded-2xl p-6 md:p-10">
            <LabGrid>
              <div className="col-span-1 md:col-span-7">
                <p className="font-mono text-xs uppercase tracking-widest text-lab-olive mb-4">Bring it in-house</p>
                <h3 className="font-sans text-2xl md:text-3xl font-medium text-lab-black mb-4">
                  Need a private session for your team?
                </h3>
                <p className="font-serif text-base md:text-lg text-gray-600 leading-relaxed max-w-xl">
                  The public workshops are open to anyone. If your team wants a session built entirely around your product, your context, and your specific design decisions — private half-day and full-day formats are available. Get in touch and we'll scope it out.
                </p>
              </div>
              <div className="col-span-1 md:col-span-5 flex flex-col md:items-end justify-end gap-3 mt-6 md:mt-0">
                <a
                  href="https://cal.com/quietloudlab/speaking-event-collaborations"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('Speaking Detail: Workshop Calendly')}
                  className="inline-flex items-center gap-2 bg-lab-black text-white px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-lab-olive transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lab-olive"
                >
                  Book a 30-min call <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>
            </LabGrid>
          </div>
        </RevealText>
      </section>
    </PageShell>
  );
};

// --- Speaking: routes ---

// --- Speaking detail: City Option pages (Barcelona / Berlin) ---

const CityOptionPage = ({ config }: { config: CityOptionConfig }) => {
  useEffect(() => {
    document.title = `${config.city} · Speaking · quietloudlab`;
  }, [config.city]);

  return (
    <PageShell>
      <DetailHero
        eyebrow={`Open Window · ${config.city}, ${config.country}`}
        title={`A few days in ${config.city}.`}
        lead={config.lead}
        meta={[
          { key: 'Dates', value: config.dateRange },
          { key: 'Status', value: 'Seeking partners' },
          { key: 'Formats', value: 'In-person · Remote' },
          { key: 'Looking for', value: 'Companies · Co-hosts' },
        ]}
      />

      <section className="py-16 md:py-24 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="ways-heading">
        <DetailSectionHeader id="ways-heading" number="01" title="Ways we could work together" kicker="A few examples, not a menu" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {config.engagements.map((option, i) => {
            const Icon = option.icon;
            return (
              <RevealText key={option.title} delay={i * 0.08}>
                <div className="bg-lab-concrete rounded-2xl p-6 md:p-8 h-full flex flex-col">
                  <Icon size={22} className="text-lab-olive mb-4" aria-hidden="true" strokeWidth={1.5} />
                  <h3 className="font-sans text-xl md:text-2xl font-medium tracking-tight leading-tight text-lab-black mb-3">{option.title}</h3>
                  <p className="font-mono text-xs uppercase tracking-widest text-lab-olive mb-3 leading-relaxed">
                    {option.fitsWhen}
                  </p>
                  <p className="font-serif text-base text-gray-600 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </RevealText>
            );
          })}
        </div>
      </section>

      <section className="pb-20 md:pb-32 px-6 md:px-12 max-w-screen-xl mx-auto">
        <RevealText>
          <div className="bg-lab-olive/10 rounded-2xl p-6 md:p-10">
            <LabGrid>
              <div className="col-span-1 md:col-span-7">
                <p className="font-mono text-xs uppercase tracking-widest text-lab-olive mb-4">Next step</p>
                <h3 className="font-sans text-2xl md:text-3xl font-medium tracking-tight text-lab-black mb-4">
                  Let's figure out the shape together.
                </h3>
                <p className="font-serif text-base md:text-lg text-gray-600 leading-relaxed max-w-xl">
                  Share a few details about your team, event, or community — or grab a 30-minute call. Either gets us to the same place: a quick conversation about whether any of this fits.
                </p>
              </div>
              <div className="col-span-1 md:col-span-5 flex flex-col md:items-end justify-end gap-3 mt-6 md:mt-0">
                <a
                  href={`mailto:brandon@quietloudlab.com?subject=${encodeURIComponent(`${config.city} (${config.shortDate}) — Expression of interest`)}`}
                  onClick={() => trackEvent(`Speaking ${config.city}: EOI`)}
                  className="inline-flex items-center gap-2 bg-lab-black text-white px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-lab-olive transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lab-olive"
                >
                  Share an expression of interest <ArrowRight size={14} aria-hidden="true" />
                </a>
                <a
                  href="https://cal.com/quietloudlab/speaking-event-collaborations"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent(`Speaking ${config.city}: Calendly`)}
                  className="inline-flex items-center gap-2 border border-lab-black/20 text-lab-black px-6 py-3 font-mono text-xs uppercase tracking-widest hover:border-lab-olive hover:text-lab-olive transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lab-olive"
                >
                  Schedule a 30-min call
                </a>
              </div>
            </LabGrid>
          </div>
        </RevealText>
      </section>
    </PageShell>
  );
};

const BarcelonaOptionPage = () => <CityOptionPage config={CITY_OPTIONS['barcelona-2026']} />;
const BerlinOptionPage = () => <CityOptionPage config={CITY_OPTIONS['berlin-2026']} />;

const SPEAKING_ROUTES: Record<string, () => React.ReactElement> = {
  '/speaking': SpeakingPage,
  '/speaking/idea-lab-mastermind': IdeaLabMastermindPage,
  '/speaking/uxlx-2026': UXLXDetailPage,
  '/speaking/ai-as-design-material': AIAsDesignMaterialPage,
  '/speaking/barcelona-2026': BarcelonaOptionPage,
  '/speaking/berlin-2026': BerlinOptionPage,
};

const SpeakingNotFound = () => {
  useEffect(() => {
    document.title = 'Not found · Speaking · quietloudlab';
  }, []);
  return (
    <PageShell>
      <section className="min-h-[60vh] pt-28 md:pt-40 pb-16 px-6 md:px-12 max-w-screen-xl mx-auto">
        <RevealText>
          <p className="font-mono text-sm uppercase tracking-widest text-lab-olive mb-6">
            Speaking · Not found
          </p>
        </RevealText>
        <RevealText delay={0.1}>
          <h1 className="text-4xl md:text-6xl font-sans font-medium tracking-tight text-lab-black max-w-3xl leading-tight mb-8">
            This event isn't on the list.
          </h1>
        </RevealText>
        <RevealText delay={0.2}>
          <p className="font-serif text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
            The page may have moved or was never here. Start from the Speaking hub, or get in touch directly.
          </p>
        </RevealText>
        <RevealText delay={0.25}>
          <div className="mt-10 flex flex-wrap gap-3">
            <PageLink
              to="/speaking"
              className="inline-flex items-center gap-2 bg-lab-black text-white px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-lab-olive transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lab-olive"
            >
              ← Speaking
            </PageLink>
            <PageLink
              to="/"
              className="inline-flex items-center gap-2 border border-lab-black/20 text-lab-black px-6 py-3 font-mono text-xs uppercase tracking-widest hover:border-lab-olive hover:text-lab-olive transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lab-olive"
            >
              Home
            </PageLink>
          </div>
        </RevealText>
      </section>
    </PageShell>
  );
};

const resolveSpeakingRoute = (path: string): (() => React.ReactElement) | null => {
  const normalized = path.replace(/\/$/, '') || '/';
  return SPEAKING_ROUTES[normalized] ?? null;
};

// --- Pages & Shell ---

const MobileNavBar = () => (
  <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 w-full bg-lab-white border-t border-lab-black/10 p-4 flex justify-between overflow-x-auto gap-6 z-40">
    <PageLink to="/#practice" className="font-mono text-xs uppercase tracking-widest text-gray-600 hover:text-lab-olive transition-colors">Practice</PageLink>
    <PageLink to="/#atlas" className="font-mono text-xs uppercase tracking-widest text-gray-600 hover:text-lab-olive transition-colors">Atlas</PageLink>
    <PageLink to="/speaking" className="font-mono text-xs uppercase tracking-widest text-gray-600 hover:text-lab-olive transition-colors">Speaking</PageLink>
    <PageLink to="/#contact" className="font-mono text-xs uppercase tracking-widest text-gray-600 hover:text-lab-olive transition-colors">Contact</PageLink>
  </nav>
);

const PageShell = ({ children }: { children?: React.ReactNode }) => (
  <div className="w-full bg-lab-white min-h-screen selection:bg-lab-olive selection:text-white relative">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-lab-black focus:text-lab-white focus:p-4 focus:font-mono focus:text-sm">Skip to content</a>
    <Navigation />
    <main id="main-content">{children}</main>
    <Footer />
    <MobileNavBar />
  </div>
);

const HomePage = () => {
  useEffect(() => {
    document.title = 'quietloudlab';
  }, []);
  return (
    <PageShell>
      <Hero />
      <div className="bg-lab-olive/20">
        <StickyPhaseShowcase phases={METHODOLOGY_PHASES} />
      </div>
      <Practice />
      <HouseBuiltTools />
      <Contact contactIntent={null} />
    </PageShell>
  );
};

const App = () => {
  const path = usePath();

  useEffect(() => {
    // Scroll to hash target when hash is present on any route change
    const { hash } = window.location;
    if (hash) {
      const id = hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [path]);

  const SpeakingRoute = resolveSpeakingRoute(path);
  const page = SpeakingRoute
    ? <SpeakingRoute />
    : path.startsWith('/speaking')
      ? <SpeakingNotFound />
      : <HomePage />;

  return (
    <>
      <ShapeDefs />
      {page}
    </>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
