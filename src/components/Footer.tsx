import { EVENT_CONFIG } from '../data/eventConfig';

export default function Footer() {
  return (
    <footer
      className="relative pt-16 pb-28 md:pb-16 overflow-hidden"
      style={{ borderTop: '1px solid var(--line)' }}
    >
      {/* Large faded wordmark */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="font-grotesk font-black whitespace-nowrap"
          style={{
            fontSize: 'clamp(4rem, 15vw, 12rem)',
            color: 'var(--text)',
            opacity: 0.025,
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          {EVENT_CONFIG.techFest}
        </span>
      </div>

      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-12 items-start">

          {/* Brand block */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/vigyantra-logo.png"
                alt="Vigyantra 2026 Logo"
                className="h-11 w-auto object-contain select-none"
              />
              <div>
                <span className="label-mono font-semibold block" style={{ color: 'var(--primary)', opacity: 0.9 }}>
                  {EVENT_CONFIG.techFest}
                </span>
                <span className="label-mono text-[9px] opacity-40 block">
                  SILVER JUBILEE YEAR 2026
                </span>
              </div>
            </div>
            <p
              className="font-grotesk font-semibold leading-none mb-2"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--text)', letterSpacing: '-0.02em' }}
            >
              HACK &amp; HUNT
            </p>
            <p className="label-mono opacity-40 mt-3">{EVENT_CONFIG.college}</p>
            <p className="label-mono opacity-25 mt-1">{EVENT_CONFIG.date}</p>
          </div>

          {/* Navigate */}
          <nav aria-label="Footer navigation">
            <p className="label-mono mb-4 opacity-40">NAVIGATE</p>
            <ul className="space-y-3 list-none">
              {[
                ['#home',         'HOME'],
                ['#challenge',    'CHALLENGE'],
                ['#prize',        'PRIZE'],
                ['#faq',          'FAQ'],
                ['#contact',      'CONTACT'],
              ].map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="label-mono hover:text-text transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    data-hover="true"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div>
            <p className="label-mono mb-4 opacity-40">CONNECT</p>
            <ul className="space-y-3 list-none">
              <li>
                <a
                  href={EVENT_CONFIG.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-mono hover:text-text transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  data-hover="true"
                >
                  INSTAGRAM
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EVENT_CONFIG.socialLinks.email}`}
                  className="label-mono hover:text-text transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  data-hover="true"
                >
                  EMAIL
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-16 pt-6"
          style={{ borderTop: '1px solid var(--line)' }}
        >
          <span className="label-mono opacity-25">BUILT FOR {EVENT_CONFIG.techFest}</span>
          <span className="label-mono opacity-15">SYS.STATUS: ONLINE</span>
        </div>
      </div>
    </footer>
  );
}
