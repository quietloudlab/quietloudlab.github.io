import { useInView } from 'framer-motion';
import { RefObject } from 'react';

export function useInViewOnce(ref: RefObject<Element | null>) {
  return useInView(ref, { once: true, margin: '-10% 0px -10% 0px' });
}
