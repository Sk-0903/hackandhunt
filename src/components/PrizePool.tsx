import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionLabel from './ui/SectionLabel';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { EVENT_CONFIG } from '../data/eventConfig';

const EASE = [0.22, 1, 0.36, 1] as const;
const WORDS = ['OUTTHINK.', 'OUTBUILD.', 'OUTHUNT.'];

function CountUp({ target, run }: { target: number; run: boolean }) {
  const [val, setVal] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!run) return;
    if (reduced) { setVal(target); return; }

    let start: number | null = null;
    const dur = 1800;
    const raf = requestAnimationFrame(function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  }, [run, target, reduced]);

  return <>{val.toLocaleString('en-IN')}</>;
}

export default function PrizePool() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  // Double-click Easter egg
  const [egg, setEgg] = useState(false);
  const triggerEgg = () => {
    setEgg(true);
    setTimeout(() => setEgg(false), 2200);
  };

  return (
    <section
      id="prize"
      ref={ref}
      className="section-y relative overflow-hidden"
      style={{ background: 'var(--surface)' }}
      aria-labelledby="prize-heading"
    >
      {/* Radial green glow — only here and hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(0,230,118,0.07) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--line-strong), transparent)' }}
        aria-hidden="true"
      />

      <div className="container-site relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <SectionLabel index="05" label="PRIZE POOL" coord="HIGH VALUE TARGET" />
        </motion.div>

        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
          {/* Number */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            <h2
              id="prize-heading"
              className="font-grotesk font-black leading-none cursor-default select-none text-prize"
              style={{ color: 'var(--primary)', letterSpacing: '-0.04em' }}
              onDoubleClick={triggerEgg}
              title="Try double-clicking…"
            >
              ₹<CountUp target={EVENT_CONFIG.prizeAmount} run={inView} />
            </h2>

            {/* Easter egg */}
            {egg && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="label-mono mt-2"
                style={{ color: 'var(--primary)' }}
              >
                ACCESS GRANTED.
              </motion.p>
            )}

            <p className="label-mono mt-3" style={{ opacity: 0.45 }}>PRIZE POOL / TOTAL</p>
          </motion.div>

          {/* Word-by-word slogan reveal */}
          <div className="flex flex-col gap-2 lg:text-right">
            {WORDS.map((word, i) => (
              <motion.p
                key={word}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.35 + i * 0.14, ease: EASE }}
                className="font-grotesk font-semibold leading-none"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 3.25rem)',
                  letterSpacing: '-0.02em',
                  color: `rgba(242,245,243,${1 - i * 0.3})`,
                }}
              >
                {word}
              </motion.p>
            ))}
          </div>
        </div>

        {/* Separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
          className="h-px mt-16 origin-left"
          style={{ background: 'linear-gradient(90deg, var(--primary), rgba(0,230,118,0.1), transparent)' }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="label-mono mt-5 opacity-30"
        >
          PRIZE DISTRIBUTION WILL BE ANNOUNCED SOON
        </motion.p>
      </div>
    </section>
  );
}
