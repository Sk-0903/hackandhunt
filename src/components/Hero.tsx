import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import NetworkBackground from './NetworkBackground';
import { RegisterButton } from './ui/Button';
import Button from './ui/Button';
import { RevealLine } from './ui/Reveal';
import { EVENT_CONFIG } from '../data/eventConfig';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const opacity  = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden py-16 sm:py-20"
      aria-label="Hero"
      style={{
        background: 'linear-gradient(180deg, #050806 0%, #080D0A 50%, #050806 100%)',
      }}
    >
      {/* Interactive Network Particle Canvas */}
      <NetworkBackground className="opacity-60" />

      {/* Radiant Central Emerald Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 48%, rgba(0, 230, 118, 0.08) 0%, rgba(0, 230, 118, 0.015) 50%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* Subtle bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-[2]"
        style={{ background: 'linear-gradient(to bottom, transparent, #050806)' }}
        aria-hidden="true"
      />

      {/* Corner HUD accent brackets */}
      <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-primary/40 pointer-events-none hidden md:block" aria-hidden="true" />
      <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-primary/40 pointer-events-none hidden md:block" aria-hidden="true" />
      <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-primary/40 pointer-events-none hidden md:block" aria-hidden="true" />
      <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-primary/40 pointer-events-none hidden md:block" aria-hidden="true" />

      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 container-site w-full flex flex-col items-center text-center max-w-5xl mx-auto"
      >
        {/* Dignified Institutional & Fest Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-5 sm:mb-6 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/[0.04] backdrop-blur-md"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="label-mono font-semibold text-[10px] sm:text-[11px] text-white/90 tracking-widest uppercase">
            {EVENT_CONFIG.college}
          </span>
          <span className="text-primary/60">·</span>
          <span className="label-mono font-semibold text-[10px] sm:text-[11px] text-primary tracking-widest uppercase">
            {EVENT_CONFIG.techFest} • SILVER JUBILEE '26
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        </motion.div>

        {/* Full-Width Centered Monumental Title: HACK & HUNT */}
        <div className="w-full my-2.5 sm:my-4">
          <h1
            aria-label="Hack and Hunt"
            className="font-grotesk font-black tracking-tight leading-[0.92] sm:leading-[0.95] text-center select-none"
            style={{ letterSpacing: '-0.035em' }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-3.5 md:gap-5">
              <RevealLine delay={0.1}>
                <span className="inline-block text-[3.25rem] xs:text-[4rem] sm:text-hero text-white tracking-tight">
                  HACK
                </span>
              </RevealLine>
              <RevealLine delay={0.2}>
                <span
                  className="inline-block text-[3.25rem] xs:text-[4rem] sm:text-hero tracking-tight"
                  style={{
                    color: '#00E676',
                    textShadow: '0 0 35px rgba(0, 230, 118, 0.45), 0 0 80px rgba(0, 230, 118, 0.2)',
                  }}
                >
                  &amp; HUNT
                </span>
              </RevealLine>
            </div>
          </h1>
        </div>

        {/* Tagline & Event Mission Brief */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
          className="mt-3 sm:mt-5 mb-6 sm:mb-10 max-w-2xl mx-auto space-y-1.5 sm:space-y-2 px-2"
        >
          <p className="label-mono font-semibold text-primary/90 text-xs sm:text-sm tracking-[0.22em] sm:tracking-[0.25em] uppercase">
            OUTTHINK. OUTBUILD. OUTHUNT.
          </p>
          <p className="font-inter text-xs xs:text-sm sm:text-base md:text-lg text-white/70 leading-relaxed max-w-xl mx-auto">
            The flagship dual-phase technical challenge of VIGYANTRA 2026. A high-stakes combination
            of rapid code-cracking sprints and real-world campus treasure hunting.
          </p>
        </motion.div>

        {/* Centered Key Metric Cards Strip (Cockpit HUD) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6, ease: EASE }}
          className="grid grid-cols-3 gap-2 sm:gap-5 w-full max-w-2xl mb-7 sm:mb-11"
        >
          {/* Card 1: Prize Pool */}
          <div className="p-2.5 sm:p-4 rounded-[2px] bg-black/60 border border-primary/35 relative group hover:border-primary/70 transition-all shadow-[0_4px_20px_rgba(0,230,118,0.08)] flex flex-col justify-center items-center text-center">
            <span className="label-mono text-[7.5px] xs:text-[8.5px] sm:text-[9.5px] text-white/50 block tracking-wider sm:tracking-widest uppercase">
              PRIZE POOL
            </span>
            <span className="font-grotesk font-bold text-base xs:text-lg sm:text-2xl text-primary block mt-0.5 sm:mt-1">
              ₹50,000
            </span>
            <div className="absolute top-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 border-t-2 border-r-2 border-primary/70" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 w-2 h-2 sm:w-2.5 sm:h-2.5 border-b-2 border-l-2 border-primary/70" aria-hidden="true" />
          </div>

          {/* Card 2: Date */}
          <div className="p-2.5 sm:p-4 rounded-[2px] bg-black/60 border border-white/15 relative group hover:border-white/30 transition-all flex flex-col justify-center items-center text-center">
            <span className="label-mono text-[7.5px] xs:text-[8.5px] sm:text-[9.5px] text-white/50 block tracking-wider sm:tracking-widest uppercase">
              EVENT DATE
            </span>
            <span className="font-grotesk font-semibold text-xs xs:text-sm sm:text-lg text-white block mt-0.5 sm:mt-1 whitespace-nowrap">
              30 OCT 2026
            </span>
            <div className="absolute top-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 border-t border-r border-white/30" aria-hidden="true" />
          </div>

          {/* Card 3: Team */}
          <div className="p-2.5 sm:p-4 rounded-[2px] bg-black/60 border border-white/15 relative group hover:border-white/30 transition-all flex flex-col justify-center items-center text-center">
            <span className="label-mono text-[7.5px] xs:text-[8.5px] sm:text-[9.5px] text-white/50 block tracking-wider sm:tracking-widest uppercase">
              SQUAD SIZE
            </span>
            <span className="font-grotesk font-semibold text-xs xs:text-sm sm:text-lg text-white block mt-0.5 sm:mt-1 whitespace-nowrap">
              2–4 CODERS
            </span>
            <div className="absolute top-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 border-t border-r border-white/30" aria-hidden="true" />
          </div>
        </motion.div>

        {/* Action Hub CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6, ease: EASE }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 w-full max-w-md mx-auto"
        >
          <RegisterButton label="REGISTER FOR THE HUNT" className="w-full sm:w-auto justify-center py-3.5 sm:py-4 px-8 text-xs tracking-widest" />
          <Button
            variant="outline"
            href="#challenge"
            onClick={scrollTo('challenge')}
            data-hover="true"
            className="w-full sm:w-auto justify-center py-3.5 sm:py-4 px-7 text-xs tracking-widest"
          >
            EXPLORE THE CHALLENGE
          </Button>
        </motion.div>

        {/* Sacred Invocation Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95 }}
          className="mt-7 flex items-center justify-center"
        >
          <a
            href="#heritage"
            onClick={scrollTo('heritage')}
            className="label-mono text-[10px] text-amber-400/80 hover:text-amber-300 transition-colors flex items-center gap-2 group"
          >
            <span className="font-sans font-medium text-amber-300">|| ಜೈ ಶ್ರೀ ಗುರುದೇವ್ ||</span>
            <span className="tracking-wider">VIEW DIVINE BLESSINGS</span>
            <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Subtle Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 pointer-events-none"
        aria-hidden="true"
      >
        <span className="label-mono text-[7.5px] text-white/30 tracking-widest">SCROLL</span>
        <div className="w-px h-6 overflow-hidden bg-white/10">
          <motion.div
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="w-full h-1/2 bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}

