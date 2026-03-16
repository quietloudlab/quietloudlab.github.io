import { PropsWithChildren } from 'react';

export default function PillTag({ children }: PropsWithChildren) {
  return (
    <span className="rounded-full border border-site-border bg-white px-3 py-1 text-[13px] font-medium text-site-text">
      {children}
    </span>
  );
}
