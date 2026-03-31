import { ArrowDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MouseTrailHero from '../components/interactive/MouseTrailHero';
import OrganicCollage from '../components/interactive/OrganicCollage';
import ScatterplotReveal from '../components/interactive/ScatterplotReveal';
import StickyPhaseShowcase from '../components/interactive/StickyPhaseShowcase';
import PageWrapper from '../components/layout/PageWrapper';
import ImagePlaceholder from '../components/ui/ImagePlaceholder';
import Reveal from '../components/ui/Reveal';
import SectionLabel from '../components/ui/SectionLabel';
import YellowTag from '../components/ui/YellowTag';
import { collageItems, heroTrailImages, homeContent } from '../data/content';

function ScenarioCard({
  tag,
  title,
  body,
  cta,
  to,
  image,
}: (typeof homeContent.scenarios)[number]) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden border border-site-border bg-white p-6 transition duration-300 hover:border-site-accent"
    >
      <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <ImagePlaceholder description={image} aspectRatio="16 / 9" className="h-full w-full opacity-20" />
      </div>
      <div className="relative z-10">
        <YellowTag>{tag}</YellowTag>
        <h3 className="mt-5 max-w-sm text-2xl font-bold tracking-[-0.03em]">{title}</h3>
        <p className="mt-4 max-w-md text-lg leading-8 text-site-secondary">{body}</p>
        <div className="mt-8 inline-flex items-center gap-2 text-base text-site-accent">
          {cta}
          <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <PageWrapper>
      <section className="viewport-shell relative min-h-screen overflow-hidden bg-[#f7f7f5] pt-28 text-center">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.25),transparent_30%,rgba(240,240,240,0.45))]" />
        <div className="canvas-shell relative flex min-h-[calc(100svh-7rem)] items-center justify-center">
          <MouseTrailHero items={heroTrailImages} />
          <div className="relative z-10 max-w-5xl">
            <ScatterplotReveal text={homeContent.hero.scatter} className="mb-6 text-4xl font-bold lowercase text-site-accent sm:text-5xl" />
            <h1 className="viewport-display text-balance font-bold text-site-text">
              {homeContent.hero.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <div className="mt-10 inline-flex flex-col items-center gap-3 text-site-tertiary">
              <span className="h-10 w-px bg-site-border" />
              <ArrowDown size={18} />
            </div>
          </div>
        </div>
      </section>

      <section className="viewport-shell py-[max(8svh,4rem)]">
        <Reveal className="viewport-block viewport-grid items-end lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex min-w-0 flex-col justify-between">
            <SectionLabel>
              <span className="viewport-label">The studio</span>
            </SectionLabel>
            <p className="viewport-heading no-max text-balance font-normal text-site-text">
              quietloudlab makes AI systems legible.
            </p>
            <p className="viewport-body mt-8 max-w-[38rem] text-site-secondary">
              {homeContent.intro}
            </p>
          </div>
          <div className="flex min-w-0 items-end justify-end">
            <ImagePlaceholder
              description="Workshop photo — team collaborating around whiteboard with sticky notes and system maps"
              aspectRatio="4 / 3"
              radius="18px"
              className="w-full"
            />
          </div>
        </Reveal>
      </section>

      <section className="viewport-shell py-[max(7svh,3.5rem)]">
        <Reveal className="viewport-grid items-start xl:grid-cols-[1.08fr_0.92fr]">
          <div className="min-w-0">
            <SectionLabel>
              <span className="viewport-label">{homeContent.problem.label}</span>
            </SectionLabel>
            <h2 className="viewport-heading no-max text-balance font-bold text-site-text">
              {homeContent.problem.heading}
            </h2>
            <div className="viewport-body mt-10 max-w-[40rem] space-y-6 text-site-secondary">
              {homeContent.problem.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="flex min-w-0 items-end xl:min-h-[62svh]">
            <ImagePlaceholder
              description="Split view — left side shows a messy whiteboard or abstract diagram representing the current state; right side shows a clean Studio canvas representing the mapped system"
              aspectRatio="5 / 4"
              radius="18px"
              className="w-full"
            />
          </div>
        </Reveal>
      </section>

      <section className="page-shell py-24">
        <div className="content-shell">
          <Reveal>
            <SectionLabel>Sound familiar?</SectionLabel>
            <div className="grid gap-6 lg:grid-cols-3">
              {homeContent.scenarios.map((scenario, index) => (
                <Reveal key={scenario.to} delay={index * 0.05}>
                  <ScenarioCard {...scenario} />
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="page-shell py-24">
        <div className="wide-shell">
          <Reveal>
            <OrganicCollage items={collageItems} />
            <p className="mt-8 max-w-xl text-base leading-7 text-site-secondary">
              <a href="https://ai-interaction.com" target="_blank" rel="noreferrer" className="transition hover:text-site-accent">
                {homeContent.proofNote}
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="viewport-shell py-[max(8svh,4rem)]">
        <Reveal className="viewport-grid">
          <StickyPhaseShowcase phases={homeContent.methodologyShowcase} />
          <Link to="/approach" className="mt-10 inline-flex items-center gap-2 text-lg text-site-accent">
            See our full approach
            <ArrowRight size={18} />
          </Link>
        </Reveal>
      </section>

      <section className="viewport-shell pb-[max(8svh,4rem)] pt-[max(6svh,3rem)]">
        <Reveal className="viewport-grid min-h-[min(58svh,760px)] content-end">
          <SectionLabel>
            <span className="viewport-label">The Dispatch</span>
          </SectionLabel>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="viewport-heading max-w-[12ch] font-bold text-site-text">
                Occasional notes on systems, futures, and the lab&apos;s work.
              </h2>
              <p className="viewport-body mt-4 max-w-xl text-site-secondary">
                No spam, just signal.
              </p>
            </div>
            <form action="https://submit-form.com/buMSWec82" method="POST" className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row lg:max-w-[42rem] lg:justify-end">
              <input
                type="email"
                name="email"
                required
                placeholder="Email address"
                className="min-w-0 flex-1 border border-site-border bg-white px-4 py-4 text-base outline-none transition focus:border-site-accent"
              />
              <button type="submit" className="bg-site-text px-6 py-4 text-sm font-medium uppercase tracking-[0.08em] text-white transition hover:bg-site-accent">
                Subscribe
              </button>
            </form>
          </div>
        </Reveal>
      </section>
    </PageWrapper>
  );
}
