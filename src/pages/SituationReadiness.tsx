import { Link } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import ImagePlaceholder from '../components/ui/ImagePlaceholder';
import Reveal from '../components/ui/Reveal';
import YellowTag from '../components/ui/YellowTag';
import { situations } from '../data/content';

export default function SituationReadinessPage() {
  const content = situations.readiness;

  return (
    <PageWrapper>
      <section className="page-shell py-16 md:py-24">
        <div className="grid-shell max-w-5xl">
          <Reveal>
            <h1 className="text-balance text-5xl font-bold leading-[0.96] tracking-[-0.06em] md:text-7xl">
              {content.heroTitle.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-site-secondary">{content.intro}</p>
          </Reveal>
        </div>
      </section>

      <section className="page-shell py-10 md:py-16">
        <Reveal className="grid-shell max-w-4xl">
          <h2 className="text-4xl font-bold tracking-[-0.04em]">{content.rootCauseTitle}</h2>
          <p className="mt-6 text-lg leading-8 text-site-secondary">{content.rootCauseBody}</p>
        </Reveal>
      </section>

      <section className="page-shell py-16 md:py-20">
        <Reveal className="grid-shell grid gap-8 md:grid-cols-12 md:items-start">
          <div className="space-y-8 md:col-span-7">
            <div>
              <YellowTag>Phase 1: See where you are</YellowTag>
              <p className="mt-4 text-lg leading-8 text-site-secondary">
                We map your current operations, identify where AI can genuinely add value, and surface where it can&apos;t or shouldn&apos;t. The output is a clear-eyed assessment — not a sales pitch for AI, but an honest evaluation of fit.
              </p>
            </div>
            <div>
              <YellowTag>Phase 2: Build the plan</YellowTag>
              <p className="mt-4 text-lg leading-8 text-site-secondary">
                Through facilitated sessions with your team, we frame the initiative, prioritize opportunities, design the solution approach, and analyze risks with concrete mitigation strategies. The output is a board-ready roadmap with phases, owners, and decision points.
              </p>
            </div>
            <div>
              <YellowTag>Phase 3: Guide the build</YellowTag>
              <p className="mt-4 text-lg leading-8 text-site-secondary">
                For organizations moving to implementation, we provide ongoing advisory — reviewing technical decisions, maintaining the system map as it evolves, and ensuring the build stays aligned with the governed plan.
              </p>
            </div>
          </div>
          <div className="md:col-span-5">
            <ImagePlaceholder
              description="Workshop photo — small group in a professional setting working through a structured exercise, with printed documents and a whiteboard visible"
              aspectRatio="4 / 5"
              radius="12px"
            />
          </div>
        </Reveal>
      </section>

      <section className="page-shell pb-10 pt-6 md:pb-20">
        <Reveal className="grid-shell max-w-3xl">
          <h2 className="text-4xl font-bold tracking-[-0.04em]">Need to bring something to the table?</h2>
          <p className="mt-5 text-lg leading-8 text-site-secondary">
            We&apos;re happy to have an initial conversation and provide a one-page overview you can share with your leadership or board. No commitment, no jargon, just clarity on what a responsible AI path looks like for your organization.
          </p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 text-site-accent">
            Let&apos;s start the conversation
          </Link>
          <p className="mt-6 text-sm font-light leading-7 text-site-tertiary">
            We also work through established technology consultancies and managed service providers as a specialist partner. If your organization already has an IT partner, we can team with them.
          </p>
        </Reveal>
      </section>
    </PageWrapper>
  );
}
