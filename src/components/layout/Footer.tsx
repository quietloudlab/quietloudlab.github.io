import { ArrowRight } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoSvg from '../../img/quietloudlab_logo_undercase.svg?react';

const pageLinks = [
  { to: '/work', label: 'Work' },
  { to: '/approach', label: 'Approach' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const externalLinks = [
  { href: 'https://ai-interaction.com', label: 'AI Interaction Atlas' },
  { href: 'https://studio.ai-interaction.com', label: 'AI Interaction Studio' },
  { href: 'https://www.linkedin.com/in/brandonharwood/', label: 'LinkedIn' },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  const submit = (event: FormEvent) => {
    if (!email) {
      event.preventDefault();
    }
  };

  return (
    <footer className="page-shell pb-10 pt-24">
      <div className="grid-shell section-rule pt-10">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-4">
            <LogoSvg className="h-5 w-auto text-site-text" />
            <p className="max-w-xs text-base font-normal leading-7 text-site-secondary">
              Making AI systems legible.
            </p>
            <p className="text-sm font-light text-site-tertiary">Dallas, Texas · Moving to Amsterdam, 2026</p>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-site-tertiary">Pages</p>
            {pageLinks.map((link) => (
              <Link key={link.to} to={link.to} className="block text-base text-site-secondary transition hover:text-site-accent">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-site-tertiary">Elsewhere</p>
            {externalLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="block text-base text-site-secondary transition hover:text-site-accent">
                {link.label}
              </a>
            ))}
            <form
              action="https://submit-form.com/buMSWec82"
              method="POST"
              onSubmit={submit}
              className="pt-4"
            >
              <label className="mb-3 block text-sm font-medium uppercase tracking-[0.16em] text-site-tertiary">
                Dispatch newsletter
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  className="min-w-0 flex-1 rounded-none border border-site-border bg-white px-4 py-3 text-base outline-none transition focus:border-site-accent"
                  required
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-site-text px-4 py-3 text-sm font-medium text-white transition hover:bg-site-accent"
                >
                  Subscribe
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-10 border-t border-site-border pt-4 text-sm font-light text-site-tertiary">
          © 2026 quietloudlab LLC
        </div>
      </div>
    </footer>
  );
}
