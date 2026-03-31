import OrganicCollage from '../components/interactive/OrganicCollage';
import PageWrapper from '../components/layout/PageWrapper';
import ImagePlaceholder from '../components/ui/ImagePlaceholder';
import Reveal from '../components/ui/Reveal';
import SectionLabel from '../components/ui/SectionLabel';
import { aboutCollageItems, aboutContent } from '../data/content';

export default function AboutPage() {
  return (
    <PageWrapper>
      <section className="viewport-shell py-[max(7svh,3.5rem)]">
        <div className="canvas-shell">
          <div className="flex min-h-[min(78svh,920px)] flex-col gap-12 xl:flex-row xl:items-end xl:justify-between">
            <Reveal className="min-w-0 flex-[0.95]">
              <SectionLabel>
                <span className="viewport-label">About</span>
              </SectionLabel>
              <h1 className="viewport-display max-w-[11ch] text-balance font-bold text-site-text">
                {aboutContent.title.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="viewport-large-body mt-8 max-w-[16ch] text-site-text">
                quietloudlab is a design and innovation studio focused on making AI systems visible enough for people to align on, govern, and build.
              </p>
            </Reveal>
            <Reveal className="flex min-w-0 flex-[1.05] items-end justify-end">
              <ImagePlaceholder
                description="Brandon facilitating a workshop with participants sketching a shared system map"
                aspectRatio="4 / 3"
                radius="22px"
                className="w-full"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="viewport-shell py-[max(6svh,3rem)]">
        <div className="canvas-shell">
          <Reveal>
            <OrganicCollage items={aboutCollageItems} />
          </Reveal>
        </div>
      </section>

      <section className="page-shell py-10 md:py-16">
        <Reveal className="reading-shell space-y-6">
          {aboutContent.narrative.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-8 text-site-secondary">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </section>

      <section className="page-shell py-12">
        <Reveal className="content-shell">
          <SectionLabel>Background markers</SectionLabel>
          <div className="border-t border-site-border">
            {aboutContent.markers.map(([label, value]) => (
              <div key={label} className="grid gap-2 border-b border-site-border py-4 md:grid-cols-[180px_1fr]">
                <div className="text-sm font-medium uppercase tracking-[0.12em] text-site-tertiary">{label}</div>
                <div className="text-base text-site-text">{value}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="page-shell pb-10 pt-6 md:pb-20">
        <Reveal className="content-shell">
          <SectionLabel>Areas of interest</SectionLabel>
          <p className="text-xl font-light text-site-secondary">
            Innovation · Technology · Creativity · Futures · Entrepreneurship · Design
          </p>
        </Reveal>
      </section>
    </PageWrapper>
  );
}
