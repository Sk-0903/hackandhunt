import { useState, useEffect, useRef } from 'react';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

/**
 * Drift-proof countdown. Recalculates from Date.now() each tick.
 * Target should be an ISO 8601 string with explicit +05:30 offset so
 * the countdown is correct for every visitor regardless of their timezone.
 */
export function useCountdown(targetISO: string): Countdown {
  const target = useRef(new Date(targetISO).getTime());

  const calc = (): Countdown => {
    const diff = target.current - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    const s = Math.floor(diff / 1000);
    return {
      days:    Math.floor(s / 86400),
      hours:   Math.floor((s % 86400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60,
      isExpired: false,
    };
  };

  const [value, setValue] = useState<Countdown>(calc);

  useEffect(() => {
    // Drift-proof: schedule each tick based on actual elapsed time
    let id: ReturnType<typeof setTimeout>;

    const tick = () => {
      setValue(calc());
      const now = Date.now();
      const msToNextSecond = 1000 - (now % 1000);
      id = setTimeout(tick, msToNextSecond);
    };

    const msToNextSecond = 1000 - (Date.now() % 1000);
    id = setTimeout(tick, msToNextSecond);
    return () => clearTimeout(id);
  }, []);

  return value;
}
