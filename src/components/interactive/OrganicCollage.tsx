import ImagePlaceholder from '../ui/ImagePlaceholder';

type CollageItem = {
  description: string;
  aspectRatio: string;
  shape?: 'rectangle' | 'circle';
  className: string;
};

type OrganicCollageProps = {
  items: CollageItem[];
};

export default function OrganicCollage({ items }: OrganicCollageProps) {
  return (
    <>
      <div className="relative hidden min-h-[560px] md:block">
        {items.map((item, index) => (
          <div key={item.description} className={`absolute ${item.className}`}>
            <ImagePlaceholder
              description={item.description}
              aspectRatio={item.aspectRatio}
              shape={item.shape}
              radius={item.shape === 'circle' ? '9999px' : '12px'}
              className={index % 2 === 0 ? 'shadow-[var(--shadow-soft)]' : ''}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 md:hidden">
        {items.map((item) => (
          <ImagePlaceholder
            key={item.description}
            description={item.description}
            aspectRatio={item.aspectRatio}
            shape={item.shape}
            radius={item.shape === 'circle' ? '9999px' : '12px'}
          />
        ))}
      </div>
    </>
  );
}
