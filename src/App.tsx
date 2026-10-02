import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import VideoEntrance from './components/VideoEntrance';
import InstitutionalHeader from './components/InstitutionalHeader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SwamijiSection from './components/SwamijiSection';
import About from './components/About';
import ChallengeJourney from './components/ChallengeJourney';
import EventDetails from './components/EventDetails';
import PrizePool from './components/PrizePool';
import Countdown from './components/Countdown';
import RegistrationCTA from './components/RegistrationCTA';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';

// ── Scroll signal line (left edge fill) ──────────────────────────────────────
function SignalLine() {
  const { scrollYProgress } = useScroll();
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      className="fixed left-0 top-0 h-screen z-40 pointer-events-none"
      style={{ width: '1px', background: 'var(--line)' }}
      aria-hidden="true"
    >
      <motion.div
        style={{ scaleY, transformOrigin: 'top', height: '100%' }}
        className="absolute inset-0"
        aria-label="Scroll progress"
      >
        <div style={{ height: '100%', background: 'linear-gradient(to bottom, var(--primary), var(--muted-green))' }} />
      </motion.div>
    </div>
  );
}

// ── "type hunt" scan line Easter egg ─────────────────────────────────────────
function useHuntEgg(onTrigger: () => void) {
  const buf = useRef('');
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return;
      buf.current = (buf.current + e.key.toLowerCase()).slice(-4);
      if (buf.current === 'hunt') { onTrigger(); buf.current = ''; }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onTrigger]);
}

function ScanLine({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <motion.div
      key={Date.now()}
      initial={{ top: '-4px', opacity: 0.8 }}
      animate={{ top: '100vh', opacity: 0 }}
      transition={{ duration: 0.7, ease: 'linear' }}
      className="fixed left-0 right-0 z-[9996] pointer-events-none"
      style={{ height: '2px', background: 'linear-gradient(90deg, transparent, var(--primary), transparent)', mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
}

// ── Film grain noise overlay ──────────────────────────────────────────────────
function Noise() {
  return (
    <div className="noise" role="presentation" aria-hidden="true" />
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [scanKey,  setScanKey]    = useState<number | null>(null);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y > 60) setHeaderScrolled(true);
          else if (y < 20) setHeaderScrolled(false);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const triggerScan = useCallback(() => {
    setScanKey(Date.now());
    setTimeout(() => setScanKey(null), 900);
  }, []);

  useHuntEgg(triggerScan);

  return (
    <>
      {/* 3s Cinematic "HACK & HUNT" Entrance Animation */}
      {!introDone && (
        <VideoEntrance
          duration={3.6}
          onComplete={() => setIntroDone(true)}
        />
      )}

      {/* Persistent overlays */}
      <Noise />
      <CustomCursor />
      <SignalLine />
      {scanKey && <ScanLine visible key={scanKey} />}

      {/* Main Site Container */}
      <div className="w-full min-h-screen">
        {/* Unified Sticky Header: Institutional Identity + Event Navigation */}
        <div className="sticky top-0 left-0 right-0 z-50">
          <InstitutionalHeader scrolled={headerScrolled} />
          <Navbar scrolled={headerScrolled} />
        </div>

        <main id="main" tabIndex={-1}>
          <Hero />
          <SwamijiSection />
          <About />
          <ChallengeJourney />
          <EventDetails />
          <PrizePool />
          <Countdown />
          <RegistrationCTA />
          <FAQ />
          <Contact />
        </main>

        <Footer />
      </div>
    </>
  );
}
