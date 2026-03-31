import { motion } from 'framer-motion';
import { PropsWithChildren, useRef } from 'react';
import { useInViewOnce } from '../../hooks/useInViewOnce';

type RevealProps = PropsWithChildren<{
  className?: string;
  delay?: number;
}>;

export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInViewOnce(ref);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
