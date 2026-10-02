import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, type MotionValue } from 'framer-motion';
import SectionLabel from './ui/SectionLabel';
import { EVENT_CONFIG } from '../data/eventConfig';

const EASE = [0.22, 1, 0.36, 1] as const;

interface CheckpointProps {
  item: typeof EVENT_CONFIG.journey[number];
  index: number;
  pathProgress: MotionValue<number>;
}

function Checkpoint({ item, index, pathProgress }: CheckpointProps) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const n      = EVENT_CONFIG.journey.length;
  const isLeft = index % 2 === 0;

  // This checkpoint lights up when pathProgress passes its position
  const threshold = index / (n - 1);
  const dotColor  = useTransform(
    pathProgress,
    [Math.max(0, threshold - 0.05), threshold + 0.05],
    ['rgba(0,230,118,0.2)', 'rgba(0,230,118,1)']
  );

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-[36px_1fr] md:grid-cols-[1fr_56px_1fr] items-center gap-3 md:gap-4 my-2 md:my-0"
      style={{ minHeight: '90px' }}
    >
      {/* Left content (desktop only for even index, hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
        className={`hidden md:block ${isLeft ? '' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!isLeft}
      >
        {isLeft && <CheckpointContent item={item} />}
      </motion.div>

      {/* Node indicator */}
      <div className="flex flex-col items-center justify-center self-stretch">
        <motion.div
          style={{ backgroundColor: dotColor, borderColor: dotColor }}
          className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border flex-shrink-0"
          animate={inView ? { scale: [0, 1.2, 1] } : {}}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.2, ease: 'backOut' }}
        />
      </div>

      {/* Right content: Shown on mobile for ALL indexes; on desktop only for odd indexes */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
        className={`block md:${!isLeft ? 'block' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={false}
      >
        <div className="md:hidden">
          <CheckpointContent item={item} />
        </div>
        <div className="hidden md:block">
          {!isLeft && <CheckpointContent item={item} />}
        </div>
      </motion.div>
    </div>
  );
}

function CheckpointContent({ item }: { item: typeof EVENT_CONFIG.journey[number] }) {
  return (
    <div>
      <span className="label-mono block mb-1" style={{ color: 'var(--primary)', opacity: 0.7 }}>
        {item.num}
      </span>
      <p
        className="font-grotesk font-semibold leading-none mb-2"
        style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', color: 'var(--text)', letterSpacing: '-0.02em' }}
      >
        {item.title}
      </p>
      <p className="font-inter text-sm leading-relaxed" style={{ color: 'var(--text-muted)', maxWidth: '30ch' }}>
        {item.line}
      </p>
    </div>
  );
}

export default function ChallengeJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef    = useRef<SVGPathElement>(null);
  const isInView   = useInView(sectionRef, { once: true, margin: '-80px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end 30%'],
  });

  // pathLength 0→1 drives the stroke-dashoffset
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const n = EVENT_CONFIG.journey.length;
  const SVG_H = 90 * n;

  return (
    <section
      id="challenge"
      ref={sectionRef}
      className="section-y relative overflow-hidden"
      style={{ background: 'var(--surface)' }}
      aria-labelledby="challenge-heading"
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--line-strong), transparent)' }}
        aria-hidden="true"
      />

      <div className="container-site">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <SectionLabel index="03" label="CHALLENGE JOURNEY" coord="SECTOR 03" className="mb-6" />
          <h2
            id="challenge-heading"
            className="font-grotesk font-semibold"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.03em', color: 'var(--text)' }}
          >
            THE JOURNEY
          </h2>
        </motion.div>

        {/* Journey layout with SVG center line */}
        <div className="relative">
          {/* SVG path — left aligned on mobile, centered on desktop */}
          <div
            className="absolute top-0 left-[17.5px] md:left-[calc(50%-0.5px)]"
            style={{
              width: '1px',
              height: `${SVG_H}px`,
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          >
            <svg
              viewBox={`0 0 1 ${SVG_H}`}
              preserveAspectRatio="none"
              className="w-full h-full"
              style={{ overflow: 'visible' }}
            >
              {/* Background line */}
              <line
                x1="0.5" y1="0" x2="0.5" y2={SVG_H}
                stroke="var(--line-strong)"
                strokeWidth="1"
              />
              {/* Animated fill line */}
              <motion.line
                x1="0.5" y1="0" x2="0.5" y2={SVG_H}
                stroke="var(--primary)"
                strokeWidth="1"
                strokeLinecap="round"
                style={{ pathLength }}
                initial={{ pathLength: 0 }}
              />
            </svg>
          </div>

          {/* Checkpoint rows */}
          <div className="flex flex-col">
            {EVENT_CONFIG.journey.map((item, i) => (
              <Checkpoint
                key={item.num}
                item={item}
                index={i}
                pathProgress={pathLength}
              />
            ))}
          </div>
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 pt-8 flex items-start gap-3"
          style={{ borderTop: '1px solid var(--line)' }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
            style={{ background: 'var(--primary)', animation: 'pulse 2s infinite' }}
          />
          <p className="label-mono leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Detailed round structure will be revealed soon.
            <span className="opacity-40 ml-2">/ VIGYANTRA 2026 / 30.10</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
