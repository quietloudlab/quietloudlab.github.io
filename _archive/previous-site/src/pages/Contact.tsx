import { ArrowRight } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Reveal from '../components/ui/Reveal';

export default function ContactPage() {
  return (
    <PageWrapper>
      <section className="page-shell py-16 md:py-24">
        <div className="grid-shell max-w-5xl">
          <Reveal>
            <h1 className="text-5xl font-bold tracking-[-0.06em] md:text-7xl">Let&apos;s talk.</h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-site-secondary">
              Whether you have a specific situation in mind or you&apos;re just figuring out where to start, a conversation is the right first step. No pitch, no pressure — just clarity on whether we can help.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="page-shell py-10 md:py-16">
        <Reveal className="grid-shell grid gap-8 md:grid-cols-2">
          <div className="border border-site-border bg-white p-8">
            <h2 className="text-3xl font-bold tracking-[-0.04em]">Schedule a conversation</h2>
            <p className="mt-4 text-lg leading-8 text-site-secondary">
              Book 30 minutes to talk through your situation.
            </p>
            <a
              href="https://calendly.com/brandonaharwood/quietloudchat"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 bg-site-text px-5 py-4 text-sm font-medium uppercase tracking-[0.08em] text-white transition hover:bg-site-accent"
            >
              Open Calendly
              <ArrowRight size={16} />
            </a>
          </div>
          <div className="border border-site-border bg-white p-8">
            <h2 className="text-3xl font-bold tracking-[-0.04em]">Send a note</h2>
            <p className="mt-4 text-lg leading-8 text-site-secondary">
              If you&apos;d rather start with context, write to us and we&apos;ll respond within two business days.
            </p>
            <form action="https://submit-form.com/gpAWtEfDu" method="POST" className="mt-8 space-y-4">
              <input type="text" name="name" required placeholder="Name" className="w-full border border-site-border px-4 py-4 outline-none transition focus:border-site-accent" />
              <input type="email" name="email" required placeholder="Email" className="w-full border border-site-border px-4 py-4 outline-none transition focus:border-site-accent" />
              <textarea name="message" required placeholder="Message" rows={6} className="w-full border border-site-border px-4 py-4 outline-none transition focus:border-site-accent" />
              <button type="submit" className="bg-site-text px-5 py-4 text-sm font-medium uppercase tracking-[0.08em] text-white transition hover:bg-site-accent">
                Send message
              </button>
            </form>
          </div>
        </Reveal>
      </section>

      <section className="page-shell pb-10 pt-6 md:pb-20">
        <Reveal className="grid-shell max-w-4xl text-sm font-light leading-7 text-site-tertiary">
          <p>brandon@quietloudlab.com</p>
          <p>quietloudlab.com</p>
          <p>Dallas, Texas · Amsterdam, 2026</p>
        </Reveal>
      </section>
    </PageWrapper>
  );
}
