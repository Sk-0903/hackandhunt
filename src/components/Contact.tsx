import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionLabel from './ui/SectionLabel';
import { EVENT_CONFIG } from '../data/eventConfig';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Contact() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { students, faculty } = EVENT_CONFIG.coordinators;

  return (
    <section
      id="contact"
      ref={ref}
      className="section-y"
      aria-labelledby="contact-heading"
    >
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="mb-14"
        >
          <SectionLabel index="08" label="MISSION CONTROL" className="mb-6" />
          <h2
            id="contact-heading"
            className="font-grotesk font-semibold"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.03em', color: 'var(--text)' }}
          >
            MISSION
            <br />
            <span style={{ color: 'var(--primary)' }}>CONTROL</span>
          </h2>
        </motion.div>

        {/* Coordinator list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0">
          {students.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.1, ease: EASE }}
              className="py-8 pr-8"
              style={{ borderTop: '1px solid var(--line)' }}
            >
              <span className="label-mono block mb-4">STUDENT COORDINATOR</span>
              <p
                className="font-grotesk font-semibold"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: 'var(--text)', letterSpacing: '-0.01em' }}
              >
                {s.name}
              </p>
              {s.phone && (
                <a
                  href={`tel:${s.phone.replace(/\s/g, '')}`}
                  className="label-mono mt-2 block hover:text-text transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  data-hover="true"
                >
                  {s.phone}
                </a>
              )}
            </motion.div>
          ))}

          {faculty.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + (students.length + i) * 0.1, ease: EASE }}
              className="py-8 pr-8"
              style={{ borderTop: '1px solid var(--line)' }}
            >
              <span className="label-mono block mb-4">FACULTY COORDINATOR</span>
              <p
                className="font-grotesk font-semibold"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: 'var(--text)', letterSpacing: '-0.01em' }}
              >
                {f.name}
              </p>
              <span className="label-mono mt-2 block" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                {f.dept}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
