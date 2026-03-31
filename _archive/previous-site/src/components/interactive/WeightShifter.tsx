import { motion } from 'framer-motion';
import { useState } from 'react';

type WeightItem = {
  title: string;
  description: string;
  timeline: string;
};

type WeightShifterProps = {
  items: WeightItem[];
};

export default function WeightShifter({ items }: WeightShifterProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex min-w-0 flex-col">
      {items.map((item, index) => {
        const isActive = index === active;

        return (
          <div
            key={item.title}
            onMouseEnter={() => setActive(index)}
            className="cursor-default border-b border-site-border py-6 last:border-b-0"
          >
            <motion.h3
              animate={{
                color: isActive ? '#111111' : '#9a9a9a',
                opacity: isActive ? 1 : 0.85,
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`text-left leading-[0.92] tracking-[-0.07em] ${isActive ? 'font-bold' : 'font-light'}`}
              style={{ fontSize: 'clamp(3.75rem, 8vw, 7.5rem)' }}
            >
              {item.title}
            </motion.h3>
            <motion.div
              initial={false}
              animate={{ opacity: isActive ? 1 : 0.55 }}
              transition={{ duration: 0.3 }}
              className="mt-4 max-w-[42rem]"
            >
              <p className="text-site-secondary" style={{ fontSize: 'clamp(1.125rem, 1.4vw, 1.5rem)', lineHeight: 1.35 }}>
                {item.description}
              </p>
              <p
                className="mt-3 font-light uppercase tracking-[0.16em] text-site-tertiary"
                style={{ fontSize: 'clamp(0.75rem, 0.8vw, 0.95rem)' }}
              >
                {item.timeline}
              </p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
