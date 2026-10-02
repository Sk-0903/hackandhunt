import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const LINES = [
  'INITIALIZING VIGYANTRA SYSTEM...',
  'ACCESSING HACK & HUNT...',
  'SYSTEM READY',
];
const SESSION_KEY = 'vgt_boot';
const CHAR_MS = 26;
// ms delay before each line starts (after previous line finishes)
const LINE_GAPS = [0, 100, 100];

interface Props { onComplete: () => void }

function Typewriter({ text, onDone }: { text: string; onDone?: () => void }) {
  const [chars, setChars] = useState(0);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setChars(i);
      if (i >= text.length) { clearInterval(id); onDone?.(); }
    }, CHAR_MS);
    return () => clearInterval(id);
  }, [text]);

  return (
    <div className="flex items-center gap-1.5 leading-none">
      <span className="label-mono" style={{ color: 'var(--primary)', fontSize: '0.7rem', letterSpacing: '0.12em' }}>
        {text.slice(0, chars)}
      </span>
      {chars < text.length && (
        <span
          className="inline-block w-[7px] h-[13px]"
          style={{ background: 'var(--primary)', animation: 'pulse 0.55s steps(1) infinite' }}
        />
      )}
    </div>
  );
}

export default function BootSequence({ onComplete }: Props) {
  const reduced = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState(0);
  const [exiting, setExiting] = useState(false);
  const called = useRef(false);

  const alreadySeen = useRef(
    (() => { try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; } })()
  );

  const finish = useCallback(() => {
    if (called.current) return;
    called.current = true;
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* */ }
    setExiting(true);
    setTimeout(onComplete, 500);
  }, [onComplete]);

  // Skip entirely on reduced motion or already seen
  useEffect(() => {
    if (reduced || alreadySeen.current) { onComplete(); }
  }, []);

  // Skip on click or keypress
  useEffect(() => {
    const skip = () => finish();
    window.addEventListener('click', skip, { once: true });
    window.addEventListener('keydown', skip, { once: true });
    return () => {
      window.removeEventListener('click', skip);
      window.removeEventListener('keydown', skip);
    };
  }, [finish]);

  if (reduced || alreadySeen.current) return null;

  // Stagger timings: each line starts after previous finishes + gap
  // Rough char counts: ~34, ~24, ~12 → ~900ms, 630ms, 315ms
  const delays = [0, 900 + 100, 900 + 100 + 630 + 100];

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-[9999] flex flex-col items-start justify-center px-8 md:px-16"
          style={{ background: 'var(--bg)' }}
          aria-live="polite"
          aria-label="System initializing"
        >
          {/* Grid decoration */}
          <div className="absolute inset-0 coord-grid opacity-25 pointer-events-none" />

          {/* Status dot */}
          <div className="absolute top-8 left-8 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary)', animation: 'pulse 1s infinite' }} />
            <span className="label-mono opacity-50">SYS v2026.10</span>
          </div>

          {/* Skip hint */}
          <div className="absolute bottom-8 right-8">
            <span className="label-mono opacity-25">CLICK TO SKIP</span>
          </div>

          <div className="space-y-5 relative z-10">
            {LINES.map((line, i) => (
              <TimedLine key={line} line={line} delay={delays[i]} />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TimedLine({ line, delay }: { line: string; delay: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(id);
  }, [delay]);
  if (!show) return null;
  return <Typewriter text={line} />;
}
