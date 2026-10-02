import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import SectionLabel from './ui/SectionLabel';
import { RevealLine } from './ui/Reveal';
import CyberCore3D from './CyberCore3D';

export default function About() {
  const sectionRef  = useRef<HTMLElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const isInView    = useInView(sectionRef, { once: true, margin: '-80px' });

  // Subtle parallax on the giant "&"
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const ampY = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-y relative overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* Faint grid */}
      <div className="absolute inset-0 coord-grid opacity-20 pointer-events-none" aria-hidden="true" />

      {/* Giant "&" parallax background */}
      <motion.div
        style={{ y: ampY }}
        className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none select-none parallax"
        aria-hidden="true"
      >
        <span
          className="font-grotesk font-black"
          style={{
            fontSize: 'clamp(16rem, 40vw, 32rem)',
            color: 'var(--text)',
            opacity: 0.022,
            lineHeight: 1,
            letterSpacing: '-0.05em',
          }}
        >
          &amp;
        </span>
      </motion.div>

      <div ref={contentRef} className="container-site relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <SectionLabel index="02" label="ABOUT" coord="SECTOR 02 / 12.9716° N" />
        </motion.div>

        {/* Editorial heading — staggered line reveals */}
        <h2 id="about-heading" className="sr-only">About Hack &amp; Hunt</h2>
        <div className="mb-16">
          <RevealLine delay={0.05}>
            <p
              className="font-grotesk font-semibold leading-none"
              style={{ fontSize: 'clamp(2.25rem, 6.5vw, 5.5rem)', letterSpacing: '-0.03em', color: 'var(--text)' }}
            >
              NOT JUST A HACKATHON.
            </p>
          </RevealLine>
          <RevealLine delay={0.18}>
            <p
              className="font-grotesk font-semibold leading-none"
              style={{ fontSize: 'clamp(2.25rem, 6.5vw, 5.5rem)', letterSpacing: '-0.03em', color: 'var(--text-muted)', opacity: 0.35 }}
            >
              NOT JUST A TREASURE HUNT.
            </p>
          </RevealLine>
        </div>

        {/* Asymmetric body layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 items-center">
          {/* Left: 3D Holographic Cyber Core */}
          <div className="md:col-span-5 flex items-center justify-center md:pr-8 mb-8 md:mb-0">
            <CyberCore3D />
          </div>

          {/* Right body copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-7"
          >
            {/* Thin accent line */}
            <div className="h-px mb-8" style={{ background: 'linear-gradient(90deg, var(--primary), transparent)', opacity: 0.3 }} />

            <div className="space-y-5 max-w-[60ch]">
              <p className="font-inter text-[1.0625rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Hack &amp; Hunt is a technical challenge where teams will think, decode, build, solve and hunt their way through a series of challenges.
              </p>
              <p className="font-inter text-[1.0625rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Participants will need technical knowledge, creativity, teamwork, speed and problem-solving skills to progress.
              </p>
            </div>

            {/* Tags row */}
            <div className="flex flex-wrap gap-3 mt-10">
              {['TECHNICAL', 'COMPETITIVE', 'TEAM EVENT', 'VIGYANTRA 2026'].map(tag => (
                <span
                  key={tag}
                  className="label-mono px-3 py-1.5"
                  style={{ border: '1px solid var(--line-strong)', borderRadius: '2px' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom coordinate row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 pt-6 flex justify-between items-center"
          style={{ borderTop: '1px solid var(--line)' }}
        >
          <span className="label-mono opacity-25">SEC.02 / ABOUT / SJBIT</span>
          <span className="label-mono opacity-20">30.10.2026</span>
        </motion.div>
      </div>
    </section>
  );
}
