import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegisterButton } from './ui/Button';
import { useActiveSection } from '../hooks/useActiveSection';

const SECTION_IDS = ['home', 'heritage', 'about', 'challenge', 'details', 'prize', 'registration', 'faq', 'contact'];

const NAV_LINKS = [
  { label: 'HOME',      href: '#home' },
  { label: 'HERITAGE',  href: '#heritage' },
  { label: 'CHALLENGE', href: '#challenge' },
  { label: 'FORMAT',    href: '#details' },
  { label: 'PRIZE',     href: '#prize' },
  { label: 'FAQ',       href: '#faq' },
  { label: 'CONTACT',   href: '#contact' },
];

interface NavbarProps {
  scrolled?: boolean;
}

export default function Navbar({ scrolled: externalScrolled }: NavbarProps) {
  const [internalScrolled, setInternalScrolled] = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const activeSection             = useActiveSection(SECTION_IDS);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const linksRef     = useRef<Map<string, HTMLAnchorElement>>(new Map());

  useEffect(() => {
    const fn = () => setInternalScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const scrolled = externalScrolled ?? internalScrolled;

  // Slide the indicator underline to the active link
  useEffect(() => {
    const activeHref = '#' + activeSection;
    const link = linksRef.current.get(activeHref);
    const indicator = indicatorRef.current;
    if (!link || !indicator) return;
    const nav = link.closest('nav');
    if (!nav) return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    indicator.style.left  = `${linkRect.left - navRect.left}px`;
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.opacity = '1';
  }, [activeSection]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>

      <header
        className="relative w-full transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(5,8,6,0.96)' : 'rgba(5,8,6,0.90)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div
          className="container-site flex items-center justify-between transition-all duration-300"
          style={{
            height: scrolled ? '3.5rem' : '4rem',
          }}
        >

          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-2.5 label-mono hover:text-text transition-colors group"
            style={{ color: 'var(--text-muted)' }}
            data-hover="true"
          >
            <img
              src="/images/vigyantra-logo.png"
              alt="Vigyantra 2026 Emblem"
              className="h-7 sm:h-8 w-auto object-contain select-none group-hover:scale-105 transition-transform"
            />
            <span className="font-grotesk font-bold tracking-tight text-sm sm:text-base text-text">
              VIGYANTRA <span style={{ color: 'var(--primary)' }}>'26</span>
            </span>
          </a>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6 relative" aria-label="Main navigation">
            {/* Sliding active indicator */}
            <div
              ref={indicatorRef}
              className="absolute bottom-0 h-px transition-all duration-300 opacity-0"
              style={{ background: 'var(--primary)', transitionTimingFunction: 'var(--ease)' }}
              aria-hidden="true"
            />
            {NAV_LINKS.map(link => {
              const sectionId = link.href.slice(1);
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  ref={el => { if (el) linksRef.current.set(link.href, el); }}
                  className="label-mono py-1.5 transition-colors duration-150"
                  style={{ color: isActive ? 'var(--text)' : 'var(--text-muted)' }}
                  data-hover="true"
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop register */}
          <div className="hidden md:block">
            <RegisterButton label="REGISTER" className="py-2.5 px-6 text-[0.65rem]" />
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            data-hover="true"
          >
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="block h-px w-5"
                style={{ background: 'var(--text)' }}
                animate={
                  menuOpen
                    ? i === 0 ? { rotate: 45, y: 9 }
                    : i === 1 ? { opacity: 0 }
                    : { rotate: -45, y: -9 }
                    : { rotate: 0, y: 0, opacity: 1 }
                }
                transition={{ duration: 0.2 }}
              />
            ))}
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[70] flex flex-col overflow-y-auto"
            style={{ background: 'rgba(5,8,6,0.98)', backdropFilter: 'blur(20px)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="absolute inset-0 coord-grid opacity-20 pointer-events-none" />

            {/* Mobile menu header */}
            <div className="container-site flex items-center justify-between py-5 border-b border-white/[0.08] relative z-10">
              <div className="flex items-center gap-2">
                <img
                  src="/images/vigyantra-logo.png"
                  alt="Vigyantra Logo"
                  className="h-7 w-auto object-contain"
                />
                <span className="font-grotesk font-bold text-sm text-text">
                  VIGYANTRA <span style={{ color: 'var(--primary)' }}>'26</span>
                </span>
              </div>
              <button
                onClick={close}
                className="p-2.5 rounded-[2px] border border-white/15 text-white/70 hover:text-white label-mono text-xs flex items-center gap-1.5"
                aria-label="Close menu"
              >
                <span>CLOSE</span>
                <span className="text-sm font-bold">✕</span>
              </button>
            </div>

            <div className="container-site relative z-10 flex flex-col gap-6 py-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.045, duration: 0.3 }}
                  className="font-grotesk font-semibold flex items-baseline justify-between py-2 border-b border-white/[0.04]"
                  style={{
                    fontSize: 'clamp(1.5rem, 5.5vw, 2.25rem)',
                    color: 'var(--text)',
                    textDecoration: 'none',
                  }}
                  data-hover="true"
                >
                  <span>{link.label}</span>
                  <span className="label-mono text-xs opacity-35">0{i + 1}</span>
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-4 pt-4"
              >
                <RegisterButton label="REGISTER NOW" className="w-full justify-center py-3.5" />
              </motion.div>
            </div>

            <div className="container-site relative z-10 mt-auto py-6 border-t border-white/[0.06]">
              <span className="label-mono text-[9.5px] opacity-35 block text-center">
                SJB INSTITUTE OF TECHNOLOGY · 30 OCTOBER 2026
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sticky bottom register bar */}
      <div className="mobile-register-bar">
        <RegisterButton label="REGISTER NOW" className="flex-1 justify-center" />
      </div>
    </>
  );
}
