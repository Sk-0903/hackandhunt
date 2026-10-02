import { useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useCountdown } from '../hooks/useCountdown';
import { EVENT_CONFIG } from '../data/eventConfig';

function pad(n: number) { return String(n).padStart(2, '0'); }

function Digit({ value }: { value: number }) {
  const s = pad(value);
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={s}
        initial={{ y: '-40%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '40%', opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="tabular font-grotesk font-semibold text-text block"
        style={{
          fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
        }}
      >
        {s}
      </motion.span>
    </AnimatePresence>
  );
}

function Unit({ value, label, delay, inView }: {
  value: number; label: string; delay: number; inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center"
    >
      {/* Box */}
      <div
        className="relative flex items-center justify-center overflow-hidden bracket"
        style={{
          width: 'clamp(72px, 14vw, 130px)',
          height: 'clamp(80px, 15vw, 140px)',
          background: 'var(--surface)',
          border: '1px solid var(--line-strong)',
        }}
      >
        {/* Mid line */}
        <div
          className="absolute left-0 right-0 h-px"
          style={{ top: '50%', background: 'var(--line)' }}
          aria-hidden="true"
        />
        <Digit value={value} />
      </div>
      <span className="label-mono mt-3" style={{ opacity: 0.45 }}>{label}</span>
    </motion.div>
  );
}

function Sep({ inView, delay }: { inView: boolean; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ delay }}
      className="font-mono pb-10 self-end"
      style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)', color: 'var(--line-strong)' }}
      aria-hidden="true"
    >
      :
    </motion.span>
  );
}

export default function Countdown() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { days, hours, minutes, seconds, isExpired } = useCountdown(EVENT_CONFIG.eventDateISO);

  return (
    <section
      ref={ref}
      className="section-y"
      aria-label="Countdown to Hack and Hunt"
    >
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="mb-12"
        >
          <span className="label-mono opacity-40">SYS.TIMER — EVENT COUNTDOWN</span>
          <h2
            className="font-grotesk font-semibold mt-3"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: 'var(--text)', letterSpacing: '-0.03em' }}
          >
            {isExpired ? 'THE HUNT HAS BEGUN.' : 'THE HUNT BEGINS IN'}
          </h2>
        </motion.div>

        {isExpired ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="label-mono"
            style={{ color: 'var(--primary)', fontSize: '1rem' }}
          >
            SYSTEM ACTIVE / 30.10.2026 / SJBIT
          </motion.p>
        ) : (
          <div className="flex flex-wrap items-end gap-3 md:gap-4" role="timer" aria-live="off">
            <Unit value={days}    label="DAYS"    delay={0.1} inView={inView} />
            <Sep inView={inView} delay={0.15} />
            <Unit value={hours}   label="HOURS"   delay={0.2} inView={inView} />
            <Sep inView={inView} delay={0.25} />
            <Unit value={minutes} label="MINUTES" delay={0.3} inView={inView} />
            <Sep inView={inView} delay={0.35} />
            <Unit value={seconds} label="SECONDS" delay={0.4} inView={inView} />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 mt-8"
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--primary)', animation: 'pulse 1.5s infinite' }}
            aria-hidden="true"
          />
          <span className="label-mono opacity-30">
            TARGET: 30.10.2026 / 00:00:00 IST (+05:30) / SJBIT
          </span>
        </motion.div>
      </div>
    </section>
  );
}
