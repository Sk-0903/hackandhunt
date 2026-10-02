interface InstitutionalHeaderProps {
  scrolled?: boolean;
}

export default function InstitutionalHeader({ scrolled = false }: InstitutionalHeaderProps) {
  return (
    <div
      className="relative w-full transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(7, 11, 8, 0.96)' : 'rgba(7, 11, 8, 0.98)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(242, 245, 243, 0.07)',
      }}
      aria-label="Institutional Identity — SJB Institute of Technology"
    >
      {/* Very faint background grid for seamless cohesion with the site */}
      <div className="absolute inset-0 coord-grid opacity-10 pointer-events-none" aria-hidden="true" />

      <div
        className="container-site relative z-10 transition-all duration-300"
        style={{
          paddingTop: scrolled ? '0.375rem' : '0.875rem',
          paddingBottom: scrolled ? '0.375rem' : '0.875rem',
        }}
      >
        <div className="flex items-center justify-between gap-3 md:gap-6">
          
          {/* Logo + Institutional Title Group */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            {/* Official SJBIT Logo (Clean, transparent, unclipped) */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <img
                src="/images/sjbit-logo.png"
                alt="SJB Institute of Technology Official Emblem"
                className="w-auto object-contain select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] transition-all duration-300"
                style={{
                  height: scrolled ? '2.1rem' : '3.5rem',
                }}
                loading="eager"
              />
            </div>

            {/* Institutional Hierarchy Text */}
            <div className="flex flex-col justify-center text-left">
              {/* Sacred Invocation + Trust (Inline on scroll / stacked when open) */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span
                  className="font-medium tracking-[0.16em] select-none transition-all duration-300 font-sans"
                  style={{
                    color: '#FFB020',
                    fontSize: scrolled ? '9.5px' : '11px',
                  }}
                >
                  || ಜೈ ಶ್ರೀ ಗುರುದೇವ್ || JAI SRI GURUDEV
                </span>
                {!scrolled && (
                  <>
                    <span className="hidden sm:inline text-white/20">·</span>
                    <span
                      className="hidden sm:inline font-inter text-xs tracking-wide"
                      style={{ color: '#D1D5DB' }}
                    >
                      Sri Adichunchanagiri Shikshana Trust®
                    </span>
                  </>
                )}
              </div>

              {/* College Main Title */}
              <h1
                className="font-grotesk font-bold tracking-tight leading-tight transition-all duration-300"
                style={{
                  color: '#FF7A30',
                  fontSize: scrolled
                    ? 'clamp(1rem, 2.5vw, 1.25rem)'
                    : 'clamp(1.15rem, 3.2vw, 1.65rem)',
                }}
              >
                SJB INSTITUTE OF TECHNOLOGY
              </h1>

              {/* Autonomous Affiliation Subtext */}
              <p
                className="label-mono uppercase tracking-wider opacity-70 transition-all duration-300"
                style={{
                  color: '#8C9891',
                  fontSize: scrolled ? '8px' : '9.5px',
                  display: scrolled ? 'none' : 'block',
                }}
              >
                AN AUTONOMOUS INSTITUTE UNDER VISVESVARAYA TECHNOLOGICAL UNIVERSITY
              </p>
            </div>
          </div>

          {/* Right Institutional Accreditation Badges (Desktop) */}
          <div className="hidden lg:flex flex-col items-end justify-center pl-6 border-l border-white/[0.08] space-y-1">
            <span
              className="label-mono font-semibold tracking-widest uppercase px-2.5 py-0.5 rounded-[2px] transition-all duration-300"
              style={{
                background: 'rgba(242, 245, 243, 0.04)',
                border: '1px solid rgba(242, 245, 243, 0.1)',
                color: 'var(--text)',
                fontSize: scrolled ? '8.5px' : '9.5px',
              }}
            >
              NAAC A+ ACCREDITED
            </span>
            {!scrolled && (
              <span
                className="label-mono text-[8.5px] tracking-wider uppercase opacity-50"
                style={{ color: '#8C9891' }}
              >
                APPROVED BY AICTE, NEW DELHI
              </span>
            )}
          </div>

        </div>
      </div>

      {/* Very fine separator between institution and event navbar */}
      <div
        className="h-px w-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0, 230, 118, 0.25), transparent)',
        }}
      />
    </div>
  );
}
