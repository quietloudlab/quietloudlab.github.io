import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useInView, AnimatePresence, useSpring, useTransform, useReducedMotion, useMotionValueEvent, type MotionValue } from 'framer-motion';
import { ArrowRight, ArrowDown, Menu, X, Check, Loader2, Users, Compass, Code2, Building2, Video, Mic, Plus, type LucideIcon } from 'lucide-react';
import LogoSvg from './img/quietloudlab_logo_white.svg?react';

// Fathom Analytics
declare global {
  interface Window {
    fathom?: {
      trackEvent: (name: string, opts?: { _value?: number }) => void;
      trackPageview: (opts?: { url?: string; referrer?: string }) => void;
    };
  }
}

const trackEvent = (name: string) => {
  if (window.fathom) {
    window.fathom.trackEvent(name);
  }
};

const trackPageview = () => {
  if (window.fathom) {
    window.fathom.trackPageview();
  }
};

// Fire scroll-depth milestones (25/50/75/100%) once per page load.
// Resets on path change so SPA navigation gets a fresh set of milestones.
const useScrollDepth = (path: string) => {
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    const reached = new Set<number>();
    let ticking = false;
    const measure = () => {
      ticking = false;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        // Page is too short to scroll meaningfully; record 100% once.
        if (!reached.has(100)) {
          reached.add(100);
          trackEvent('Engagement: Scroll 100%');
        }
        return;
      }
      const pct = Math.round((window.scrollY / docHeight) * 100);
      milestones.forEach((m) => {
        if (pct >= m && !reached.has(m)) {
          reached.add(m);
          trackEvent(`Engagement: Scroll ${m}%`);
        }
      });
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    measure();
    return () => window.removeEventListener('scroll', onScroll);
  }, [path]);
};

// Fire a one-time event when a section first scrolls into view.
// Wrap any section in <TrackedSection eventName="..."> to opt in.
const TrackedSection = ({
  eventName,
  threshold = 0.3,
  children,
  ...rest
}: {
  eventName: string;
  threshold?: number;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, 'ref'>) => {
  const ref = useRef<HTMLElement | null>(null);
  const fired = useRef(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || fired.current) return;
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          trackEvent(eventName);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [eventName, threshold]);
  return <section ref={ref as React.RefObject<HTMLElement>} {...rest}>{children}</section>;
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
  bringWhen: string;
  together: string;
  leaveWith: string;
  engagements: string[][];
  cta: string;
  image: string;
  secondaryImage?: string;
};

const METHODOLOGY_PHASES: PhaseShowcaseItem[] = [
  {
    title: 'Product Invention & R&D',
    bringWhen:
      'You have a promising technology, research capability, or emerging opportunity — but its most meaningful product application is not yet clear.',
    together:
      'We investigate the technology alongside the people and systems around it, identify valuable applications, develop new product propositions and interaction models, and make the strongest directions tangible through prototypes.',
    leaveWith:
      'A clearer understanding of what the technology could become, supported by product concepts, prototypes, and evidence that can guide future investment and development.',
    engagements: [
      ['Product Opportunity Exploration', 'Identify meaningful applications for an emerging technology or research capability.'],
      ['Interaction Model Invention', 'Define new ways for people, technology, and systems to work together.'],
      ['Strategic Prototypes', 'Build tangible or functional demonstrations that make a future product direction easier to evaluate.'],
      ['Product Vision and Direction', 'Establish the proposition, principles, priorities, and recommended path forward.'],
    ],
    cta: 'Discuss an R&D project',
    image: '/images/hwh/explore.jpg',
    secondaryImage: '/images/hwh/explore2.webp',
  },
  {
    title: 'Zero-to-One Product Design',
    bringWhen:
      'You have a strong product idea, but the proposition, workflows, and experience are not yet clear enough to build, fund, or introduce to users.',
    together:
      'We research the people and context around the idea, define the product proposition and experience architecture, design the key interactions, and create a high-fidelity prototype that can be tested and refined.',
    leaveWith:
      'A coherent, validated product direction that your team can use to secure approval, raise funding, or begin development with greater confidence.',
    engagements: [
      ['Product Definition', 'Clarify the audience, value proposition, scope, and product model.'],
      ['Experience Architecture', 'Define the journeys, workflows, information, and interactions that make the product work.'],
      ['Prototype Development', 'Create a tangible product experience that stakeholders and users can understand and evaluate.'],
      ['Testing and Build Direction', 'Validate the concept and translate what we learn into priorities, requirements, and recommendations for development.'],
    ],
    cta: 'Discuss a product',
    image: '/images/hwh/validate.png',
    secondaryImage: '/images/hwh/validate2.webp',
  },
  {
    title: 'Experiments & Tools',
    bringWhen:
      'You have a promising technical capability, unresolved question, or unconventional idea that needs to be explored through making before it can become a product, platform, or strategic direction.',
    together:
      'We design focused experiments, demonstrators, and custom tools that reveal how a technology behaves in use, what kinds of value it can create, and which directions are worth pursuing. This is the same experimental practice that drives our independent studio research: building to understand, uncover possibilities, and develop new methods and intellectual property.',
    leaveWith:
      'A tangible piece of evidence — a working experiment, prototype, tool, framework, or interaction model — that clarifies the opportunity, creates reusable knowledge or IP, and gives your team something concrete to test, share, or build on.',
    engagements: [
      ['Commissioned R&D', 'Investigate an emerging capability or open question through focused research and making.'],
      ['Experimental Prototyping', 'Build functional demonstrations that uncover what a technology could enable.'],
      ['Custom Tools and Frameworks', 'Create reusable tools that help teams understand, design, or evaluate complex systems.'],
      ['Interaction Experiments', 'Explore new ways for people, technologies, and environments to relate and work together.'],
    ],
    cta: 'Discuss an experiment',
    image: '/images/hwh/design.webp',
    secondaryImage: '/images/hwh/design2.webp',
  },
];

const HWH_INTRO =
  'We work where new technologies, research, and ambitious ideas have not yet found the right product form. We help teams discover meaningful opportunities, define and prototype new products, and explore the ideas that may shape what comes next.';

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

// --- Immersive layer ---

// Read once at load: has this browser session already seen the boot intro?
const INTRO_SEEN = (() => {
  try { return sessionStorage.getItem('qll-intro') === '1'; } catch { return true; }
})();
const INTRO_DELAY = INTRO_SEEN ? 0 : 1.5;

const markIntroSeen = () => {
  try { sessionStorage.setItem('qll-intro', '1'); } catch { /* private mode: replay is fine */ }
};

// Headline words rise out of a clipping mask, one by one.
const MaskedWords = ({ text, delay = 0, stagger = 0.05, active = true }: { text: string; delay?: number; stagger?: number; active?: boolean }) => {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
            <motion.span
              className="inline-block"
              initial={{ y: shouldReduceMotion ? 0 : '115%' }}
              animate={active ? { y: 0 } : {}}
              transition={{ duration: shouldReduceMotion ? 0 : 0.75, ease: [0.16, 1, 0.3, 1], delay: delay + i * stagger }}
            >
              {word}
            </motion.span>
          </span>{' '}
        </React.Fragment>
      ))}
    </>
  );
};

// One word of a scroll-linked paragraph; opacity tracks scroll progress.
const ScrollWord = ({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) => {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <>
      <motion.span style={{ opacity }} className="inline">{children}</motion.span>{' '}
    </>
  );
};

// Paragraph that "inks in" word by word as the reader scrolls through it.
const ScrollWords = ({ text, className = '', style }: { text: string; className?: string; style?: React.CSSProperties }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLElement>,
    offset: ['start 0.85', 'end 0.45'],
  });
  const words = text.split(' ');
  if (shouldReduceMotion) {
    return <p ref={ref} className={`relative ${className}`} style={style}>{text}</p>;
  }
  return (
    <p ref={ref} className={`relative ${className}`} style={style}>
      {words.map((word, i) => (
        <ScrollWord
          key={`${word}-${i}`}
          progress={scrollYProgress}
          range={[i / words.length, Math.min((i + 1) / words.length + 0.04, 1)]}
        >
          {word}
        </ScrollWord>
      ))}
    </p>
  );
};

const MARQUEE_PHRASES = [
  'Friction is often a feature',
  'A system cannot be governed if it cannot be seen',
  'Human-in-the-loop by default',
  'Tools for thoughtful work',
  'The human layer of intelligent systems',
];

// Slow ticker of lab taglines. Decorative; the ideas live in the body copy.
const Marquee = ({ dark = false }: { dark?: boolean }) => {
  const run = MARQUEE_PHRASES.map((phrase, i) => (
    <span key={i} className="flex items-center shrink-0">
      <span className="font-mono text-xs md:text-sm uppercase tracking-widest text-gray-500">{phrase}</span>
      <span className="mx-6 md:mx-10 h-1.5 w-1.5 rounded-[1px] bg-lab-olive" />
    </span>
  ));
  return (
    <div className={`overflow-hidden py-5 border-y ${dark ? 'border-white/10' : 'border-lab-black/10'}`} aria-hidden="true">
      <div className="marquee-track">
        <div className="flex items-center shrink-0">{run}</div>
        <div className="flex items-center shrink-0">{run}</div>
      </div>
    </div>
  );
};

// --- ASCII instruments ---
// The lab's thesis is legibility, so the decorative layer renders in the most
// legible medium there is: text. Every canvas pauses off-screen and renders a
// single static frame under reduced motion.

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

type AsciiDraw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;

// Shared rAF / resize / visibility loop for ASCII canvases. `redrawKey`
// forces a fresh static frame under reduced motion when the content changes.
const useAsciiLoop = (draw: AsciiDraw, fps = 24, redrawKey?: unknown) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;
  const redrawRef = useRef<() => void>(() => {});
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) redrawRef.current();
  }, [redrawKey, shouldReduceMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let last = 0;
    let width = 0;
    let height = 0;
    const start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawRef.current(ctx, width, height, shouldReduceMotion ? 0 : (performance.now() - start) / 1000);
    };

    const loop = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / fps) return;
      last = now;
      if (width && height) drawRef.current(ctx, width, height, (now - start) / 1000);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    redrawRef.current = resize;
    resize();

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !shouldReduceMotion) {
        if (!running) {
          running = true;
          raf = requestAnimationFrame(loop);
        }
      } else {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [fps, shouldReduceMotion]);

  return canvasRef;
};

// The lab's theses, hidden in a field of noise. Legible only where the
// reader points — the mission statement enacted as an interaction.
const BAND_LINES = [
  'A SYSTEM CANNOT BE GOVERNED IF IT CANNOT BE SEEN',
  'FRICTION IS OFTEN A FEATURE',
  'HUMAN-IN-THE-LOOP BY DEFAULT',
  'TOOLS FOR THOUGHTFUL WORK',
];
const BAND_NOISE_CHARS = ' ····::··  ·:· ';

const AsciiRevealBand = () => {
  const pointer = useRef({ x: -9999, y: -9999, last: 0, has: false });
  const noise = useRef<Record<number, string>>({});
  const shouldReduceMotion = useReducedMotion();

  const draw: AsciiDraw = (ctx, w, h, t) => {
    const cw = 11;
    const chh = 20;
    const cols = Math.ceil(w / cw);
    const rows = Math.ceil(h / chh);
    ctx.clearRect(0, 0, w, h);
    ctx.font = '500 13px "JetBrains Mono", monospace';
    ctx.textBaseline = 'middle';

    let sx = pointer.current.x;
    let sy = pointer.current.y;
    const idle = !pointer.current.has || performance.now() - pointer.current.last > 2600;
    if (idle && !shouldReduceMotion) {
      // No pointer (or it left): a slow roaming spotlight reads the field.
      sx = w * (0.5 + 0.42 * Math.sin(t * 0.33));
      sy = h * (0.5 + 0.3 * Math.sin(t * 0.71 + 1.7));
    }
    const radius = 150;

    for (let r = 0; r < rows; r++) {
      const line = BAND_LINES[r % BAND_LINES.length] + '   ·   ';
      const offset = r * 9;
      const py = r * chh + chh / 2;
      for (let c = 0; c < cols; c++) {
        const px = c * cw;
        const hidden = line[(c + offset) % line.length];
        if (shouldReduceMotion) {
          if (hidden !== ' ') {
            ctx.fillStyle = 'rgba(5,5,5,0.45)';
            ctx.fillText(hidden, px, py);
          }
          continue;
        }
        const d = Math.hypot(px + cw / 2 - sx, py - sy);
        if (d < radius && hidden !== ' ') {
          const k = 1 - d / radius;
          ctx.fillStyle = k > 0.62 ? '#050505' : `rgba(107,116,86,${0.22 + k})`;
          ctx.fillText(hidden, px, py);
        } else {
          const idx = r * 512 + c;
          let ch = noise.current[idx];
          if (!ch || Math.random() < 0.012) {
            ch = BAND_NOISE_CHARS[(Math.random() * BAND_NOISE_CHARS.length) | 0];
            noise.current[idx] = ch;
          }
          if (ch !== ' ') {
            ctx.fillStyle = 'rgba(5,5,5,0.13)';
            ctx.fillText(ch, px, py);
          }
        }
      }
    }
  };

  const canvasRef = useAsciiLoop(draw, 24);

  return (
    <div
      className="relative h-full w-full cursor-crosshair"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        pointer.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, last: performance.now(), has: true };
      }}
      onMouseLeave={() => {
        pointer.current.has = false;
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
    </div>
  );
};

// Generative ASCII pattern per practice area, shown in the specimen viewer.
type SpecimenMode = 'lattice' | 'loop' | 'bounds' | 'drift';

const SPECIMEN_RAMP = ' ·:-=+*#%@';

const specimenField = (mode: SpecimenMode, nx: number, ny: number, t: number): number => {
  switch (mode) {
    case 'lattice': {
      // Legible Systems: a grid with a slow diagonal pulse traveling its lines.
      const gx = Math.abs(((nx * 8) % 1) - 0.5) < 0.07 ? 1 : 0;
      const gy = Math.abs(((ny * 6) % 1) - 0.5) < 0.09 ? 1 : 0;
      const grid = Math.max(gx, gy);
      const sweep = Math.max(0, 1 - Math.abs(((nx + ny + t * 0.12) % 1.4) - 0.7) * 5);
      return grid * (0.22 + sweep * 0.8) + 0.03;
    }
    case 'loop': {
      // Human–AI Co-Creativity: two bodies orbiting a shared ring.
      const a = t * 0.7;
      const d1 = Math.hypot(nx - (0.5 + 0.27 * Math.cos(a)), ny - (0.5 + 0.27 * Math.sin(a)));
      const d2 = Math.hypot(nx - (0.5 - 0.27 * Math.cos(a)), ny - (0.5 - 0.27 * Math.sin(a)));
      const ring = Math.exp(-((Math.hypot(nx - 0.5, ny - 0.5) - 0.27) ** 2) * 300) * 0.18;
      return Math.exp(-(d1 ** 2) * 60) + Math.exp(-(d2 ** 2) * 60) + ring;
    }
    case 'bounds': {
      // Constraints as Design Material: a particle alive inside a hard edge.
      const e = Math.min(nx, ny, 1 - nx, 1 - ny);
      const edge = Math.exp(-(e ** 2) * 2500) * 0.85;
      const tri = (v: number) => 2 * Math.abs((v % 2) - 1) - 1;
      const bx = 0.5 + 0.36 * tri(t * 0.23 + 0.3);
      const by = 0.5 + 0.32 * tri(t * 0.31);
      return edge + Math.exp(-((nx - bx) ** 2 + (ny - by) ** 2) * 90) + 0.02;
    }
    case 'drift': {
      // Tools for Thoughtful Work: slow columns settling at their own pace.
      const col = Math.floor(nx * 24);
      const speed = 0.05 + (((col * 7919) % 13) / 13) * 0.12;
      const phase = ((col * 104729) % 17) / 17;
      const yy = (ny + t * speed + phase) % 1;
      const fall = yy < 0.07 ? 1 - yy / 0.07 : 0;
      const sparse = (col * 31) % 5 < 2 ? 1 : 0.25;
      return fall * sparse + 0.025;
    }
  }
};

// Each practice area renders in its own hue: a bright accent for the
// pattern's peaks and a dark ink for the body, both cross-faded on switch.
const SPECIMEN_COLORS: Record<SpecimenMode, { accent: [number, number, number]; ink: [number, number, number] }> = {
  lattice: { accent: [107, 116, 86], ink: [54, 60, 44] },
  loop: { accent: [94, 126, 155], ink: [42, 57, 71] },
  bounds: { accent: [166, 106, 76], ink: [74, 49, 37] },
  drift: { accent: [138, 111, 158], ink: [61, 49, 70] },
};

const lerp3 = (a: [number, number, number], b: [number, number, number], k: number): [number, number, number] => [
  Math.round(a[0] + (b[0] - a[0]) * k),
  Math.round(a[1] + (b[1] - a[1]) * k),
  Math.round(a[2] + (b[2] - a[2]) * k),
];

// The active practice area's pattern, filling the whole section. The field
// stays quiet on the left where the text lives and grows louder to the
// right; the pointer brightens it locally; mode changes cross-fade.
const SpecimenField = ({ mode }: { mode: SpecimenMode }) => {
  const pointer = useRef({ x: -9999, y: -9999 });
  const blend = useRef({ from: mode, to: mode, at: 0 });
  if (blend.current.to !== mode) {
    blend.current = { from: blend.current.to, to: mode, at: performance.now() };
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const draw: AsciiDraw = (ctx, w, h, t) => {
    const cw = 13;
    const chh = 18;
    const cols = Math.ceil(w / cw);
    const rows = Math.ceil(h / chh);
    ctx.clearRect(0, 0, w, h);
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.textBaseline = 'middle';
    const { from, to, at } = blend.current;
    let k = clamp01((performance.now() - at) / 650);
    k = k * k * (3 - 2 * k);
    const rect = ctx.canvas.getBoundingClientRect();
    const px = pointer.current.x - rect.left;
    const py = pointer.current.y - rect.top;
    // Narrow screens have no quiet column — the text overlaps the field
    // everywhere — so the whole field steps back.
    const damp = w < 640 ? 0.5 : w < 1024 ? 0.7 : 1;
    const accent = k >= 1 ? SPECIMEN_COLORS[to].accent : lerp3(SPECIMEN_COLORS[from].accent, SPECIMEN_COLORS[to].accent, k);
    const ink = k >= 1 ? SPECIMEN_COLORS[to].ink : lerp3(SPECIMEN_COLORS[from].ink, SPECIMEN_COLORS[to].ink, k);
    const accentStyle = `rgb(${accent[0]},${accent[1]},${accent[2]})`;
    for (let r = 0; r < rows; r++) {
      const cy = r * chh + chh / 2;
      const ny = (r + 0.5) / rows;
      for (let c = 0; c < cols; c++) {
        const nx = (c + 0.5) / cols;
        let intensity =
          k >= 1
            ? specimenField(to, nx, ny, t)
            : (1 - k) * specimenField(from, nx, ny, t) + k * specimenField(to, nx, ny, t);
        intensity *= (0.35 + 0.65 * nx) * damp;
        const cx = c * cw + cw / 2;
        const d2 = (cx - px) ** 2 + (cy - py) ** 2;
        intensity *= 1 + 1.4 * Math.exp(-d2 / 22000);
        intensity = clamp01(intensity);
        const ch = SPECIMEN_RAMP[Math.min(SPECIMEN_RAMP.length - 1, Math.floor(intensity * SPECIMEN_RAMP.length))];
        if (ch === ' ') continue;
        ctx.fillStyle = intensity > 0.78 * damp
          ? accentStyle
          : `rgba(${ink[0]},${ink[1]},${ink[2]},${0.08 + intensity * 0.55})`;
        ctx.fillText(ch, c * cw, cy);
      }
    }
  };
  const canvasRef = useAsciiLoop(draw, 20, mode);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
};

// Print-registration "+" marks on panel corners.
const CornerMarks = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0">
    {(['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'] as const).map((pos) => (
      <span
        key={pos}
        className={`absolute ${pos} font-mono text-[10px] leading-none text-gray-400 ${pos.includes('right') ? 'translate-x-1/2' : '-translate-x-1/2'} ${pos.includes('bottom') ? 'translate-y-1/2' : '-translate-y-1/2'}`}
      >
        +
      </span>
    ))}
  </div>
);

// Fixed schematic chrome: a quiet tick rail on the page edge.
const SchematicFrame = () => (
  <div className="hidden xl:block pointer-events-none fixed inset-0 z-30" aria-hidden="true">
    <div
      className="absolute left-4 top-24 bottom-24 w-2"
      style={{ backgroundImage: 'repeating-linear-gradient(to bottom, rgba(128,128,128,0.4) 0 1px, transparent 1px 56px)' }}
    />
  </div>
);

// Once-per-session boot screen. Reduced motion skips it entirely.
const Preloader = ({ onDone }: { onDone: () => void }) => {
  const shouldReduceMotion = useReducedMotion();
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) { onDone(); return; }
    document.body.style.overflow = 'hidden';
    const exitTimer = window.setTimeout(() => setExiting(true), 1150);
    const doneTimer = window.setTimeout(() => {
      document.body.style.overflow = '';
      onDone();
    }, 1800);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = '';
    };
  }, [shouldReduceMotion, onDone]);

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[90] bg-lab-black flex flex-col items-center justify-center"
      animate={exiting ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
      aria-hidden="true"
    >
      <Logo className="h-5 md:h-6 w-auto" />
      <div className="mt-10 h-px w-44 md:w-64 bg-white/15 overflow-hidden">
        <motion.div
          className="h-full bg-lab-olive origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
};

const SectionHeader = ({ title, dark = false, id, rule = true, scatter = false }: { title: string; dark?: boolean; id?: string; rule?: boolean; scatter?: boolean }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const shouldReduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  // The letter the cursor entered over — the ripple's origin. -1 = not yet
  // hovered, so the scroll-in reveal ripples left-to-right instead.
  const [origin, setOrigin] = useState(-1);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // After the title scrolls in, wait a beat, then let RAND resolve 1000 → 0.
  useEffect(() => {
    if (!scatter || !isInView) return;
    const timer = setTimeout(() => setRevealed(true), 450);
    return () => clearTimeout(timer);
  }, [scatter, isInView]);

  const handleEnter = (e: React.MouseEvent) => {
    let idx = 0;
    let best = Infinity;
    letterRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.right) / 2);
      if (d < best) { best = d; idx = i; }
    });
    setOrigin(idx);
    setHovered(true);
  };

  // Scatterplot's RAND axis: scattered at 1000, resolved at 0. Each letter
  // shares the target but is delayed by its distance from the origin, so the
  // change ripples outward from where the cursor entered.
  const scattered = !shouldReduceMotion && (hovered || !revealed);
  const chars = scatter ? title.split('') : [];

  return (
    <div ref={ref} className={`relative pb-12 mb-8 ${rule ? 'pt-6' : ''}`}>
      {rule ? (
        <motion.div
          className={`absolute top-0 left-0 right-0 h-px origin-left ${dark ? 'bg-white/25' : 'bg-lab-black/20'}`}
          initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: shouldReduceMotion ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        />
      ) : null}
      {scatter ? (
        <h2 id={id} className={`text-3xl md:text-5xl tracking-tight font-medium ${dark ? 'text-lab-white' : 'text-lab-black'}`}>
          <span
            onMouseEnter={handleEnter}
            onMouseLeave={() => setHovered(false)}
            className="inline-block"
            style={{ fontFamily: '"scatterplot-vf", sans-serif' }}
          >
            {chars.map((ch, i) => {
              if (ch === ' ') return <span key={i}> </span>;
              const delay = origin < 0 ? i * 0.025 : Math.abs(i - origin) * 0.03;
              return (
                <span
                  key={i}
                  ref={(el) => { letterRefs.current[i] = el; }}
                  style={{
                    fontVariationSettings: `"RAND" ${scattered ? 1000 : 0}`,
                    transition: shouldReduceMotion ? 'none' : `font-variation-settings 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        </h2>
      ) : (
        <h2 id={id} className={`text-2xl md:text-4xl font-sans tracking-tight font-medium ${dark ? 'text-lab-white' : 'text-lab-black'}`}>
          <MaskedWords text={title} active={isInView} />
        </h2>
      )}
    </div>
  );
};

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

// --- What we do: editorial index ---

// Hairline that breaks out of the section gutters to the viewport edges,
// drawing in from the left on scroll — the section's full-bleed signature.
const BleedRule = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className="h-px bg-lab-black/25 origin-left -mx-6 md:-mx-10 lg:-mx-16 xl:-mx-24 transition-colors duration-500 group-hover:bg-lab-olive"
      initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
      animate={isInView ? { scaleX: 1 } : {}}
      transition={{ duration: shouldReduceMotion ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
    />
  );
};

// One offering as a full-width editorial spread: fluid display title, then
// the supporting copy distributed across the grid beneath — no labels.
const OfferingEntry = ({ phase }: { phase: PhaseShowcaseItem }) => (
  <article className="group pb-24 md:pb-40">
    <BleedRule />
    {/* One calm entrance for the whole entry */}
    <RevealText className="block pt-12 md:pt-20">
      <div className="grid grid-cols-12 gap-x-6 md:gap-x-10 lg:gap-x-12 gap-y-14 md:gap-y-24">
        {/* Display title */}
        <h3
          className="col-span-12 md:col-span-7 self-center font-sans font-medium tracking-tight text-lab-black"
          style={{ fontSize: 'clamp(2.5rem, 6.2vw, 8rem)', lineHeight: 0.95, letterSpacing: '-0.035em' }}
        >
          {phase.title}
        </h3>

        {/* Figure — olive duotone that blooms to colour on hover */}
        <div className="hwh-figure relative isolate col-span-12 md:col-span-4 md:col-start-9 self-center overflow-hidden rounded-[14px] aspect-[4/3]">
          <img className="base absolute inset-0 w-full h-full object-cover" src={phase.image} alt="" aria-hidden="true" />
          <img className="reveal absolute inset-0 w-full h-full object-cover" src={phase.secondaryImage ?? phase.image} alt="" aria-hidden="true" />
          <span className="tint absolute inset-0 bg-lab-olive mix-blend-color pointer-events-none" aria-hidden="true" />
        </div>

        {/* Supporting copy distributed across the full width */}
        <p className="col-span-12 md:col-span-4 max-w-[600px] font-sans text-gray-700 leading-relaxed lg:text-lg">
          {phase.together}
        </p>
        <p className="col-span-12 md:col-span-4 max-w-[600px] font-sans text-gray-700 leading-relaxed lg:text-lg">
          {phase.leaveWith}
        </p>
        <div className="col-span-12 md:col-span-4">
          <ul className="divide-y divide-lab-black/10 border-y border-lab-black/10">
            {phase.engagements.map(([title, body]) => (
              <li key={title} className="py-3.5">
                <p className="font-sans text-sm font-medium text-lab-black">{title}</p>
                <p className="mt-1 font-sans text-sm text-gray-600 leading-relaxed">{body}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12">
          <a
            href="#contact"
            onClick={() => trackEvent(`WhatWeDo CTA: ${phase.cta}`)}
            className="group/cta inline-flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-lab-black border-b border-lab-black/30 pb-1 hover:text-lab-olive hover:border-lab-olive transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-olive focus-visible:ring-offset-4"
          >
            {phase.cta}
            <ArrowRight size={15} className="transition-transform group-hover/cta:translate-x-1" aria-hidden="true" />
          </a>
        </div>
      </div>
    </RevealText>
  </article>
);

const WhatWeDo = ({ phases }: { phases: PhaseShowcaseItem[] }) => (
  <section id="approach" aria-label="What we do" className="bg-lab-white">
    {/* Intro + interactive field — side by side on large screens (the field
        fills the text's height), stacked & flush on smaller ones. */}
    <div className="flex flex-col border-y border-lab-black/10 lg:flex-row">
      {/* The field: on top on small (order-1), to the right on large (order-2) */}
      <div className="relative order-1 h-[220px] bg-[#F7F7F9] border-b border-lab-black/10 md:h-[260px] lg:order-2 lg:h-auto lg:w-5/12 lg:border-b-0 lg:border-l">
        <AsciiRevealBand />
        <p className="sr-only">
          A system cannot be governed if it cannot be seen. Friction is often a feature. Human-in-the-loop by default. Tools for thoughtful work.
        </p>
      </div>
      {/* The text: below on small (order-2), to the left on large (order-1) */}
      <div className="order-2 flex items-center px-6 py-16 md:px-10 md:py-24 lg:order-1 lg:w-7/12 lg:px-16 xl:px-24">
        <RevealText className="block max-w-4xl">
          <p className="font-sans text-2xl md:text-4xl lg:text-5xl text-lab-black tracking-tight leading-[1.25]">
            {HWH_INTRO}
          </p>
        </RevealText>
      </div>
    </div>

    <div className="px-6 md:px-10 lg:px-16 xl:px-24 py-20 md:py-32">
      {phases.map((phase) => (
        <OfferingEntry key={phase.title} phase={phase} />
      ))}
    </div>
  </section>
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
  const [hidden, setHidden] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Slip out of the way while reading down; return on any scroll up.
  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (shouldReduceMotion) return;
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 180 && !isOpen);
  });

  const navItems = [
      { name: "Practice", href: "/#practice" },
      { name: "Open work", href: "/#atlas" },
      { name: "Speaking", href: "/speaking" },
      { name: "Contact", href: "/#contact" },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-40 bg-lab-white/90 backdrop-blur-md border-b border-lab-black/10"
      role="navigation"
      aria-label="Main"
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      onFocusCapture={() => setHidden(false)}
    >
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
    </motion.nav>
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
          <h1 className="mb-8 text-5xl md:text-7xl lg:text-[5.5rem] font-sans tracking-tight leading-tight font-medium text-lab-black selection:bg-lab-olive selection:text-white">
            <MaskedWords text="quietloudlab is a design invention studio, shaping emerging technologies to become useful, meaningful products." delay={INTRO_DELAY + 0.1} />
          </h1>
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
      <div className="max-w-screen-2xl mx-auto space-y-10 md:space-y-14">
        <ScrollWords
          text="We work collaboratively with companies to turn new technologies and complex ideas into clear product propositions, interaction models, and working prototypes."
          className="text-3xl md:text-5xl lg:text-6xl font-sans text-gray-700"
          style={{ lineHeight: 1.6 }}
        />
        <ScrollWords
          text="Our work moves from early research and product R&D through experience definition, prototyping, and validation, with particular depth in AI systems designed to expand human agency, creativity, and judgment."
          className="text-3xl md:text-5xl lg:text-6xl font-sans text-gray-700"
          style={{ lineHeight: 1.6 }}
        />
      </div>
    </section>
    </>
  );
};

const SPECIMEN_MODES: SpecimenMode[] = ['lattice', 'loop', 'bounds', 'drift'];

const DispatchCard = () => (
  <div className="relative border border-lab-black/15 bg-lab-white p-6">
    <CornerMarks />
    <h3 className="font-sans text-lg font-medium text-lab-black mb-3">The Dispatch</h3>
    <p className="font-serif text-gray-600 mb-6">
      Occasional notes on systems, futures, and the lab's work. No spam, just signal.
    </p>
    <NewsletterForm />
  </div>
);

const Practice = () => {
  const [active, setActive] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  return (
    <section id="practice" aria-labelledby="practice-heading" className="relative overflow-hidden bg-[#F7F7F9] border-y border-lab-black/10">
      <SpecimenField mode={SPECIMEN_MODES[active]} />

      <div className="relative z-10 px-6 md:px-12 pt-16 md:pt-24 pb-20 md:pb-32">
        <SectionHeader title="Areas of Practice" id="practice-heading" rule={false} scatter />

        <RevealText>
          <div className="max-w-3xl space-y-5 font-serif text-lg md:text-xl text-gray-700 leading-relaxed mb-12 md:mb-20">
            <p>We reserve time for independent research and experimentation around questions we believe will shape future products and interactions.</p>
            <p>Through prototypes, tools, frameworks, and open research, we develop new ways of thinking and making that inform both our commissioned work and the studio&apos;s own inventions.</p>
          </div>
        </RevealText>

        <div className="mt-2 md:mt-6">
          {PRACTICE_AREAS.map((area, i) => {
            const isActive = i === active;
            return (
              <RevealText key={area.title} delay={i * 0.05}>
                <div className="group">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-expanded={isActive}
                    aria-controls={`practice-panel-${i}`}
                    className="block w-full text-left py-[clamp(0.5rem,1.4vh,1.25rem)] focus:outline-none"
                  >
                    <span
                      className={`font-sans font-medium transition-colors duration-300 ${isActive ? 'text-lab-black' : 'text-lab-black/20 group-hover:text-lab-black/45'}`}
                      style={{ fontSize: 'clamp(2.5rem, 6.5vw, 7rem)', lineHeight: 0.95, letterSpacing: '-0.04em', display: 'inline-block' }}
                    >
                      {area.title}
                    </span>
                  </button>
                  <motion.div
                    id={`practice-panel-${i}`}
                    initial={false}
                    animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-3xl pt-3 pb-8 font-serif text-xl md:text-2xl text-gray-700 leading-relaxed">
                      {area.desc}
                    </p>
                  </motion.div>
                </div>
              </RevealText>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ATLAS_DIMENSIONS = ['AI Patterns', 'Human Actions', 'System Ops', 'Data', 'Constraints', 'Touchpoints'];

// Dark-card CTA shared by the Open work section.
const DarkCTA = ({ href, label, onClick, variant = 'solid' }: { href: string; label: string; onClick?: () => void; variant?: 'solid' | 'ghost' }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    onClick={onClick}
    className={`group/btn inline-flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-lab-black focus:ring-lab-olive ${
      variant === 'solid'
        ? 'bg-lab-white text-lab-black hover:bg-lab-olive hover:text-white'
        : 'border border-white/20 text-gray-300 hover:border-lab-olive hover:text-white'
    }`}
  >
    {label}
    <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
  </a>
);

// A faint ASCII field that slowly breathes, with a soft glow of light
// drifting through it and a vignette that fades it into the dark. Ambient
// background texture, not a diagram. Static (very faint) under reduced motion.
const AMBIENT_RAMP = ' ·:-=+';

// On hover the glow drifts to the hovered card's vertical slot (reaching
// toward it across the gap), and each entry nudges the field its own way:
//   0 Atlas  → a faint lattice surfaces (the framework's structure)
//   1 Studio → the field quickens and flows (the interactive tool)
//   2 Review → the glow tightens to a brighter point (the lens / diagnostic)
const AmbientField = ({ hoveredRef }: { hoveredRef: React.MutableRefObject<number | null> }) => {
  const pointer = useRef({ x: -9999, y: -9999 });
  const anim = useRef({ grid: 0, flow: 0, focus: 0, glow: 0, gx: 0, gy: 0 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const onMove = (e: MouseEvent) => { pointer.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const draw: AsciiDraw = (ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const cw = 13, chh = 17;
    const cols = Math.ceil(w / cw), rows = Math.ceil(h / chh);
    const still = shouldReduceMotion;

    // ease the per-card reactivity toward its target each frame
    const tgt = hoveredRef.current;
    const a = anim.current;
    const ease = (cur: number, target: number) => cur + (target - cur) * 0.07;
    a.grid = ease(a.grid, !still && tgt === 0 ? 1 : 0);
    a.flow = ease(a.flow, !still && tgt === 1 ? 1 : 0);
    a.focus = ease(a.focus, !still && tgt === 2 ? 1 : 0);
    a.glow = ease(a.glow, !still && tgt !== null ? 1 : 0);

    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textBaseline = 'middle';
    const rect = ctx.canvas.getBoundingClientRect();
    const px = pointer.current.x - rect.left;
    const py = pointer.current.y - rect.top;
    const hasPointer = !still && px > -9000;

    // a soft glow of light drifting through the field. Studio speeds it up;
    // on hover it eases toward the hovered card's vertical slot (right edge);
    // Review tightens it to a brighter point.
    const ft = t * (1 + a.flow * 1.4);
    const freeX = w * (0.5 + 0.32 * Math.sin(ft * 0.05));
    const freeY = h * (0.5 + 0.28 * Math.cos(ft * 0.041));
    if (a.gx === 0 && a.gy === 0) { a.gx = freeX; a.gy = freeY; }
    let targetX = freeX, targetY = freeY;
    if (!still && tgt !== null) { targetX = w * 0.78; targetY = h * (0.22 + tgt * 0.28); }
    a.gx += (targetX - a.gx) * 0.08;
    a.gy += (targetY - a.gy) * 0.08;
    const fx = a.gx, fy = a.gy;
    const fr2 = (w * 0.26 * (1 - a.focus * 0.5)) ** 2;
    const glowStrength = 0.95 + a.glow * 0.45 + a.focus * 0.4;
    const flowShift = a.flow * t * 0.25;

    for (let r = 0; r < rows; r++) {
      const cy = r * chh + chh / 2;
      const ny = (r + 0.5) / rows;
      for (let c = 0; c < cols; c++) {
        const cx = c * cw + cw / 2;
        const nx = (c + 0.5) / cols;
        // slow breathing waves over a soft, ever-present floor
        const v = 0.5 + 0.5 * Math.sin(nx * 4 + t * 0.12 + flowShift) * Math.cos(ny * 3 - t * 0.1);
        // drifting glow lifts the field locally
        const glow = still ? 0 : Math.exp(-(((cx - fx) ** 2 + (cy - fy) ** 2)) / (2 * fr2)) * glowStrength;
        // Atlas: a faint lattice surfaces
        const lattice = a.grid > 0.01
          ? (Math.abs(((nx * 7) % 1) - 0.5) < 0.055 || Math.abs(((ny * 5) % 1) - 0.5) < 0.07 ? 1 : 0) * a.grid * 0.2
          : 0;
        // radial vignette so the base field fades into the dark at the edges
        const vig = Math.max(0, 1 - Math.hypot(nx - 0.5, ny - 0.5) / 0.62);
        // the glow keeps most of its strength as it travels, so it can reach a card
        const glowVig = 0.45 + 0.55 * vig;
        // gentle ambient response to the cursor
        const cb = hasPointer ? Math.max(0, 1 - Math.hypot(cx - px, cy - py) / 260) * 0.5 : 0;
        let intensity = ((0.16 + v * 0.24 + lattice) * vig + glow * glowVig) * (1 + cb + a.glow * 0.15);
        intensity = clamp01(intensity);
        if (intensity < 0.05) continue;
        const ch = AMBIENT_RAMP[Math.min(AMBIENT_RAMP.length - 1, Math.floor(intensity * AMBIENT_RAMP.length))];
        if (ch === ' ') continue;
        ctx.fillStyle = `rgba(107,116,86,${0.05 + intensity * 0.19})`;
        ctx.fillText(ch, c * cw, cy);
      }
    }
  };

  const canvasRef = useAsciiLoop(draw, 18);
  return <canvas ref={canvasRef} className="block w-full h-full" aria-hidden="true" />;
};

// Eyebrow + body shared by the open-work entries (no card boxes). Hovering an
// entry warms its rule, eases its title over, and signals the field (onHover).
const OpenEntry = ({ index, onHover, eyebrow, meta, title, titleClass = 'text-3xl md:text-4xl', children }: { index: number; onHover: (i: number | null) => void; eyebrow: string; meta?: string; title: string; titleClass?: string; children?: React.ReactNode }) => (
  <article
    className="open-entry border-t border-white/10 pt-8 md:pt-10 pb-10 md:pb-12 last:pb-0 transition-colors duration-500 hover:border-lab-olive/50"
    onMouseEnter={() => onHover(index)}
    onMouseLeave={() => onHover(null)}
    onFocus={() => onHover(index)}
    onBlur={() => onHover(null)}
  >
    <div className="flex items-baseline justify-between gap-4">
      <p className="font-mono text-xs uppercase tracking-widest text-lab-olive">{eyebrow}</p>
      {meta ? <p className="font-mono text-xs uppercase tracking-widest text-gray-500">{meta}</p> : null}
    </div>
    <h3 className={`mt-5 font-sans tracking-tight leading-[1.05] font-medium text-lab-white ${titleClass}`}>{title}</h3>
    {children}
  </article>
);

const OpenWork = () => {
  const hoveredRef = useRef<number | null>(null);
  const onHover = (i: number | null) => { hoveredRef.current = i; };
  return (
    <section className="bg-lab-black text-lab-white px-6 md:px-10 lg:px-16 xl:px-24 py-20 md:py-32" id="atlas" aria-label="Open work">
      <SectionHeader title="Open work" dark rule={false} scatter />

      <div className="min-[1800px]:grid min-[1800px]:grid-cols-2 min-[1800px]:gap-x-20 min-[1800px]:items-stretch">
        {/* Left: framing + living visual (visual only on very wide screens) */}
        <div className="flex flex-col">
          <RevealText>
            <p className="max-w-3xl font-sans text-2xl md:text-3xl lg:text-4xl text-gray-300 tracking-tight leading-[1.25]">
              We build and open-source the thinking behind our work — a shared language for AI systems, and a tool that puts it to use.
            </p>
          </RevealText>
          <div className="hidden min-[1800px]:block flex-1 min-h-[460px] mt-16" aria-hidden="true">
            <AmbientField hoveredRef={hoveredRef} />
          </div>
        </div>

        {/* Right: the open work, stacked editorially (no cards) */}
        <div className="mt-16 min-[1800px]:mt-0">
          <RevealText>
            <OpenEntry index={0} onHover={onHover} eyebrow="Framework · Open source" meta="Apache-2.0" title="AI Interaction Atlas">
              <p className="mt-4 max-w-xl font-sans text-gray-400 leading-relaxed">
                A shared vocabulary for designing and governing AI systems — naming the capabilities, constraints, interactions, and responsibility a system holds.
              </p>
              <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
                {ATLAS_DIMENSIONS.map((d) => (
                  <li key={d} className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-400">
                    <span className="h-1 w-1 rounded-[1px] bg-lab-olive" aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <DarkCTA href="https://ai-interaction.com" label="Explore the Atlas" onClick={() => trackEvent('Atlas Link Clicked')} />
                <DarkCTA href="https://github.com/quietloudlab/ai-interaction-atlas" label="GitHub" onClick={() => trackEvent('GitHub Link Clicked')} variant="ghost" />
              </div>
            </OpenEntry>
          </RevealText>

          <RevealText delay={0.06}>
            <OpenEntry index={1} onHover={onHover} eyebrow="Tool · Free" meta="Built on the Atlas" title="AI Interaction Studio">
              <p className="mt-4 max-w-xl font-sans text-gray-400 leading-relaxed">
                The Atlas, made interactive — map any human–AI experience and document how the system lives in the world.
              </p>
              <div className="mt-8">
                <DarkCTA href="https://studio.ai-interaction.com" label="Open the Studio" onClick={() => trackEvent('Studio Link Clicked')} />
              </div>
            </OpenEntry>
          </RevealText>

          <RevealText delay={0.12}>
            <OpenEntry index={2} onHover={onHover} eyebrow="Diagnostic · Free" title="Want us to run the Atlas over your product?" titleClass="text-2xl md:text-3xl">
              <p className="mt-4 max-w-xl font-sans text-gray-400 leading-relaxed">
                A free session where we put your AI product under the lens of the Atlas and find the biggest gaps — you&apos;ll leave with 2–3 specific things to fix.
              </p>
              <div className="mt-8">
                <DarkCTA href="https://cal.com/quietloudlab/chat" label="Book a review" onClick={() => trackEvent('Book AI Interaction Review')} />
              </div>
            </OpenEntry>
          </RevealText>
        </div>
      </div>
    </section>
  );
};

// cal.com inline booking. Adjust CAL_LINK to the event you want embedded.
const CAL_LINK = 'quietloudlab/chat';
const CAL_NS = 'contact';

// Bootstrap the official cal.com embed loader exactly once.
const ensureCalLoaded = () => {
  const w = window as unknown as { Cal?: ReturnType<typeof Object> & { ns?: Record<string, (...a: unknown[]) => void> } } & Record<string, unknown>;
  if (w.Cal) return w.Cal as unknown as { (...a: unknown[]): void; ns: Record<string, (...a: unknown[]) => void> };
  /* eslint-disable */
  (function (C: any, A: string, L: string) {
    let p = function (a: any, ar: any) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal; let ar = arguments;
      if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true; }
      if (ar[0] === L) {
        const api: any = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); }
        else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');
  /* eslint-enable */
  return (window as any).Cal as { (...a: unknown[]): void; ns: Record<string, (...a: unknown[]) => void> };
};

const CalBooking = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const Cal = ensureCalLoaded();
    Cal('init', CAL_NS, { origin: 'https://cal.com' });
    Cal.ns[CAL_NS]('inline', {
      elementOrSelector: ref.current,
      calLink: CAL_LINK,
      layout: 'month_view',
      config: { layout: 'month_view' },
    });
    Cal.ns[CAL_NS]('ui', {
      theme: 'dark',
      hideEventTypeDetails: false,
      layout: 'month_view',
      cssVarsPerTheme: { light: { 'cal-brand': '#6B7456' }, dark: { 'cal-brand': '#6B7456' } },
    });
  }, []);
  // Cal's month_view renders very tall (calendar + time list stacked); cap it
  // to a fixed window and scroll inside so it doesn't balloon the section.
  return (
    <div className="w-full overflow-y-auto rounded-lg bg-transparent">
      <div ref={ref} className="w-full" />
    </div>
  );
};

const ContactChannel = ({ label, children }: { label: string; children?: React.ReactNode }) => (
  <div>
    <p className="font-mono text-xs uppercase tracking-widest mb-2 text-lab-olive">{label}</p>
    <div className="font-mono text-sm text-gray-600">{children}</div>
  </div>
);

const Contact = ({ contactIntent }: { contactIntent: ContactIntent | null }) => {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="bg-lab-white">
      <div className="px-6 md:px-10 lg:px-16 xl:px-24 py-20 md:py-32">
        <SectionHeader title="Start a Conversation" id="contact-heading" rule={false} scatter />

        {/* Two paths, side by side across the full width */}
        <div className="mt-12 md:mt-16 flex flex-col gap-10 lg:flex-row-reverse lg:items-center lg:gap-12">
          {/* Primary — book a chat */}
          <RevealText className="lg:w-7/12">
            <CalBooking />
          </RevealText>

          {/* Secondary — write a message */}
          <RevealText delay={0.1} className="lg:w-5/12">
            <div className="relative border border-lab-black/15 bg-lab-white">
              <CornerMarks />
              <div className="p-6 md:p-8">
                <ContactForm contactIntent={contactIntent} />
              </div>
            </div>
          </RevealText>
        </div>

        {/* Other channels + dispatch — slim strip */}
        <div className="mt-16 md:mt-20 border-t border-lab-black/15 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8 lg:gap-x-12 items-start">
          <RevealText className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <ContactChannel label="Email">
                <a href="mailto:brandon@quietloudlab.com" onClick={() => trackEvent('Email Link Clicked')} className="hover:text-lab-olive transition-colors break-all">brandon@quietloudlab.com</a>
              </ContactChannel>
              <ContactChannel label="Connect">
                <a href="https://www.linkedin.com/company/quietloudlab" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('LinkedIn Link Clicked')} className="hover:text-lab-olive transition-colors">LinkedIn</a>
              </ContactChannel>
              <ContactChannel label="Location">Dallas, TX / Remote</ContactChannel>
            </div>
          </RevealText>
          <RevealText delay={0.1} className="lg:col-span-5">
            <DispatchCard />
          </RevealText>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-lab-black text-lab-white" role="contentinfo">
      <Marquee dark />
      <div className="max-w-screen-xl mx-auto py-16 px-6 md:px-12">
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

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t border-white/20 pt-8 font-mono text-xs text-gray-600 gap-2">
          <div className="mb-4 md:mb-0">
            <span>&copy; 2026 quietloudlab. All rights reserved.</span>
          </div>
          <div>
            <span>Dallas, TX / Remote</span>
          </div>
        </div>

        {/* Oversized wordmark as the site's closing image */}
        <RevealText className="mt-16">
          <div aria-hidden="true">
            <LogoSvg className="w-full h-auto text-lab-white opacity-90" />
          </div>
        </RevealText>
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

const DetailSectionHeader = ({ id, title, kicker }: { id?: string; title: string; kicker?: string }) => (
  <div className="flex flex-col md:flex-row items-baseline border-t border-lab-black/20 pt-6 pb-10 md:pb-12 mb-8">
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
    sortDate: '2026-08-20',
    formatTag: 'Hands-On Workshop · Business Leaders',
    title: 'Build Your AI Plan',
    date: 'Thu, Aug 20, 2026 · 10:00 AM – 1:00 PM',
    location: 'Dallas, TX',
    venue: 'Location TBD',
    summary: 'A three-hour, hands-on workshop for small and medium business leaders. Pick one real problem, find the AI approach that fits, and leave with a one-page plan you can start executing Monday morning.',
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

// Events move from "Upcoming" to "Past" automatically once their date has passed.
// Day-granularity: an event counts as past when its start date is before today.
const todayISO = () => new Date().toISOString().slice(0, 10);
const isPastCard = (card: SpeakingCard, today: string) => card.sortDate < today;

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

const SpeakingUpcoming = ({ cards }: { cards: Array<{ card: SpeakingCard; variant: HubCardVariant }> }) => (
  <section id="upcoming" className="py-16 md:py-24 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="upcoming-heading">
    <SectionHeader title="Upcoming" id="upcoming-heading" />
    {cards.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cards.map(({ card, variant }, i) => (
          <RevealText key={card.id} delay={i * 0.08}>
            <SpeakingHubCard card={card} variant={variant} />
          </RevealText>
        ))}
      </div>
    ) : (
      <RevealText>
        <p className="font-serif text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
          Nothing on the public calendar right now. If you&apos;d like us in a room of your own — a talk, a workshop, or a private session — there&apos;s a way to set that up below.
        </p>
      </RevealText>
    )}
  </section>
);

const SpeakingPast = ({ events }: { events: SpeakingCard[] }) => (
  <section id="past" className="py-16 md:py-24 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="past-heading">
    <SectionHeader title="Past" id="past-heading" />
    <RevealText>
      <div className="border-t border-lab-black/15">
        {events.map((event) => (
          <div key={event.id} className="border-b border-lab-black/15 py-5 md:py-6 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6">
            <p className="md:col-span-2 font-mono text-sm text-gray-600">{event.date}</p>
            <div className="md:col-span-6">
              <p className="font-mono text-xs uppercase tracking-widest text-lab-olive mb-1">{event.formatTag}</p>
              <h3 className="font-sans text-lg md:text-xl font-medium tracking-tight text-lab-black">{event.title}</h3>
            </div>
            <p className="md:col-span-2 font-mono text-sm text-gray-600">
              {event.location}
              {event.venue ? ` · ${event.venue}` : ''}
            </p>
            <div className="md:col-span-2 md:text-right">
              <PageLink
                to={event.href}
                onClick={() => trackEvent(`Speaking Past: ${event.id}`)}
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-lab-black hover:text-lab-olive transition-colors focus:outline-none focus:text-lab-olive"
              >
                Details <ArrowRight size={12} aria-hidden="true" />
              </PageLink>
            </div>
          </div>
        ))}
      </div>
    </RevealText>
  </section>
);

const SpeakingHireCTA = () => (
  <section id="hire" className="py-20 md:py-32 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="hire-heading">
    <SectionHeader title="Bring quietloudlab to your team" id="hire-heading" />
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
  const today = todayISO();
  // Upcoming = talks + open windows that haven't passed yet, soonest first.
  const upcomingCards: Array<{ card: SpeakingCard; variant: HubCardVariant }> = [
    ...UPCOMING_CARDS.filter((c) => !isPastCard(c, today)).map((card) => ({ card, variant: 'upcoming' as const })),
    ...OPEN_WINDOWS_CARDS.filter((c) => !isPastCard(c, today)).map((card) => ({ card, variant: 'open-window' as const })),
  ].sort((a, b) => a.card.sortDate.localeCompare(b.card.sortDate));
  // Past = delivered talks only (expired open windows are dropped), most recent first.
  const pastEvents = UPCOMING_CARDS
    .filter((c) => isPastCard(c, today))
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate));
  const showPast = pastEvents.length > 0;
  return (
    <PageShell>
      <SpeakingHubHero />
      <SpeakingUpcoming cards={upcomingCards} />
      {showPast ? <SpeakingPast events={pastEvents} /> : null}
      <SpeakingHireCTA />
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
            <p className="font-sans text-base text-lab-black leading-relaxed max-w-2xl">
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

// --- Speaking detail: Build Your AI Plan (Greater East Dallas Chamber) ---

const IDEA_LAB_REGISTER_URL = 'https://business.eastdallaschamber.com/gedcc-calendar/Details/build-your-ai-plan-a-hands-on-workshop-for-business-leaders-1727532?sourceTypeId=Hub';

type IdeaLabTopic = {
  tag: string;
  title: string;
  body: string;
};

const IDEA_LAB_TOPICS: IdeaLabTopic[] = [
  {
    tag: 'Part one',
    title: 'Start with a real problem',
    body: 'We begin with one real problem from your business — not a hypothetical. The whole session is built around the work you actually do day to day.',
  },
  {
    tag: 'Part two',
    title: 'Find the AI that fits',
    body: 'Using the same process Brandon runs with enterprise clients, we work out which kind of AI solution actually fits your problem — and which approaches to leave alone.',
  },
  {
    tag: 'Part three',
    title: 'Leave with a plan',
    body: 'You map exactly what the solution should do and walk out with a one-page plan, plus a clear answer on whether you can build it yourself in Claude or need a hand.',
  },
];

const IdeaLabMastermindPage = () => {
  useEffect(() => { document.title = 'Build Your AI Plan · Speaking · quietloudlab'; }, []);

  return (
    <PageShell>
      <DetailHero
        eyebrow="Hands-On Workshop · Greater East Dallas Chamber"
        title="Build Your AI Plan"
        lead="A three-hour, hands-on workshop for small and medium business leaders. Brandon walks you through the same process he uses with enterprise clients: pick one real problem, figure out which kind of AI solution fits it, map exactly what it should do, and leave with a working plan you can start executing Monday morning."
        meta={[
          { key: 'Date', value: 'Thu, Aug 20, 2026' },
          { key: 'Time', value: '10:00 AM – 1:00 PM CDT' },
          { key: 'Location', value: 'Dallas, TX · TBD' },
          { key: 'Price', value: '$99 members · $149 non-members' },
        ]}
      />

      <section className="py-16 md:py-24 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="idea-lab-cover-heading">
        <DetailSectionHeader id="idea-lab-cover-heading" title="What we'll cover" kicker="Three parts in three hours" />
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
              Bring with you
            </p>
            <p className="font-sans text-sm md:text-base text-gray-700 leading-relaxed">
              A laptop and one real problem from your business — that problem becomes the thing we build your plan around.
            </p>
          </div>
        </RevealText>
      </section>

      <section className="pb-20 md:pb-32 px-6 md:px-12 max-w-screen-xl mx-auto">
        <RevealText>
          <div className="bg-lab-concrete rounded-2xl p-6 md:p-10">
            <LabGrid>
              <div className="col-span-1 md:col-span-7">
                <p className="font-mono text-xs uppercase tracking-widest text-lab-olive mb-4">$99 members · $149 non-members · Space limited</p>
                <h3 className="font-sans text-2xl md:text-3xl font-medium tracking-tight text-lab-black mb-4">
                  Register through the chamber.
                </h3>
                <p className="font-serif text-base md:text-lg text-gray-600 leading-relaxed max-w-xl">
                  Registration runs through the Greater East Dallas Chamber of Commerce — open to members and non-members alike. Most attendees ship their first working AI workflow within 30 days of the workshop. If you'd rather run a private version for your own team, reach out directly.
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
                  href="mailto:brandon@quietloudlab.com?subject=Build%20Your%20AI%20Plan%20%E2%80%94%20Aug%2020"
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
        <DetailSectionHeader id="uxlx-sessions-heading" title="On the program" kicker="Two sessions at UXLX" />
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
              onClick={() => {
                setOpenIndex(isOpen ? null : i);
                if (!isOpen) trackEvent(`FAQ Open: ${item.q}`);
              }}
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
  const trackedShownRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 500;
      setVisible(next);
      if (next && !trackedShownRef.current) {
        trackedShownRef.current = true;
        trackEvent('Sticky: Shown');
      }
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
                className="font-sans text-sm text-lab-black hover:text-lab-olive transition-colors inline-flex items-center gap-1.5"
              >
                Barcelona · May 17–22 <ArrowRight size={12} aria-hidden="true" />
              </PageLink>
              <PageLink
                to="/speaking/berlin-2026"
                onClick={() => trackEvent('Speaking Header: Berlin Notice')}
                className="font-sans text-sm text-lab-black hover:text-lab-olive transition-colors inline-flex items-center gap-1.5"
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
              <p className="font-serif text-base text-gray-600 leading-relaxed max-w-xl">
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

      <TrackedSection eventName="Section: Viewed Sessions" className="relative isolate py-16 md:py-24 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="sessions-heading">
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
                    <p className="font-sans text-lg text-lab-black font-medium shrink-0">{row.amount}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 font-serif text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                Please don't take a €35 ticket if you can afford the Out-of-pocket ticket, and please don't take one and not show up. You're keeping someone else from getting it.
              </p>
            </RevealText>
          </div>
        </LabGrid>
      </TrackedSection>

      <TrackedSection eventName="Section: Viewed Facilitators" className="relative isolate pt-16 md:pt-24 pb-16 md:pb-24 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="facilitators-heading">
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
      </TrackedSection>

      <TrackedSection eventName="Section: Viewed FAQ" className="relative isolate py-16 md:py-24 px-6 md:px-12 max-w-screen-xl mx-auto" aria-labelledby="faq-heading">
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
      </TrackedSection>

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
        <DetailSectionHeader id="ways-heading" title="Ways we could work together" kicker="A few examples, not a menu" />
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
    <PageLink to="/#atlas" className="font-mono text-xs uppercase tracking-widest text-gray-600 hover:text-lab-olive transition-colors whitespace-nowrap">Open work</PageLink>
    <PageLink to="/speaking" className="font-mono text-xs uppercase tracking-widest text-gray-600 hover:text-lab-olive transition-colors">Speaking</PageLink>
    <PageLink to="/#contact" className="font-mono text-xs uppercase tracking-widest text-gray-600 hover:text-lab-olive transition-colors">Contact</PageLink>
  </nav>
);

const PageShell = ({ children }: { children?: React.ReactNode }) => (
  <div className="w-full bg-lab-white min-h-screen selection:bg-lab-olive selection:text-white relative">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-lab-black focus:text-lab-white focus:p-4 focus:font-mono focus:text-sm">Skip to content</a>
    <SchematicFrame />
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
      <WhatWeDo phases={METHODOLOGY_PHASES} />
      <Practice />
      <OpenWork />
      <Contact contactIntent={null} />
    </PageShell>
  );
};

const App = () => {
  const path = usePath();
  const isInitialMount = useRef(true);
  const [introDone, setIntroDone] = useState(INTRO_SEEN);

  useScrollDepth(path);

  useEffect(() => {
    // Scroll to hash target when hash is present on any route change
    const { hash } = window.location;
    if (hash) {
      const id = hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Track SPA pageviews on route change. Fathom auto-tracks the first
    // load via its script tag, so skip the initial mount to avoid a
    // double-count for the page the user landed on.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    trackPageview();
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
      {!introDone && (
        <Preloader
          onDone={() => {
            markIntroSeen();
            setIntroDone(true);
          }}
        />
      )}
      {page}
    </>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
