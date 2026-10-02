import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import NetworkBackground from './NetworkBackground';
import { RegisterButton } from './ui/Button';
import Button from './ui/Button';
import { RevealLine } from './ui/Reveal';
import HeroAmbientNodes from './HeroAmbientNodes';
import { EVENT_CONFIG } from '../data/eventConfig';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const opacity  = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Network canvas */}
      <NetworkBackground className="opacity-60" />

      {/* Radial green glow — hero only, max 8% */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(0,230,118,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none z-[2]"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--bg))' }}
        aria-hidden="true"
      />

      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 container-site pt-12 md:pt-16 pb-16 w-full"
      >
        {/* Top neat telemetry coordinate strip — covers space neatly */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-5 pb-3 flex flex-wrap items-center gap-x-6 gap-y-1.5"
          style={{ borderBottom: '1px solid rgba(242, 245, 243, 0.06)' }}
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="label-mono text-[9.5px] tracking-[0.2em] text-primary/80">
              SYS.ACTIVE // SECTOR 07
            </span>
          </div>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="label-mono text-[9px] tracking-[0.16em] opacity-45">
            BANGALORE · 12.9716° N, 77.5946° E
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="label-mono text-[9px] tracking-[0.16em] text-white/60">
            FLAGSHIP TECHNICAL CHALLENGE
          </span>
        </motion.div>

        {/* College + fest + Subtle Ambient Animation in freed space */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 md:mb-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="space-y-1.5">
            <span className="label-mono block" style={{ letterSpacing: '0.16em' }}>
              {EVENT_CONFIG.college}
            </span>
            <div className="flex items-center gap-3">
              <div className="w-8 h-px" style={{ background: 'var(--line-strong)' }} />
              <span className="label-mono font-semibold" style={{ color: 'var(--primary)', opacity: 0.9 }}>
                {EVENT_CONFIG.techFest} · SILVER JUBILEE EDITION
              </span>
            </div>
          </div>

          {/* Ambient subtle nodes animation in freed space */}
          <div className="hidden sm:block">
            <HeroAmbientNodes />
          </div>
        </motion.div>

        {/* Main title — immediate dynamic entrance animation */}
        <h1 aria-label="Hack and Hunt" className="font-grotesk font-bold leading-none tracking-tight mb-6 md:mb-8"
          style={{ letterSpacing: '-0.03em' }}>
          <RevealLine delay={0.08}>
            <span className="block text-hero" style={{ color: 'var(--text)' }}>HACK</span>
          </RevealLine>
          <RevealLine delay={0.22}>
            <span
              className="block text-hero"
              style={{
                color: 'var(--primary)',
                textShadow: '0 0 40px rgba(0, 230, 118, 0.25)',
              }}
            >
              &amp; HUNT
            </span>
          </RevealLine>
        </h1>

        {/* Tagline */}
        <div className="mb-8 md:mb-9 space-y-1 max-w-xs md:max-w-sm">
          {EVENT_CONFIG.tagline.map((line, i) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.1, duration: 0.6, ease: EASE }}
              className="label-mono"
              style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Meta row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6, ease: EASE }}
          className="flex flex-wrap gap-x-8 gap-y-3 mb-8 md:mb-9"
          style={{ borderTop: '1px solid var(--line)', paddingTop: '1.25rem' }}
        >
          <div>
            <p className="label-mono mb-0.5" style={{ opacity: 0.4 }}>DATE</p>
            <p className="label-mono" style={{ color: 'var(--text)', fontSize: '0.75rem' }}>
              {EVENT_CONFIG.date}
            </p>
          </div>
          <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: '2rem' }}>
            <p className="label-mono mb-0.5" style={{ opacity: 0.4 }}>PRIZE POOL</p>
            <p className="label-mono" style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>
              {EVENT_CONFIG.prizePool}
            </p>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6, ease: EASE }}
          className="flex flex-wrap gap-4"
        >
          <RegisterButton label="REGISTER NOW" />
          <Button
            variant="outline"
            href="#challenge"
            onClick={scrollTo('challenge')}
            data-hover="true"
          >
            EXPLORE THE CHALLENGE
          </Button>
        </motion.div>

        {/* Coordinate label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-16 flex items-center gap-3"
        >
          <div className="w-12 h-px" style={{ background: 'var(--line)' }} />
          <span className="label-mono opacity-25">12.9716° N · 77.5946° E · SECTOR 07</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="label-mono opacity-30" style={{ fontSize: '0.55rem' }}>SCROLL</span>
        <div className="w-px h-8 overflow-hidden" style={{ background: 'var(--line)' }}>
          <motion.div
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
            className="w-full h-1/2"
            style={{ background: 'var(--primary)', opacity: 0.6 }}
          />
        </div>
      </motion.div>
    </section>
  );
}
