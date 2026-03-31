import PageWrapper from '../components/layout/PageWrapper';
import PillTag from '../components/ui/PillTag';
import ImagePlaceholder from '../components/ui/ImagePlaceholder';
import Reveal from '../components/ui/Reveal';
import { loreCaseStudy, workEntries } from '../data/content';

export default function WorkLorePage() {
  const lore = workEntries[0];

  return (
    <PageWrapper>
      <section className="page-shell py-16 md:py-24">
        <div className="grid-shell">
          <Reveal className="grid gap-10 md:grid-cols-12 md:items-start">
            <div className="space-y-6 md:col-span-5">
              <div>
                <p className="text-xl font-medium">{lore.title}</p>
                <p className="mt-1 text-sm uppercase tracking-[0.16em] text-site-tertiary">{lore.subtitle}</p>
              </div>
              <blockquote className="max-w-md text-3xl font-light italic leading-tight text-site-text">
                {loreCaseStudy.quote}
              </blockquote>
              <p className="text-sm font-light text-site-tertiary">{loreCaseStudy.quoteSource}</p>
              <div className="flex flex-wrap gap-2">
                {lore.tags.map((tag) => (
                  <PillTag key={tag}>{tag}</PillTag>
                ))}
              </div>
            </div>
            <div className="md:col-span-7">
              <ImagePlaceholder description="Lore phone mockup showing the trip memory view with the Long Weekend in New York content" aspectRatio="5 / 6" radius="16px" />
            </div>
          </Reveal>

          <Reveal className="mx-auto mt-16 max-w-4xl space-y-10">
            {loreCaseStudy.narrative.map((item) => (
              <div key={item.title}>
                <h2 className="text-2xl font-bold tracking-[-0.03em]">{item.title}</h2>
                <p className="mt-3 text-lg leading-8 text-site-secondary">{item.body}</p>
              </div>
            ))}
          </Reveal>

          <Reveal className="mt-16 grid gap-3 md:grid-cols-[1.1fr_0.8fr_1.2fr_0.9fr]">
            <ImagePlaceholder description="Memory conversation UI screen" aspectRatio="320 / 280" radius="12px" />
            <ImagePlaceholder description="Globe visualization with map pins" aspectRatio="240 / 280" radius="12px" />
            <ImagePlaceholder description="Trip overview memory card" aspectRatio="360 / 280" radius="12px" />
            <ImagePlaceholder description="Workshop output / user flow sketch" aspectRatio="280 / 280" radius="12px" />
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
