import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { RegisterButton } from './ui/Button';
import SectionLabel from './ui/SectionLabel';
import CyberRadarHUD from './CyberRadarHUD';
import { EVENT_CONFIG } from '../data/eventConfig';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function RegistrationCTA() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const isOpen    = EVENT_CONFIG.registrationStatus === 'open';
  const isClosed  = EVENT_CONFIG.registrationStatus === 'closed';
  const isSoon    = EVENT_CONFIG.registrationStatus === 'opening-soon';

  return (
    <section
      id="registration"
      ref={ref}
      className="section-y relative overflow-hidden"
      style={{ background: 'var(--surface)' }}
      aria-labelledby="reg-heading"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(0,230,118,0.05) 0%, transparent 70%)' }}
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
          className="mb-12"
        >
          <SectionLabel index="06" label="REGISTRATION" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7">
            {/* Heading */}
            <div className="mb-8 overflow-hidden">
              <motion.h2
                id="reg-heading"
                initial={{ y: '105%' }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
                className="font-grotesk font-semibold leading-none"
                style={{
                  fontSize: 'clamp(2.25rem, 7vw, 5.5rem)',
                  letterSpacing: '-0.03em',
                  color: 'var(--text)',
                }}
              >
                READY TO ENTER
                <br />
                <span style={{ color: 'var(--primary)' }}>THE HUNT?</span>
              </motion.h2>
            </div>

            {/* Body */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              className="space-y-1.5 mb-10"
            >
              {[
                'Assemble your team.',
                'Prepare your skills.',
                `The hunt begins on ${EVENT_CONFIG.date}.`,
              ].map(line => (
                <p key={line} className="font-inter" style={{ fontSize: '1.0625rem', color: 'var(--text-muted)' }}>
                  {line}
                </p>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
              className="flex flex-col items-start gap-4"
            >
              <RegisterButton
                label="REGISTER FOR HACK & HUNT"
                className="text-[0.7rem] px-6 sm:px-8 py-4 w-full sm:w-auto justify-center"
              />

              {/* Status line — auto-updates from config */}
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: isOpen ? 'var(--primary)' : 'var(--text-muted)',
                    animation: isOpen ? 'pulse 1.5s infinite' : 'none',
                  }}
                  aria-hidden="true"
                />
                <span className="label-mono" style={{ opacity: 0.5 }}>
                  {isOpen   && 'REGISTRATIONS OPEN — APPLY NOW'}
                  {isSoon   && 'REGISTRATIONS OPENING SOON'}
                  {isClosed && 'REGISTRATIONS CLOSED'}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right: Cyber Radar HUD */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <CyberRadarHUD />
          </div>
        </div>
      </div>
    </section>
  );
}
