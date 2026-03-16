import { PropsWithChildren } from 'react';

export default function SectionLabel({ children }: PropsWithChildren) {
  return (
    <p className="mb-5 font-medium tracking-[0.04em] text-site-tertiary" style={{ fontSize: 'clamp(1.08rem, min(1.7vw, 2.2svh), 1.92rem)', lineHeight: 1.14 }}>
      {children}
    </p>
  );
}
