import { animate, motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

type ScatterplotRevealProps = {
  text: string;
  className?: string;
};

export default function ScatterplotReveal({ text, className = '' }: ScatterplotRevealProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLParagraphElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const rand = useMotionValue(reduceMotion ? 0 : 1000);
  const variation = useMotionTemplate`"RAND" ${rand}, "wght" 700`;

  useEffect(() => {
    if (reduceMotion || !inView) {
      rand.set(0);
      return;
    }

    const controls = animate(rand, 0, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => controls.stop();
  }, [inView, rand, reduceMotion]);

  return (
    <motion.p
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0.2 }}
      whileInView={reduceMotion ? undefined : { opacity: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className={`scatterplot text-balance ${className}`}
      style={{
        fontVariationSettings: variation,
      }}
    >
      {text}
    </motion.p>
  );
}
