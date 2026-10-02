import { useState, useRef, useId } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import SectionLabel from './ui/SectionLabel';
import { EVENT_CONFIG } from '../data/eventConfig';

const EASE = [0.22, 1, 0.36, 1] as const;

function FAQItem({
  item,
  index,
  isOpen,
  onToggle,
  answerId,
  questionId,
}: {
  item: typeof EVENT_CONFIG.faq[number];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  answerId: string;
  questionId: string;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
      style={{
        borderTop: '1px solid var(--line)',
        borderLeftWidth: isOpen ? '2px' : '0',
        borderLeftColor: 'var(--primary)',
        borderLeftStyle: 'solid',
        paddingLeft: isOpen ? '16px' : '0',
        transition: 'padding 0.2s, border-left-width 0.2s',
      }}
    >
      <button
        id={questionId}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={answerId}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        data-hover="true"
      >
        <div className="flex items-baseline gap-4">
          <span className="label-mono opacity-25" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            className="font-grotesk font-medium group-hover:text-text transition-colors"
            style={{
              fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
              color: isOpen ? 'var(--text)' : 'var(--text-muted)',
              letterSpacing: '-0.01em',
            }}
          >
            {item.q}
          </span>
        </div>

        {/* +/– indicator */}
        <div
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center"
          style={{
            border: `1px solid ${isOpen ? 'rgba(0,230,118,0.4)' : 'var(--line-strong)'}`,
            borderRadius: '2px',
            transition: 'border-color 0.2s',
          }}
          aria-hidden="true"
        >
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.18 }}
            className="font-mono leading-none"
            style={{ fontSize: '1rem', color: isOpen ? 'var(--primary)' : 'var(--text-muted)' }}
          >
            +
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={answerId}
            role="region"
            aria-labelledby={questionId}
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p
              className="font-inter leading-relaxed pb-5 pr-8"
              style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', maxWidth: '65ch' }}
            >
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [open, setOpen]   = useState<number | null>(0);
  const headerRef         = useRef<HTMLElement>(null);
  const isInView          = useInView(headerRef, { once: true, margin: '-60px' });
  const uid               = useId();

  const toggle = (i: number) => setOpen(prev => prev === i ? null : i);

  return (
    <section
      id="faq"
      ref={headerRef}
      className="section-y"
      aria-labelledby="faq-heading"
    >
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="mb-14"
        >
          <SectionLabel index="07" label="FAQ" className="mb-6" />
          <h2
            id="faq-heading"
            className="font-grotesk font-semibold"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.03em', color: 'var(--text)' }}
          >
            QUESTIONS?
          </h2>
          <p
            className="font-inter mt-3 max-w-[50ch]"
            style={{ fontSize: '1rem', color: 'var(--text-muted)' }}
          >
            Everything known about Hack &amp; Hunt. More details will be revealed soon.
          </p>
        </motion.div>

        <div className="max-w-3xl">
          {EVENT_CONFIG.faq.map((item, i) => (
            <FAQItem
              key={item.q}
              item={item}
              index={i}
              isOpen={open === i}
              onToggle={() => toggle(i)}
              answerId={`${uid}-answer-${i}`}
              questionId={`${uid}-question-${i}`}
            />
          ))}
          <div className="h-px" style={{ background: 'var(--line)' }} />
        </div>
      </div>
    </section>
  );
}
