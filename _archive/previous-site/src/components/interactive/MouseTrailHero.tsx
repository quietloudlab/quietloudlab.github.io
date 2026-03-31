import { AnimatePresence, motion } from 'framer-motion';
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import ImagePlaceholder from '../ui/ImagePlaceholder';

type TrailItem = {
  id: number;
  left: number;
  top: number;
  rotation: number;
  index: number;
  exiting?: boolean;
};

type MouseTrailHeroProps = {
  items: string[];
};

export default function MouseTrailHero({ items }: MouseTrailHeroProps) {
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));
  const lastSpawn = useRef(0);
  const idRef = useRef(0);
  const mobileItems = useMemo(() => items.slice(0, 5), [items]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      return;
    }
    const interval = window.setInterval(() => {
      setMobileIndex((current) => (current + 1) % mobileItems.length);
    }, 3000);
    return () => window.clearInterval(interval);
  }, [isMobile, mobileItems.length]);

  useEffect(() => {
    const exitingItems = trail.filter((item) => item.exiting);
    if (!exitingItems.length) {
      return;
    }

    const timeouts = exitingItems.map((item) =>
      window.setTimeout(() => {
        setTrail((current) => current.filter((entry) => entry.id !== item.id));
      }, 320),
    );

    return () => {
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, [trail]);

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    if (isMobile) {
      return;
    }
    const now = performance.now();
    if (now - lastSpawn.current < 90) {
      return;
    }
    lastSpawn.current = now;
    const rect = event.currentTarget.getBoundingClientRect();
    const nextItem: TrailItem = {
      id: idRef.current++,
      left: event.clientX - rect.left - 120,
      top: event.clientY - rect.top - 80,
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

  return (
    <div className="absolute inset-0 overflow-hidden" onMouseMove={onMove}>
      {!isMobile ? (
        <AnimatePresence>
          {trail.map((item, order) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: item.exiting ? 0 : 1, scale: item.exiting ? 0.98 : 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: item.exiting ? 0.3 : 0.2 }}
              className="absolute w-[200px] sm:w-[240px]"
              style={{
                left: item.left,
                top: item.top,
                rotate: `${item.rotation}deg`,
                zIndex: order + 1,
              }}
            >
              <ImagePlaceholder
                index={item.index + 1}
                description={items[item.index]}
                aspectRatio="4 / 3"
                className="shadow-[var(--shadow-soft)]"
                radius="16px"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      ) : (
        mobileItems.map((description, index) => {
            const visible = index === mobileIndex;
            const positions = [
              'left-[8%] top-[18%] w-32',
              'right-[10%] top-[22%] w-28',
              'left-[14%] bottom-[18%] w-24',
              'right-[12%] bottom-[20%] w-32',
              'left-1/2 top-[12%] w-28 -translate-x-1/2',
            ];

            return (
              <motion.div
                key={description}
                animate={{ opacity: visible ? 1 : 0.18 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`absolute ${positions[index]} ambient-dot`}
              >
                <ImagePlaceholder
                  index={index + 1}
                  description={description}
                  aspectRatio={index % 2 === 0 ? '4 / 3' : '1 / 1'}
                  radius="16px"
                  className="shadow-[var(--shadow-soft)]"
                />
              </motion.div>
            );
          })
      )}
    </div>
  );
}
