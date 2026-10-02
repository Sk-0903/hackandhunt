import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionLabel from './ui/SectionLabel';
import { EVENT_CONFIG } from '../data/eventConfig';

const ROWS = [
  { label: 'EVENT',        value: EVENT_CONFIG.eventName,   green: false },
  { label: 'DATE',         value: EVENT_CONFIG.date,        green: false },
  { label: 'VENUE',        value: EVENT_CONFIG.venue,       green: false },
  { label: 'EVENT TYPE',   value: EVENT_CONFIG.eventType,   green: false },
  { label: 'PRIZE POOL',   value: EVENT_CONFIG.prizePool,   green: true  },
  { label: 'REGISTRATION', value: 'Opening Soon',           green: false },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function EventDetails() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      id="details"
      ref={ref}
      className="section-y"
      aria-labelledby="details-heading"
    >
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <SectionLabel index="04" label="EVENT DETAILS" className="mb-6" />
          <h2
            id="details-heading"
            className="font-grotesk font-semibold"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.03em', color: 'var(--text)' }}
          >
            THE FACTS
          </h2>
        </motion.div>

        {/* Hairline table */}
        <div role="table" aria-label="Event details">
          <div className="sr-only" role="row">
            <span role="columnheader">Field</span>
            <span role="columnheader">Value</span>
          </div>

          {ROWS.map((row, i) => (
            <motion.div
              key={row.label}
              role="row"
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
              className="group relative"
            >
              {/* Line draw animation on top border */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.6, delay: i * 0.07 + 0.1, ease: EASE }}
                className="absolute top-0 left-0 right-0 h-px origin-left"
                style={{ background: 'var(--line)' }}
                aria-hidden="true"
              />

              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between py-4 sm:py-5 gap-1 sm:gap-8"
                role="cell"
              >
                <span
                  className="label-mono flex-shrink-0 text-white/50 text-[9px] sm:text-[10.5px]"
                  style={{ minWidth: '140px' }}
                  role="rowheader"
                >
                  {row.label}
                </span>

                <span
                  className={`font-grotesk font-semibold flex-1 leading-none ${
                    row.green
                      ? 'text-primary text-base sm:text-xl font-bold'
                      : 'text-white text-sm sm:text-base md:text-lg'
                  }`}
                  style={{
                    letterSpacing: '-0.02em',
                  }}
                >
                  {row.value}
                </span>
              </div>

              {/* Hover accent */}
              <div
                className="absolute left-0 top-0 bottom-0 w-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'var(--primary)' }}
                aria-hidden="true"
              />
            </motion.div>
          ))}

          {/* Bottom hairline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: ROWS.length * 0.07 + 0.1, ease: EASE }}
            className="h-px origin-left"
            style={{ background: 'var(--line)' }}
            aria-hidden="true"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="label-mono mt-6 opacity-30"
        >
          More details will be announced soon.
        </motion.p>
      </div>
    </section>
  );
}
