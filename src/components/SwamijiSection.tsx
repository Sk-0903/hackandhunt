import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import SectionLabel from './ui/SectionLabel';
import { RevealLine } from './ui/Reveal';

interface Swamiji {
  id: string;
  shortName: string;
  name: string;
  title: string;
  role: string;
  institution: string;
  image: string;
  blessing: string;
  highlight: string;
}

const SWAMIJIS: Swamiji[] = [
  {
    id: 'swamiji-1',
    shortName: 'Dr. Balagangadharanatha Maha Swamiji',
    name: 'His Divine Soul Jagadguru Sri Sri Sri Dr. Balagangadharanatha Maha Swamiji',
    title: '71st Pontiff of Sri Adichunchanagiri Mahasamsthana Math',
    role: 'FOUNDER PRESIDENT',
    institution: 'Sri Adichunchanagiri Shikshana Trust®',
    image: '/images/swamiji-1.png',
    blessing:
      'Wisdom rooted in selfless service (Seva) and righteous knowledge is the true foundation of human progress. May this technological confluence illuminate young minds with purpose.',
    highlight: 'Pioneer of Educational Renaissance',
  },
  {
    id: 'swamiji-2',
    shortName: 'Dr. Nirmalanandanatha Maha Swamiji',
    name: 'Jagadguru Sri Sri Sri Dr. Nirmalanandanatha Maha Swamiji',
    title: '72nd Pontiff of Sri Adichunchanagiri Mahasamsthana Math',
    role: 'PRESIDENT',
    institution: 'Sri Adichunchanagiri Shikshana Trust®',
    image: '/images/swamiji-2.png',
    blessing:
      'Harmonize ancient spiritual values with cutting-edge scientific innovation. Technology must serve humanity with ethics, empathy, and uncompromising excellence.',
    highlight: 'Visionary Patron of Science & Technology',
  },
  {
    id: 'swamiji-3',
    shortName: 'Dr. Prakashnath Swamiji',
    name: 'Revered Sri Sri Dr. Prakashnath Swamiji',
    title: 'Guiding Light of BGS & SJB Institutions',
    role: 'MANAGING DIRECTOR',
    institution: 'SJB & BGS Group of Institutions',
    image: '/images/swamiji-3.png',
    blessing:
      'Nurturing youth to think fearlessly, build with passion, and lead with character. May the participants of Hack & Hunt unlock transformative breakthroughs.',
    highlight: 'Architect of Technical & Academic Excellence',
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const AUTO_PLAY_INTERVAL = 3000; // 3 seconds per Swamiji

export default function SwamijiSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSwamiji = SWAMIJIS[activeIndex];

  // Non-stop automatic sliding
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SWAMIJIS.length);
    }, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (idx: number) => {
    setActiveIndex(idx);
  };

  return (
    <section
      id="heritage"
      ref={sectionRef}
      className="section-y relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #050806 0%, #0A0F0C 50%, #050806 100%)',
      }}
      aria-labelledby="heritage-heading"
    >
      {/* Top golden-green accent hairline */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(234, 179, 8, 0.35), rgba(0, 230, 118, 0.4), transparent)',
        }}
        aria-hidden="true"
      />

      {/* Radiant celestial golden aura behind the sanctum */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 35%, rgba(234, 179, 8, 0.07) 0%, rgba(0, 230, 118, 0.02) 45%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* Floating sacred particle aura (CSS subtle ambient dust) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none coord-grid" aria-hidden="true" />

      <div className="container-site relative z-10">
        
        {/* Sacred Traditional Invocation Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center text-center mb-6"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-amber-500/25 bg-amber-500/[0.04] backdrop-blur-md mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] sm:text-[12px] font-semibold tracking-[0.16em] text-amber-300 font-sans">
              || ಜೈ ಶ್ರೀ ಗುರುದೇವ್ || ಶ್ರೀ ಗುರುಭ್ಯೋ ನಮಃ
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          </div>

          <span className="label-mono text-[10.5px] sm:text-[12px] tracking-[0.22em] text-white/50 uppercase font-medium">
            WITH THE DIVINE BLESSINGS OF THE REVERED GURUS
          </span>
        </motion.div>

        {/* Section Heading & View Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <SectionLabel index="01" label="INSTITUTIONAL HERITAGE" coord="SRI ADICHUNCHANAGIRI SHIKSHANA TRUST" />
            </motion.div>

            <h2 id="heritage-heading" className="sr-only">
              Divine Blessings of the Jagadgurus — Rooted in Values, Driven by Innovation
            </h2>

            <div className="space-y-1">
              <RevealLine delay={0.08}>
                <span
                  className="block font-grotesk font-semibold text-section leading-none tracking-tight"
                  style={{ color: 'var(--text)' }}
                >
                  DIVINE BLESSINGS.
                </span>
              </RevealLine>
              <RevealLine delay={0.18}>
                <span
                  className="block font-grotesk font-semibold text-section leading-none tracking-tight"
                  style={{
                    color: '#F59E0B',
                    textShadow: '0 0 30px rgba(245, 158, 11, 0.25)',
                  }}
                >
                  INFINITE INSPIRATION.
                </span>
              </RevealLine>
            </div>
          </div>

          {/* Automatic Slideshow Live Badge */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <div className="inline-flex items-center gap-2.5 px-3 sm:px-4 py-1.5 rounded-[2px] bg-black/60 border border-amber-500/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="label-mono text-[9.5px] sm:text-[10px] tracking-widest text-amber-300 font-semibold uppercase">
                AUTO-SLIDING SHOWCASE
              </span>
              <span className="text-white/20">|</span>
              <span className="label-mono text-[9px] sm:text-[9.5px] text-white/50">
                0{activeIndex + 1} / 0{SWAMIJIS.length}
              </span>
            </div>
          </div>
        </div>

        {/* ── AUTOMATIC SACRED SLIDESHOW SHOWCASE ── */}
        <div className="relative">
          {/* Quick Swamiji Stage Indicators with Auto Progress Bar */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-4 mb-6 sm:mb-8">
            {SWAMIJIS.map((s, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelect(idx)}
                  className={`group relative text-center sm:text-left p-2 sm:p-4 rounded-[2px] border transition-all duration-300 flex flex-col sm:flex-row items-center gap-2 sm:gap-3.5 overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-b sm:bg-gradient-to-r from-amber-950/40 to-black/70 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                      : 'bg-black/40 border-white/[0.08] hover:border-white/20 hover:bg-black/60'
                  }`}
                >
                  {/* Per-card auto progress bar indicator */}
                  {isSelected && (
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10 overflow-hidden">
                      <motion.div
                        key={activeIndex}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: 'linear' }}
                        className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                      />
                    </div>
                  )}

                  {/* Small avatar thumbnail */}
                  <div
                    className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 border transition-all ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.4)] scale-105 sm:scale-100'
                        : 'border-white/20 opacity-70 group-hover:opacity-100'
                    }`}
                  >
                    <img
                      src={s.image}
                      alt={s.shortName}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="min-w-0 flex-1 w-full">
                    <span
                      className={`label-mono text-[7px] xs:text-[8px] sm:text-[8.5px] block font-semibold tracking-wider uppercase transition-colors truncate ${
                        isSelected ? 'text-amber-400' : 'text-white/40'
                      }`}
                    >
                      {s.role}
                    </span>
                    <h3
                      className={`font-grotesk font-semibold text-[10.5px] xs:text-xs sm:text-sm truncate transition-colors ${
                        isSelected ? 'text-white' : 'text-white/70 group-hover:text-white'
                      }`}
                    >
                      {s.shortName}
                    </h3>
                  </div>

                  {/* Active indicator dot */}
                  {isSelected && (
                    <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 animate-ping" />
                  )}
                  {isSelected && (
                    <span className="sm:hidden absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Majestic Sliding Showcase Card */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSwamiji.id}
                initial={{ opacity: 0, x: 70 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -70 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="relative rounded-[2px] p-4 sm:p-8 md:p-10 overflow-hidden border border-amber-500/30 backdrop-blur-md"
                style={{
                  background:
                    'radial-gradient(ellipse 90% 70% at 30% 40%, rgba(245, 158, 11, 0.08) 0%, rgba(5, 8, 6, 0.95) 75%)',
                }}
              >
                {/* Ornate Gold Corner Brackets */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-400/70" aria-hidden="true" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-400/70" aria-hidden="true" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-400/70" aria-hidden="true" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-400/70" aria-hidden="true" />

                {/* Subtle Background Glow behind active Guru */}
                <div
                  className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full pointer-events-none opacity-20"
                  style={{
                    background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                  }}
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                  
                  {/* Left: Glorious High-Definition Framed Portrait with Halo */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    <div className="relative w-full max-w-[240px] xs:max-w-[280px] sm:max-w-[320px] aspect-[4/5] rounded-[2px] overflow-hidden border border-amber-400/40 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_35px_rgba(245,158,11,0.2)] bg-[#070B08] group">
                      
                      {/* Golden Halo Behind Head */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity"
                        style={{
                          background:
                            'radial-gradient(circle at 50% 32%, rgba(245, 158, 11, 0.5) 0%, rgba(217, 119, 6, 0.2) 40%, transparent 70%)',
                        }}
                        aria-hidden="true"
                      />

                      {/* Portrait Image */}
                      <img
                        src={activeSwamiji.image}
                        alt={activeSwamiji.name}
                        className="w-full h-full object-cover object-top select-none transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Golden Bottom Gradient Overlay */}
                      <div
                        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
                        style={{
                          background: 'linear-gradient(to top, rgba(7, 11, 8, 0.95) 0%, transparent 100%)',
                        }}
                        aria-hidden="true"
                      />

                      {/* Role Chip Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 text-center">
                        <span className="inline-block px-3 py-1 rounded-[2px] bg-amber-500/20 border border-amber-400/40 label-mono text-[9px] sm:text-[9.5px] font-semibold text-amber-300 tracking-widest backdrop-blur-md">
                          {activeSwamiji.role}
                        </span>
                      </div>
                    </div>

                    {/* Automatic Slide Indicator under portrait */}
                    <div className="flex items-center gap-2 mt-4 px-3 py-1 rounded-[2px] bg-black/50 border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      <span className="label-mono text-[9px] text-amber-300 tracking-wider">
                        SACRED STAGE 0{activeIndex + 1} OF 0{SWAMIJIS.length}
                      </span>
                    </div>
                  </div>

                  {/* Right: Sacred Biography, Vision & Divine Message */}
                  <div className="md:col-span-7 flex flex-col justify-center space-y-5 text-left">
                    
                    {/* Institution & Highlight Tag */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="label-mono text-[9.5px] sm:text-[10px] px-2.5 py-0.5 rounded-[2px] bg-amber-400/10 text-amber-300 border border-amber-400/30">
                        {activeSwamiji.highlight}
                      </span>
                      <span className="text-white/20">·</span>
                      <span className="label-mono text-[9.5px] sm:text-[10px] text-white/50 tracking-wider">
                        {activeSwamiji.institution}
                      </span>
                    </div>

                    {/* Holy Name */}
                    <h3 className="font-grotesk font-bold text-xl sm:text-2xl md:text-3xl text-white tracking-tight leading-snug">
                      {activeSwamiji.name}
                    </h3>

                    {/* Title / Pontifical lineage */}
                    <p className="font-inter text-sm sm:text-base text-amber-200/80 font-medium">
                      {activeSwamiji.title}
                    </p>

                    {/* Divine Blessing Quote Box */}
                    <div className="relative p-5 sm:p-6 rounded-[2px] bg-black/60 border-l-2 border-amber-400 border-t border-r border-b border-white/[0.06] mt-3">
                      <span className="absolute -top-3 left-4 px-2 py-0.5 bg-amber-500 text-black font-mono font-bold text-[8.5px] tracking-widest uppercase rounded-[1px]">
                        DIVINE BLESSING FOR VIGYANTRA '26
                      </span>
                      <p className="font-inter italic text-sm sm:text-base text-white/90 leading-relaxed pt-1">
                        "{activeSwamiji.blessing}"
                      </p>
                    </div>

                    {/* Ethos Footer row */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="label-mono text-[9px] text-white/60">
                          SJB INSTITUTE OF TECHNOLOGY · SILVER JUBILEE 2026
                        </span>
                      </div>
                      <span className="label-mono text-[9px] text-amber-400/70">
                        SRI ADICHUNCHANAGIRI SHIKSHANA TRUST®
                      </span>
                    </div>

                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Transition into Hack & Hunt: Golden-Green signal line connector */}
        <div className="mt-14 md:mt-20 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="label-mono text-[9.5px] sm:text-[10px] tracking-widest text-text-muted opacity-60">
              DEVOTION · VALUES · INNOVATION
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>

          <div
            className="w-px h-14"
            style={{
              background: 'linear-gradient(to bottom, #F59E0B, var(--primary), var(--line))',
            }}
            aria-hidden="true"
          />
        </div>

      </div>
    </section>
  );
}

