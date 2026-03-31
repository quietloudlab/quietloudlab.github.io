import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';

export default function PageWrapper({ children }: PropsWithChildren) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="pt-24"
    >
      {children}
    </motion.main>
  );
}
