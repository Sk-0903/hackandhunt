// ─────────────────────────────────────────────────────────────────────────────
//  VIGYANTRA 2026 — EVENT CONFIGURATION
//  Single source of truth. Edit values here only.
//  No event text is hardcoded in any component.
// ─────────────────────────────────────────────────────────────────────────────

export const EVENT_CONFIG = {
  // ── Identity ────────────────────────────────────────────────────────────────
  techFest:   'VIGYANTRA 2026',
  eventName:  'Hack & Hunt',
  eventTitle: 'HACK & HUNT',
  college:    'SJB INSTITUTE OF TECHNOLOGY',
  eventType:  'Technical',

  // ── Dates ──────────────────────────────────────────────────────────────────
  date:          '30 October 2026',
  /** ISO 8601 with explicit IST offset (+05:30). Countdown targets this. */
  eventDateISO:  '2026-10-30T00:00:00+05:30',

  // ── Venue ──────────────────────────────────────────────────────────────────
  venue: 'SJB Institute of Technology, Bengaluru',

  // ── Prize ──────────────────────────────────────────────────────────────────
  prizePool:   '₹50,000',
  prizeAmount: 50_000,   // numeric, for count-up animation

  // ── Registration ────────────────────────────────────────────────────────────
  // ⚠️  Change registrationUrl from '#' to your Google Form URL to enable the button.
  // Change registrationStatus to 'open' at the same time.
  registrationUrl:    '#',
  registrationStatus: 'opening-soon' as 'open' | 'opening-soon' | 'closed',

  // ── Coordinators ───────────────────────────────────────────────────────────
  coordinators: {
    students: [
      { name: '', phone: '' },
      { name: '', phone: '' },
      { name: '', phone: '' },
      { name: '', phone: '' },
    ],
    faculty: [
      { name: '', dept: '' },
      { name: '', dept: '' },
    ],
  },

  // ── Social Links ───────────────────────────────────────────────────────────
  socialLinks: {
    instagram: 'https://instagram.com/vigyantra_sjbit',
    email:     'vigyantra@sjbit.edu.in',
  },

  // ── Challenge journey checkpoints ──────────────────────────────────────────
  journey: [
    { num: '01', title: 'ENTER',   line: 'Teams are admitted into the system. The challenge begins.' },
    { num: '02', title: 'DECODE',  line: 'Encrypted signals. Solve what others cannot read.' },
    { num: '03', title: 'BUILD',   line: 'Construct solutions under pressure. Code. Create. Deploy.' },
    { num: '04', title: 'HUNT',    line: 'Follow the trail. Every clue leads deeper into the system.' },
    { num: '05', title: 'SURVIVE', line: 'Not every team will make it past this point.' },
    { num: '06', title: 'CONQUER', line: 'One team. One winner. Break the system. Claim the prize.' },
  ],

  // ── FAQ ─────────────────────────────────────────────────────────────────────
  faq: [
    {
      q: 'What is Hack & Hunt?',
      a: 'Hack & Hunt is a technical challenge event at VIGYANTRA 2026 where teams think, decode, build, solve and hunt through a series of multi-stage challenges. It combines hackathon and treasure-hunt elements into one high-stakes competition.',
    },
    {
      q: 'When is Hack & Hunt?',
      a: 'Hack & Hunt takes place on 30 October 2026. The exact schedule will be announced soon.',
    },
    {
      q: 'Where will the event take place?',
      a: 'The event will be held at SJB Institute of Technology, Bengaluru. Detailed venue instructions will be shared closer to the event.',
    },
    {
      q: 'What is the prize pool?',
      a: 'The total prize pool is ₹50,000. The distribution across winners will be announced soon.',
    },
    {
      q: 'When will registrations open?',
      a: 'Registrations are opening soon. Follow our official channels for the announcement.',
    },
    {
      q: 'Can students from other colleges participate?',
      a: 'Details about eligibility and participation criteria will be announced soon.',
    },
  ],

  // ── Tagline ────────────────────────────────────────────────────────────────
  tagline: ['ENTER THE SYSTEM.', 'FOLLOW THE CLUES.', 'BREAK THE CODE.'],
} as const;

export type EventConfig = typeof EVENT_CONFIG;
export type RegistrationStatus = EventConfig['registrationStatus'];
