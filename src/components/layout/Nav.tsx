import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import LogoSvg from '../../img/quietloudlab_logo_undercase.svg?react';

const links = [
  { to: '/work', label: 'Work' },
  { to: '/approach', label: 'Approach' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: "Let's Talk" },
];

const navClass = ({ isActive }: { isActive: boolean }) =>
  `text-[15px] tracking-[-0.02em] transition-all duration-200 ${
    isActive ? 'font-bold text-site-text' : 'font-light text-site-secondary hover:font-medium hover:text-site-text'
  }`;

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 page-shell">
        <div className="grid-shell mt-4 flex items-center justify-between rounded-full border border-site-border/80 bg-white/80 px-5 py-4 backdrop-blur-xl">
          <Link to="/" className="shrink-0" aria-label="quietloudlab home">
            <LogoSvg className="h-5 w-auto text-site-text" />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            className="md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-site-bg/95 px-6 pt-28 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-6">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-4xl tracking-[-0.03em] ${isActive ? 'font-bold' : 'font-light'}`
                  }
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
