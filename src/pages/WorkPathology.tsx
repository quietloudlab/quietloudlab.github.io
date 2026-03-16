import PageWrapper from '../components/layout/PageWrapper';
import PillTag from '../components/ui/PillTag';
import ImagePlaceholder from '../components/ui/ImagePlaceholder';
import Reveal from '../components/ui/Reveal';
import { pathologyCaseStudy } from '../data/content';

export default function WorkPathologyPage() {
  return (
    <PageWrapper>
      <section className="page-shell py-16 md:py-24">
        <div className="grid-shell">
          <Reveal className="grid gap-10 md:grid-cols-12 md:items-start">
            <div className="space-y-6 md:col-span-5">
              <div>
                <p className="text-xl font-medium">{pathologyCaseStudy.title}</p>
                <p className="mt-1 text-sm uppercase tracking-[0.16em] text-site-tertiary">{pathologyCaseStudy.subtitle}</p>
              </div>
              <p className="max-w-md text-xl font-light leading-9 text-site-text">
                {pathologyCaseStudy.summary}
              </p>
              <div className="flex flex-wrap gap-2">
                {pathologyCaseStudy.tags.map((tag) => (
                  <PillTag key={tag}>{tag}</PillTag>
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:col-span-7 md:grid-cols-[1.2fr_0.8fr]">
              <ImagePlaceholder description="Team collaborating at whiteboard during workshop" aspectRatio="4 / 3" radius="16px" />
              <ImagePlaceholder description="Pathology report document with annotations" aspectRatio="3 / 4" radius="16px" className="self-end" />
            </div>
          </Reveal>

          <Reveal className="mx-auto mt-16 max-w-4xl space-y-10">
            {pathologyCaseStudy.narrative.map((item) => (
              <div key={item.title}>
                <h2 className="text-2xl font-bold tracking-[-0.03em]">{item.title}</h2>
                <p className="mt-3 text-lg leading-8 text-site-secondary">{item.body}</p>
              </div>
            ))}
          </Reveal>

          <Reveal className="mt-16 grid gap-3 md:grid-cols-[1.1fr_0.9fr_1fr]">
            <ImagePlaceholder description="Workshop photo — structured exercise with printed flow maps" aspectRatio="4 / 3" radius="12px" />
            <ImagePlaceholder description="Workflow sketch showing returned claims and missing information points" aspectRatio="1 / 1" radius="12px" />
            <ImagePlaceholder description="Service map highlighting human review points and AI assistance moments" aspectRatio="4 / 3" radius="12px" />
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
