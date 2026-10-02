interface InstitutionalHeaderProps {
  scrolled?: boolean;
}

export default function InstitutionalHeader({ scrolled = false }: InstitutionalHeaderProps) {
  return (
    <div
      className="relative w-full transition-colors duration-200"
      style={{
        background: scrolled ? 'rgba(5, 8, 6, 0.98)' : 'rgba(5, 8, 6, 0.94)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(242, 245, 243, 0.08)',
      }}
      aria-label="Institutional Identity — SJB Institute of Technology"
    >
      {/* Very faint background grid for seamless cohesion with the site */}
      <div className="absolute inset-0 coord-grid opacity-10 pointer-events-none" aria-hidden="true" />

      <div className="container-site relative z-10 py-1.5 sm:py-2.5">
        <div className="flex items-center justify-between gap-2.5 sm:gap-4 md:gap-6">
          
          {/* Logo + Institutional Title Group */}
          <div className="flex items-center gap-2.5 sm:gap-4 md:gap-5 min-w-0">
            {/* Official SJBIT Logo */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <img
                src="/images/sjbit-logo.png"
                alt="SJB Institute of Technology Official Emblem"
                className="h-8 xs:h-9 sm:h-12 w-auto object-contain select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
                loading="eager"
              />
            </div>

            {/* Institutional Hierarchy Text */}
            <div className="flex flex-col justify-center text-left min-w-0">
              {/* Sacred Invocation + Trust */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span
                  className="font-medium tracking-[0.14em] sm:tracking-[0.16em] select-none font-sans text-[#FFB020] text-[9px] sm:text-[11px] truncate"
                >
                  || ಜೈ ಶ್ರೀ ಗುರುದೇವ್ || JAI SRI GURUDEV
                </span>
                <span className="hidden sm:inline text-white/20">·</span>
                <span
                  className="hidden sm:inline font-inter text-xs tracking-wide text-gray-300"
                >
                  Sri Adichunchanagiri Shikshana Trust®
                </span>
              </div>

              {/* College Main Title */}
              <h1
                className="font-grotesk font-bold tracking-tight leading-tight text-[#FF7A30] text-[13px] xs:text-sm sm:text-base md:text-xl truncate"
              >
                SJB INSTITUTE OF TECHNOLOGY
              </h1>

              {/* Autonomous Affiliation Subtext */}
              <p
                className="label-mono uppercase tracking-wider text-[#8C9891] opacity-75 text-[7px] xs:text-[8px] sm:text-[9.5px] leading-tight truncate"
              >
                AN AUTONOMOUS INSTITUTE UNDER VISVESVARAYA TECHNOLOGICAL UNIVERSITY
              </p>
            </div>
          </div>

          {/* Right Institutional Accreditation Badges (Desktop) */}
          <div className="hidden lg:flex flex-col items-end justify-center pl-6 border-l border-white/[0.08] space-y-1">
            <span
              className="label-mono font-semibold tracking-widest uppercase px-2.5 py-0.5 rounded-[2px] text-[8.5px] sm:text-[9.5px] bg-white/[0.04] border border-white/10 text-white"
            >
              NAAC A+ ACCREDITED
            </span>
            <span
              className="label-mono text-[8.5px] tracking-wider uppercase text-[#8C9891] opacity-60"
            >
              APPROVED BY AICTE, NEW DELHI
            </span>
          </div>

        </div>
      </div>

      {/* Fine separator between institution and event navbar */}
      <div
        className="h-px w-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0, 230, 118, 0.25), transparent)',
        }}
      />
    </div>
  );
}
