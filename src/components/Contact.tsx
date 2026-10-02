import { useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionLabel from './ui/SectionLabel';
import { EVENT_CONFIG } from '../data/eventConfig';

const EASE = [0.22, 1, 0.36, 1] as const;

interface CoordinatorSlot {
  id: string;
  role: 'STUDENT COORDINATOR' | 'FACULTY COORDINATOR';
  name: string;
  contact?: string;
  dept?: string;
  slotNumber: string;
}

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { students, faculty } = EVENT_CONFIG.coordinators;

  // Compile unified coordinator roster
  const roster: CoordinatorSlot[] = useMemo(() => {
    const list: CoordinatorSlot[] = [];
    students.forEach((s, idx) => {
      list.push({
        id: `student-${idx}`,
        role: 'STUDENT COORDINATOR',
        name: s.name || '',
        contact: s.phone || '',
        slotNumber: String(idx + 1).padStart(2, '0'),
      });
    });
    faculty.forEach((f, idx) => {
      list.push({
        id: `faculty-${idx}`,
        role: 'FACULTY COORDINATOR',
        name: f.name || '',
        dept: f.dept || '',
        slotNumber: String(students.length + idx + 1).padStart(2, '0'),
      });
    });
    return list;
  }, [students, faculty]);

  // Triple roster for seamless infinite marquee loop
  const infiniteRoster = useMemo(() => {
    return [...roster, ...roster, ...roster];
  }, [roster]);

  return (
    <section
      id="contact"
      ref={ref}
      className="section-y relative overflow-hidden"
      aria-labelledby="contact-heading"
    >
      <div className="container-site">
        
        {/* Header with Automatic Stream Indicator */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <SectionLabel index="08" label="MISSION CONTROL" className="mb-4" />
            <h2
              id="contact-heading"
              className="font-grotesk font-semibold text-section leading-none tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              MISSION
              <br />
              <span style={{ color: 'var(--primary)' }}>CONTROL</span>
            </h2>
          </motion.div>

          {/* Automatic Live Stream Badge */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-[2px] bg-black/60 border border-primary/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="label-mono text-[9.5px] sm:text-[10px] tracking-widest text-primary font-semibold uppercase">
                AUTO-SLIDING ROSTER STREAM
              </span>
              <span className="text-white/20">|</span>
              <span className="label-mono text-[9px] sm:text-[9.5px] text-white/50">
                {roster.length} SLOTS ACTIVE
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── 100% AUTOMATIC CONTINUOUS SLIDING CONVEYOR (No Manual Buttons, Never Freezes) ── */}
      <div className="relative w-full overflow-hidden py-3">
        {/* Edge Fade Gradients for Seamless Depth */}
        <div
          className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #050806 0%, transparent 100%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, #050806 0%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Continuous Automatic Sliding Track */}
        <motion.div
          className="flex gap-5 sm:gap-6 w-max pl-4"
          animate={{ x: ['0%', '-33.333%'] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 22,
            ease: 'linear',
          }}
        >
          {infiniteRoster.map((card, idx) => {
            const hasName = Boolean(card.name && card.name.trim().length > 0);
            const hasContact = Boolean(card.contact && card.contact.trim().length > 0);
            const hasDept = Boolean(card.dept && card.dept.trim().length > 0);

            return (
              <div
                key={`${card.id}-${idx}`}
                className="w-[280px] sm:w-[320px] md:w-[350px] flex-shrink-0 p-5 sm:p-6 rounded-[2px] border border-white/[0.08] hover:border-primary/40 transition-colors bg-black/40 backdrop-blur-md flex flex-col justify-between select-none relative group"
                style={{
                  background:
                    'radial-gradient(ellipse 90% 70% at 20% 30%, rgba(0, 230, 118, 0.04) 0%, rgba(5, 8, 6, 0.85) 75%)',
                }}
              >
                {/* Tech corner tick accents */}
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/40" aria-hidden="true" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/40" aria-hidden="true" />

                <div>
                  {/* Role Header & Slot Index */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="label-mono text-[9px] text-primary/80 font-semibold tracking-widest uppercase">
                      {card.role}
                    </span>
                    <span className="label-mono text-[8.5px] text-white/30">
                      #{card.slotNumber}
                    </span>
                  </div>

                  {/* Coordinator Name or Clean Blank State */}
                  {hasName ? (
                    <p className="font-grotesk font-semibold text-lg text-white tracking-tight truncate">
                      {card.name}
                    </p>
                  ) : (
                    <div className="py-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-white/[0.03] border border-dashed border-white/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="label-mono text-[10px] text-white/70 tracking-wider uppercase font-medium">
                          To Be Announced
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subtitle / Direct Contact / Dept */}
                <div className="mt-5 pt-3 border-t border-white/[0.06]">
                  {hasContact && (
                    <a
                      href={`tel:${card.contact!.replace(/\s/g, '')}`}
                      className="label-mono text-xs block text-white/60 hover:text-primary transition-colors"
                      data-hover="true"
                    >
                      {card.contact}
                    </a>
                  )}
                  {hasDept && (
                    <span className="label-mono text-[10px] text-white/50 block">
                      {card.dept}
                    </span>
                  )}
                  {!hasContact && !hasDept && (
                    <span className="label-mono text-[9px] text-white/30 tracking-wider block">
                      ROSTER ALLOCATION PENDING
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
