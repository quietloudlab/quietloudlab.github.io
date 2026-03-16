import { Link } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import ImagePlaceholder from '../components/ui/ImagePlaceholder';
import Reveal from '../components/ui/Reveal';
import YellowTag from '../components/ui/YellowTag';
import { situations } from '../data/content';

export default function SituationHangoverPage() {
  const content = situations.hangover;

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
            <div className="mt-8 max-w-3xl space-y-6 text-lg leading-8 text-site-secondary">
              {content.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="page-shell py-10 md:py-16">
        <Reveal className="grid-shell grid gap-8 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <h2 className="text-4xl font-bold tracking-[-0.04em]">{content.rootCauseTitle}</h2>
            <p className="mt-6 text-lg leading-8 text-site-secondary">{content.rootCauseBody}</p>
          </div>
          <div className="md:col-span-5">
            <ImagePlaceholder
              description="Split view — left side shows a messy whiteboard or abstract diagram representing the current state; right side shows a clean Studio canvas representing the mapped system"
              aspectRatio="4 / 5"
              radius="12px"
            />
          </div>
        </Reveal>
      </section>

      <section className="page-shell py-16 md:py-24">
        <div className="grid-shell space-y-12">
          {content.offers.map((offer) => (
            <Reveal key={offer.title} className="grid gap-8 border-b border-site-border pb-12 md:grid-cols-12">
              <div className="md:col-span-2">
                <div className="space-y-1 text-5xl tracking-[-0.05em]">
                  {['See', 'Align', 'Build'].map((word) => (
                    <div key={word} className={word === offer.kicker ? 'font-bold text-site-text' : 'font-light text-site-tertiary'}>
                      {word}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-5 md:col-span-6">
                <h3 className="text-3xl font-bold tracking-[-0.04em]">{offer.title}</h3>
                <div>
                  <YellowTag>Problem</YellowTag>
                  <p className="mt-3 text-lg leading-8 text-site-secondary">{offer.problem}</p>
                </div>
                <div>
                  <YellowTag>What we&apos;ll do</YellowTag>
                  <p className="mt-3 text-lg leading-8 text-site-secondary">{offer.action}</p>
                </div>
                <div>
                  <YellowTag>Outcome</YellowTag>
                  <p className="mt-3 text-lg leading-8 text-site-secondary">{offer.outcome}</p>
                </div>
                <YellowTag>{offer.timeline}</YellowTag>
              </div>
              <div className="space-y-5 md:col-span-4">
                <div className="space-y-4">
                  {offer.engagements.map(([title, description]) => (
                    <div key={title}>
                      <h4 className="text-base font-medium">{title}</h4>
                      <p className="mt-1 text-base leading-7 text-site-secondary">{description}</p>
                    </div>
                  ))}
                </div>
                <ImagePlaceholder description={offer.image} aspectRatio="4 / 3" radius="12px" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="page-shell pb-10 pt-6 md:pb-20">
        <Reveal className="grid-shell max-w-3xl">
          <h2 className="text-4xl font-bold tracking-[-0.04em]">If this sounds like where you are, let&apos;s talk.</h2>
          <p className="mt-5 text-lg leading-8 text-site-secondary">{content.cta}</p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 text-site-accent">
            Schedule a conversation
          </Link>
        </Reveal>
      </section>
    </PageWrapper>
  );
}
