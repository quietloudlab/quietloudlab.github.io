type ImagePlaceholderProps = {
  aspectRatio?: string;
  description: string;
  className?: string;
  shape?: 'rectangle' | 'circle';
  radius?: string;
  index?: number;
};

export default function ImagePlaceholder({
  aspectRatio = '4 / 3',
  description,
  className = '',
  shape = 'rectangle',
  radius,
  index,
}: ImagePlaceholderProps) {
  const roundedClass = shape === 'circle' ? 'rounded-full' : '';
  const style = {
    aspectRatio,
    borderRadius: radius ?? undefined,
  };

  return (
    <div
      className={`relative overflow-hidden bg-site-muted ${roundedClass} ${className}`}
      style={style}
      aria-label={description}
      role="img"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.8),_transparent_55%),linear-gradient(135deg,_rgba(26,77,92,0.08),_rgba(255,227,77,0.22))]" />
      <div className="absolute inset-0 p-4 text-site-tertiary">
        {index ? <div className="mb-4 text-xs font-bold">#{index}</div> : null}
        <div className="flex h-full items-center justify-center text-center text-xs font-medium leading-5 sm:text-sm">
          {description}
        </div>
      </div>
    </div>
  );
}
