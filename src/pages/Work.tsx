import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import PillTag from '../components/ui/PillTag';
import ImagePlaceholder from '../components/ui/ImagePlaceholder';
import Reveal from '../components/ui/Reveal';
import { workEntries } from '../data/content';

export default function WorkPage() {
  return (
    <PageWrapper>
      <section className="page-shell py-16 md:py-24">
        <div className="grid-shell">
          <Reveal className="max-w-4xl">
            <h1 className="text-5xl font-bold tracking-[-0.06em] md:text-7xl">Selected work.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-site-secondary">
              Projects that show how the methodology works in practice — from early-stage product design to enterprise systems strategy.
            </p>
          </Reveal>
          <div className="mt-16 space-y-24">
            {workEntries.map((entry, index) => {
              const reverse = index % 2 === 1;
              const isLinked = Boolean(entry.to);

              return (
                <Reveal key={entry.title} className={`grid gap-8 md:grid-cols-12 md:items-center ${reverse ? '' : ''}`}>
                  <div className={`space-y-4 ${reverse ? 'md:col-span-5 md:order-1' : 'md:col-span-5'}`}>
                    <p className="text-sm font-medium uppercase tracking-[0.16em] text-site-tertiary">{entry.subtitle}</p>
                    <h2 className="text-4xl font-bold tracking-[-0.04em]">{entry.title}</h2>
                    <p className="text-lg leading-8 text-site-secondary">{entry.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <PillTag key={tag}>{tag}</PillTag>
                      ))}
                    </div>
                    {isLinked ? (
                      <Link to={entry.to!} className="inline-flex items-center gap-2 text-site-accent">
                        Read the case study
                        <ArrowRight size={18} />
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-site-tertiary">Case study coming soon</span>
                    )}
                  </div>
                  <div className={`grid gap-4 ${reverse ? 'md:col-span-7 md:order-0' : 'md:col-span-7'}`}>
                    <div className="grid gap-4 md:grid-cols-[1.4fr_0.8fr]">
                      <ImagePlaceholder description={entry.primaryImage} aspectRatio="4 / 3" radius="12px" className="transition duration-300 hover:scale-[1.02]" />
                      <ImagePlaceholder description={entry.secondaryImage} aspectRatio={reverse ? '3 / 4' : '4 / 3'} radius="12px" className="self-end transition duration-300 hover:scale-[1.02]" />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
