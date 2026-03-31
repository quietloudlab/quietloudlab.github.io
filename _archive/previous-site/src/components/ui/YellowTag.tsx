import { PropsWithChildren } from 'react';

export default function YellowTag({ children }: PropsWithChildren) {
  return (
    <span className="inline-block bg-site-highlight px-2 py-1 text-[13px] font-medium tracking-[0.04em] text-site-text">
      {children}
    </span>
  );
}
