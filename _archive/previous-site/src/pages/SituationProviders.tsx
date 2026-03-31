import { Link } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import ImagePlaceholder from '../components/ui/ImagePlaceholder';
import Reveal from '../components/ui/Reveal';
import YellowTag from '../components/ui/YellowTag';
import { situations } from '../data/content';

export default function SituationProvidersPage() {
  const content = situations.providers;

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
              <YellowTag>What we build together</YellowTag>
              <p className="mt-4 text-lg leading-8 text-site-secondary">
                We take your existing technical capability and wrap it in an experience that shows a non-technical enterprise buyer exactly what it does for their business. Not a slide deck. Not a redesigned website. A working demo they can experience.
              </p>
              <p className="mt-4 text-lg leading-8 text-site-secondary">
                Your prospect sees &ldquo;here&apos;s what your customer service operation looks like with our system running&rdquo; instead of &ldquo;here&apos;s how our vector database indexes your knowledge base.&rdquo; The prototype becomes a reusable asset for trade shows, investor meetings, and sales conversations after.
              </p>
              <div className="mt-4">
                <YellowTag>Timeline: 2 – 4 weeks</YellowTag>
              </div>
            </div>
            <div>
              <YellowTag>What we run together</YellowTag>
              <p className="mt-4 text-lg leading-8 text-site-secondary">
                When your enterprise client is interested but not committed, we co-facilitate the sessions that move them from &ldquo;that&apos;s interesting&rdquo; to &ldquo;here&apos;s the budget.&rdquo; Your team brings the technical architecture. We bring the facilitation methodology that surfaces the business case, aligns their stakeholders, and drives toward a scoped engagement.
              </p>
              <p className="mt-4 text-lg leading-8 text-site-secondary">
                This becomes part of how your agency wins and delivers — a repeatable methodology you can deploy across your client base.
              </p>
              <div className="mt-4">
                <YellowTag>Ongoing partnership</YellowTag>
              </div>
            </div>
          </div>
          <div className="md:col-span-5">
            <ImagePlaceholder
              description="Before/after — left side shows a technical architecture diagram dense with jargon; right side shows the same capability as an interactive business-context demo"
              aspectRatio="4 / 5"
              radius="12px"
            />
          </div>
        </Reveal>
      </section>

      <section className="page-shell pb-10 pt-6 md:pb-20">
        <Reveal className="grid-shell max-w-3xl">
          <h2 className="text-4xl font-bold tracking-[-0.04em]">Curious what this looks like for your stack?</h2>
          <p className="mt-5 text-lg leading-8 text-site-secondary">
            The fastest way to see if this fits is a conversation. Bring your current sales deck — we&apos;ll show you exactly where the enterprise buyer is getting lost.
          </p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 text-site-accent">
            Let&apos;s look at it together
          </Link>
        </Reveal>
      </section>
    </PageWrapper>
  );
}
