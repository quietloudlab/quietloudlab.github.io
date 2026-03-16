import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import ImagePlaceholder from '../components/ui/ImagePlaceholder';
import Reveal from '../components/ui/Reveal';
import SectionLabel from '../components/ui/SectionLabel';
import YellowTag from '../components/ui/YellowTag';
import { approachContent } from '../data/content';

export default function ApproachPage() {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <PageWrapper>
      <section className="viewport-shell py-[max(7svh,3.5rem)]">
        <div className="canvas-shell">
          <Reveal>
            <h1 className="viewport-display max-w-[12ch] text-balance font-bold text-site-text">
              {approachContent.heroTitle.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="viewport-body mt-8 max-w-[44rem] text-site-secondary">{approachContent.intro}</p>
          </Reveal>
        </div>
      </section>

      <section className="viewport-shell py-[max(6svh,3rem)]">
        <div className="rounded-[28px] bg-site-muted px-[var(--space-fluid-x)] py-[max(4svh,2.25rem)]">
          <div className="flex min-h-[min(88svh,1120px)] flex-col gap-10 xl:flex-row xl:items-stretch">
            <Reveal className="flex min-w-0 flex-[0.95] flex-col justify-start space-y-2">
              {approachContent.phases.map((phase, index) => (
                <button
                  key={phase.title}
                  type="button"
                  onMouseEnter={() => setActivePhase(index)}
                  onFocus={() => setActivePhase(index)}
                  onClick={() => setActivePhase(index)}
                  className={`block text-left leading-[0.9] tracking-[-0.07em] transition ${
                    activePhase === index ? 'font-bold text-site-text' : 'font-light text-site-tertiary'
                  }`}
                  style={{ fontSize: 'clamp(4rem, min(6.5vw, 9svh), 8rem)' }}
                >
                  {phase.title}
                </button>
              ))}
            </Reveal>
            <Reveal className="flex min-w-0 flex-[1.2] flex-col justify-center space-y-8 xl:pt-[min(4svh,2rem)]">
              <div>
                <YellowTag>Problem</YellowTag>
                <p className="mt-4 max-w-[24ch] text-site-secondary" style={{ fontSize: 'clamp(1.6rem, min(2.7vw, 3.5svh), 3rem)', lineHeight: 1.14, letterSpacing: '-0.03em' }}>
                  {approachContent.phases[activePhase].problem}
                </p>
              </div>
              <div>
                <YellowTag>What we&apos;ll do</YellowTag>
                <p className="mt-4 max-w-[24ch] text-site-secondary" style={{ fontSize: 'clamp(1.6rem, min(2.7vw, 3.5svh), 3rem)', lineHeight: 1.14, letterSpacing: '-0.03em' }}>
                  {approachContent.phases[activePhase].action}
                </p>
              </div>
              <div>
                <YellowTag>Outcome</YellowTag>
                <p className="mt-4 max-w-[24ch] text-site-secondary" style={{ fontSize: 'clamp(1.6rem, min(2.7vw, 3.5svh), 3rem)', lineHeight: 1.14, letterSpacing: '-0.03em' }}>
                  {approachContent.phases[activePhase].outcome}
                </p>
              </div>
            </Reveal>
            <Reveal className="flex min-w-0 flex-[0.8] flex-col justify-between gap-8 xl:pt-[min(4svh,2rem)]">
              <div>
                <div className="mb-6 inline-block">
                  <YellowTag>{homeTimeline(activePhase)}</YellowTag>
                </div>
                <p className="text-lg font-medium text-site-text">Typical engagements</p>
                <div className="mt-5 space-y-5 text-base leading-7 text-site-secondary">
                  {phaseEngagements[activePhase].map(([title, body]) => (
                    <div key={title}>
                      <p className="font-medium text-site-text">{title}</p>
                      <p>{body}</p>
                    </div>
                  ))}
                </div>
              </div>
              <ImagePlaceholder
                description={phaseImages[activePhase]}
                aspectRatio={activePhase === 1 ? '1 / 1' : '4 / 5'}
                radius="28px"
                className="w-full"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="page-shell py-20">
        <div className="content-shell space-y-12">
          {approachContent.phases.map((phase) => (
            <Reveal key={phase.title} className="grid gap-8 border-b border-site-border pb-10 md:grid-cols-12">
              <div className="md:col-span-3">
                <h3 className="text-4xl font-bold tracking-[-0.04em]">{phase.title}</h3>
              </div>
              <div className="space-y-5 md:col-span-9">
                <div>
                  <YellowTag>Problem</YellowTag>
                  <p className="mt-3 text-lg leading-8 text-site-secondary">{phase.problem}</p>
                </div>
                <div>
                  <YellowTag>What we&apos;ll do</YellowTag>
                  <p className="mt-3 text-lg leading-8 text-site-secondary">{phase.action}</p>
                </div>
                <div>
                  <YellowTag>Outcome</YellowTag>
                  <p className="mt-3 text-lg leading-8 text-site-secondary">{phase.outcome}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="viewport-shell py-[max(7svh,3.5rem)]">
        <Reveal className="viewport-grid md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <SectionLabel>Built on an open-source foundation.</SectionLabel>
            <p className="text-lg leading-8 text-site-secondary">
              The AI Interaction Atlas is an open-source framework for mapping how AI systems actually behave — what they infer, generate, surface, and defer. It is the design infrastructure behind every engagement we run.
            </p>
            <a href="https://ai-interaction.com" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-site-accent">
              Explore the Atlas
              <ArrowRight size={18} />
            </a>
            <p className="mt-10 text-lg leading-8 text-site-secondary">
              AI Interaction Studio is the Atlas made operational — a canvas-based tool for mapping AI interaction models across a full product. Teams use it to document living architecture rather than static specs.
            </p>
            <a href="https://studio.ai-interaction.com" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-site-accent">
              Try Studio
              <ArrowRight size={18} />
            </a>
          </div>
          <ImagePlaceholder
            description="Studio canvas screenshot — showing a complete mapped system with the sidebar panel visible, demonstrating the tool's interface"
            aspectRatio="4 / 3"
            radius="14px"
          />
        </Reveal>
      </section>

      <section className="page-shell pb-12 pt-12 md:pb-20">
        <Reveal className="reading-shell">
          <SectionLabel>Research & publications</SectionLabel>
          <p className="text-lg leading-8 text-site-secondary">
            This practice is grounded in published HCI research on human-AI co-creativity and a decade of applied work at IBM Innovation Studio. The methodology isn&apos;t theoretical — it was developed through hundreds of facilitated engagements with enterprise teams building AI systems.
          </p>
          <p className="mt-6 text-lg leading-8 text-site-text">
            Harwood, B. (2023). Human-AI co-creativity research. Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems.
          </p>
          <a href="https://dl.acm.org" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-site-accent">
            Read the paper
            <ArrowRight size={18} />
          </a>
        </Reveal>
      </section>
    </PageWrapper>
  );
}

const phaseTimelines = ['Timeline: 3 - 10 days', 'Timeline: 4 - 6 weeks', 'Timeline: 2 - 4 weeks'];

const phaseImages = [
  'Workshop photo — teams mapping opportunities and AI fit on large-format paper',
  'Studio screenshot — mapped system architecture and interaction model on a dark canvas',
  'Prototype mockup — high-fidelity product interface tested with users',
];

const phaseEngagements = [
  [
    ['AI Opportunity Discovery', 'Identify which problems AI is particularly well-suited to solve, and which are not.'],
    ['AI Interaction Exploration', 'Define the core purpose, functionality, and interaction model of your AI solution.'],
    ['Innovation Workshops', 'Quickly align the team on what needs to be built, why, and how.'],
  ],
  [
    ['System & Architecture Mapping', 'Define the layer beneath the interaction: data flows, model constraints, and system logic.'],
    ['Human-AI Workflow Design', 'Map exactly how the human and the intelligent system will collaborate step-by-step.'],
    ['Structural Concept Design', 'Build the structural and interaction models that prove the logic of the system holds up against human context and complexity.'],
  ],
  [
    ['Experiential Prototyping', 'Build interactive, testable interfaces that realistically simulate the AI experience.'],
    ['Behavioral Testing', 'Put the prototype in front of humans to validate the interaction and uncover friction points early.'],
    ['Executive Show-and-Tell', 'Create high-impact visual artifacts informed by users designed specifically to secure internal alignment and funding.'],
  ],
];

function homeTimeline(activePhase: number) {
  return phaseTimelines[activePhase];
}
