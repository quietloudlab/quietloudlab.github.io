import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import ImagePlaceholder from '../ui/ImagePlaceholder';
import YellowTag from '../ui/YellowTag';

type StickyPhase = {
  title: string;
  timeline: string;
  problem: string;
  action: string;
  outcome: string;
  engagements: string[][];
  image: string;
};

type StickyPhaseShowcaseProps = {
  phases: StickyPhase[];
};

export default function StickyPhaseShowcase({ phases }: StickyPhaseShowcaseProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const titleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [active, setActive] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [titleTops, setTitleTops] = useState<number[]>([]);
  const [trackEnd, setTrackEnd] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (titleTops.length !== phases.length || trackEnd <= titleTops[0]) {
      return;
    }

    const pixelTop = titleTops[0] + value * (trackEnd - titleTops[0]);

    let nextActive = 0;
    for (let index = 0; index < titleTops.length; index += 1) {
      if (pixelTop >= titleTops[index]) {
        nextActive = index;
      }
    }

    const nextBoundary = nextActive < titleTops.length - 1 ? titleTops[nextActive + 1] : trackEnd;
    const sectionSpan = Math.max(1, nextBoundary - titleTops[nextActive]);
    const progress = Math.max(0, Math.min(1, (pixelTop - titleTops[nextActive]) / sectionSpan));

    setActive(nextActive);
    setPhaseProgress(progress);
  });

  useEffect(() => {
    const measure = () => {
      if (!railRef.current) {
        return;
      }

      const railTop = railRef.current.getBoundingClientRect().top;
      const tops = titleRefs.current.map((node) => {
        if (!node) {
          return 0;
        }
        const rect = node.getBoundingClientRect();
        return rect.top - railTop;
      });
      let end = 0;
      const lastNode = titleRefs.current[titleRefs.current.length - 1];
      if (lastNode) {
        const lastRect = lastNode.getBoundingClientRect();
        end = lastRect.top - railTop + lastRect.height - 8;
      }
      setTitleTops(tops);
      setTrackEnd(end);
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [phases.length]);

  const pixelTop = useMemo(() => {
    if (titleTops.length !== phases.length || trackEnd <= titleTops[0]) {
      return 0;
    }
    const start = titleTops[active];
    const end = active < phases.length - 1 ? titleTops[active + 1] : trackEnd;
    return start + (end - start) * phaseProgress;
  }, [active, phaseProgress, phases.length, titleTops, trackEnd]);

  return (
    <>
      <div ref={ref} className="relative hidden md:block" style={{ height: `${phases.length * 100}svh` }}>
        <div className="sticky top-0 flex min-h-screen flex-col justify-between py-[max(7svh,3.75rem)]">
          <div className="grid flex-1 gap-[clamp(40px,3.2vw,88px)] xl:grid-cols-[0.94fr_1.16fr_0.64fr]">
            <div className="flex min-w-0 flex-col justify-start">
              <p className="viewport-label mb-[clamp(2.2rem,5svh,4.5rem)] text-site-text">How we help</p>
              <div ref={railRef} className="relative">
                <span
                  className="absolute left-0 h-[8px] w-[8px] rounded-[1px] bg-site-highlight transition-transform duration-150 ease-out"
                  style={{
                    top: 0,
                    transform: `translateY(${pixelTop}px)`,
                  }}
                />
                {phases.map((phase, index) => (
                  <div
                    key={phase.title}
                    ref={(node) => {
                      titleRefs.current[index] = node;
                    }}
                    className="leading-none py-[clamp(0.9rem,1.9svh,1.6rem)] pl-[clamp(1.2rem,1.5vw,1.8rem)]"
                  >
                    <span
                      className={`${index === active ? 'text-site-text' : 'text-site-tertiary'}`}
                      ref={(node) => {
                        titleRefs.current[index] = node;
                      }}
                      style={{
                        fontSize: 'clamp(4.8rem, min(7.4vw, 10svh), 9rem)',
                        lineHeight: 0.86,
                        letterSpacing: '-0.07em',
                        fontWeight: 500,
                        display: 'inline-block',
                      }}
                    >
                      {phase.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0 pt-[min(10svh,5rem)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={phases[active].title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="space-y-[clamp(2.4rem,3.6svh,3.6rem)]"
                >
                  <div>
                    <YellowTag>Problem</YellowTag>
                    <p className="mt-[clamp(0.65rem,1svh,0.9rem)] max-w-[31ch] text-site-secondary" style={{ fontSize: 'clamp(1.08rem, min(1.7vw, 2.2svh), 1.92rem)', lineHeight: 1.14, letterSpacing: '-0.03em' }}>
                      {phases[active].problem}
                    </p>
                  </div>
                  <div>
                    <YellowTag>What we&apos;ll do</YellowTag>
                    <p className="mt-[clamp(0.65rem,1svh,0.9rem)] max-w-[31ch] text-site-secondary" style={{ fontSize: 'clamp(1.08rem, min(1.7vw, 2.2svh), 1.92rem)', lineHeight: 1.14, letterSpacing: '-0.03em' }}>
                      {phases[active].action}
                    </p>
                  </div>
                  <div>
                    <YellowTag>Outcome</YellowTag>
                    <p className="mt-[clamp(0.65rem,1svh,0.9rem)] max-w-[31ch] text-site-secondary" style={{ fontSize: 'clamp(1.08rem, min(1.7vw, 2.2svh), 1.92rem)', lineHeight: 1.14, letterSpacing: '-0.03em' }}>
                      {phases[active].outcome}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex min-w-0 flex-col justify-between pt-[min(5.5svh,4.25rem)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${phases[active].title}-meta`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="flex h-full flex-col justify-between"
                >
                  <div>
                    <div className="mb-[clamp(1.4rem,2svh,2rem)] inline-block">
                      <YellowTag>{phases[active].timeline}</YellowTag>
                    </div>
                    <p className="text-[clamp(1.05rem,1.1vw,1.35rem)] font-medium text-site-text">Typical Engagements</p>
                    <div className="mt-[clamp(1rem,1.5svh,1.35rem)] space-y-[clamp(1rem,1.5svh,1.5rem)] text-site-secondary" style={{ fontSize: 'clamp(1.08rem, min(1.7vw, 2.2svh), 1.92rem)', lineHeight: 1.14, letterSpacing: '-0.03em' }}>
                      {phases[active].engagements.map(([title, body]) => (
                        <div key={title}>
                          <p className="font-medium text-site-text">{title}</p>
                          <p className="mt-1">{body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-[clamp(2.5rem,6svh,5rem)] ml-auto w-full max-w-[clamp(15rem,18vw,22rem)] self-end">
                    <ImagePlaceholder
                      description={phases[active].image}
                      aspectRatio={active === 1 ? '1 / 1' : '4 / 5'}
                      radius="28px"
                      className="w-full"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 md:hidden">
        {phases.map((phase) => (
          <div key={phase.title} className="space-y-5 border-b border-site-border pb-10">
            <div className="text-site-text" style={{ fontSize: 'clamp(3rem, 13vw, 4.5rem)', lineHeight: 0.92, letterSpacing: '-0.06em', fontWeight: 700 }}>
              {phase.title}
            </div>
            <YellowTag>{phase.timeline}</YellowTag>
            <div>
              <YellowTag>Problem</YellowTag>
              <p className="mt-3 text-lg leading-8 text-site-secondary">{phase.problem}</p>
            </div>
            <div>
              <YellowTag>What we&apos;ll do</YellowTag>
              <p className="mt-3 text-lg leading-8 text-site-secondary">{phase.action}</p>
            </div>
            <div>
              <YellowTag>Outcome</YellowTag>
              <p className="mt-3 text-lg leading-8 text-site-secondary">{phase.outcome}</p>
            </div>
            <div>
              <p className="text-base font-medium text-site-text">Typical Engagements</p>
              <div className="mt-3 space-y-4 text-base leading-7 text-site-secondary">
                {phase.engagements.map(([title, body]) => (
                  <div key={title}>
                    <p className="font-medium text-site-text">{title}</p>
                    <p>{body}</p>
                  </div>
                ))}
              </div>
            </div>
            <ImagePlaceholder description={phase.image} aspectRatio="4 / 5" radius="22px" />
          </div>
        ))}
      </div>
    </>
  );
}
