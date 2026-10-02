import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionLabel from './ui/SectionLabel';
import { RevealLine } from './ui/Reveal';

interface Swamiji {
  id: string;
  name: string;
  role: string;
  institution: string;
  image: string;
}

const SWAMIJIS: Swamiji[] = [
  {
    id: 'swamiji-1',
    name: 'His Divine Soul Jagadguru Sri Sri Sri Dr. Balagangadharanatha Maha Swamiji',
    role: 'FOUNDER PRESIDENT',
    institution: 'Sri Adichunchanagiri Mahasamsthana Math',
    image: '/images/swamiji-1.png',
  },
  {
    id: 'swamiji-2',
    name: 'Jagadguru Sri Sri Sri Dr. Nirmalanandanatha Maha Swamiji',
    role: 'PRESIDENT',
    institution: 'Sri Adichunchanagiri Shikshana Trust®',
    image: '/images/swamiji-2.png',
  },
  {
    id: 'swamiji-3',
    name: 'Revered Sri Sri Dr. Prakashnath Swamiji',
    role: 'MANAGING DIRECTOR',
    institution: 'SJB & BGS Group of Institutions',
    image: '/images/swamiji-3.png',
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function SwamijiSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      id="heritage"
      ref={sectionRef}
      className="section-y relative overflow-hidden"
      style={{
        background: 'var(--surface)',
      }}
      aria-labelledby="heritage-heading"
    >
      {/* Top subtle hairline connecting to preceding section */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--line-strong), transparent)' }}
        aria-hidden="true"
      />

      {/* Subtle ambient warm lighting behind portraits — restrained, no neon on faces */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 65% 50% at 50% 45%, rgba(212, 175, 55, 0.03) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="container-site relative z-10">
        
        {/* Section Header */}
        <div className="mb-14 md:mb-18">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <SectionLabel index="01" label="INSTITUTIONAL HERITAGE" coord="SRI ADICHUNCHANAGIRI TRUST" />
          </motion.div>

          <h2 id="heritage-heading" className="sr-only">
            Rooted in Values. Driven by Innovation.
          </h2>

          <div className="space-y-1 mb-6">
            <RevealLine delay={0.1}>
              <span
                className="block font-grotesk font-semibold text-section leading-none tracking-tight"
                style={{ color: 'var(--text)' }}
              >
                ROOTED IN VALUES.
              </span>
            </RevealLine>
            <RevealLine delay={0.22}>
              <span
                className="block font-grotesk font-semibold text-section leading-none tracking-tight"
                style={{ color: 'var(--muted-green)' }}
              >
                DRIVEN BY INNOVATION.
              </span>
            </RevealLine>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
            className="font-inter text-base md:text-lg leading-relaxed max-w-[62ch]"
            style={{ color: 'var(--text-muted)' }}
          >
            VIGYANTRA 2026 brings together the values of SJB Institute of Technology and the spirit of technological innovation.
          </motion.p>
        </div>

        {/* Refined Horizontal Swamiji Portraits Composition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {SWAMIJIS.map((s, idx) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + idx * 0.12, ease: EASE }}
              className="group relative flex flex-col items-center text-center p-6 sm:p-7 transition-all duration-300"
              style={{
                background: 'rgba(5, 8, 6, 0.75)',
                border: '1px solid var(--line-strong)',
                borderRadius: '2px',
              }}
            >
              {/* Corner accent bracket lines */}
              <div
                className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t border-l border-white/25 group-hover:border-primary/60 transition-colors"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b border-r border-white/25 group-hover:border-primary/60 transition-colors"
                aria-hidden="true"
              />

              {/* Dignified Vertical Portrait Frame */}
              <div className="relative mb-6 w-full max-w-[260px] aspect-[4/5] rounded-[2px] overflow-hidden border border-white/[0.08] transition-transform duration-300 group-hover:scale-[1.015] bg-[#0A0E0B]">
                {/* Subtle soft ambient warm background */}
                <div
                  className="absolute inset-0 opacity-15 group-hover:opacity-30 transition-opacity pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 50% 30%, rgba(234, 179, 8, 0.4) 0%, transparent 75%)' }}
                  aria-hidden="true"
                />

                <img
                  src={s.image}
                  alt={s.name}
                  className="w-full h-full object-cover object-top select-none"
                  loading="lazy"
                />
              </div>

              {/* Reverent Typography */}
              <div className="flex-1 flex flex-col justify-between w-full space-y-3">
                <span
                  className="label-mono text-[10px] sm:text-[10.5px] font-semibold tracking-widest block"
                  style={{ color: 'var(--primary)', opacity: 0.9 }}
                >
                  {s.role}
                </span>

                <h3
                  className="font-grotesk font-semibold text-base sm:text-lg leading-snug px-1"
                  style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}
                >
                  {s.name}
                </h3>

                <p
                  className="label-mono text-[9px] sm:text-[9.5px] leading-relaxed opacity-50 pt-2"
                  style={{ borderTop: '1px solid var(--line)', color: 'var(--text-muted)' }}
                >
                  {s.institution}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Transition into Hack & Hunt: Thin green signal line connector */}
        <div className="mt-16 md:mt-24 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary)' }} />
            <span className="label-mono text-[10px] tracking-widest text-text-muted opacity-60">
              TRADITION → INNOVATION → CHALLENGE
            </span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary)' }} />
          </div>

          <div
            className="w-px h-16"
            style={{
              background: 'linear-gradient(to bottom, var(--primary), var(--line))',
            }}
            aria-hidden="true"
          />
        </div>

      </div>
    </section>
  );
}
