import type { ReactNode } from 'react';
import { EVENT_CONFIG } from '../../data/eventConfig';

interface ButtonProps {
  variant?: 'primary' | 'outline';
  children: ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
  'data-cursor'?: string;
  target?: string;
  rel?: string;
  id?: string;
}

export default function Button({
  variant = 'primary',
  children,
  href,
  onClick,
  disabled = false,
  className = '',
  'data-cursor': dataCursor,
  target,
  rel,
  id,
}: ButtonProps) {
  const cls = `btn btn-${variant} ${className}`;

  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        onClick={onClick}
        aria-disabled={disabled}
        data-cursor={dataCursor}
        target={target}
        rel={rel}
        id={id}
        className={cls}
        style={disabled ? { pointerEvents: 'none' } : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-cursor={dataCursor}
      id={id}
      className={cls}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}

/** The site-wide Register button — reads from eventConfig */
export function RegisterButton({ className = '', label = 'REGISTER NOW' }: { className?: string; label?: string }) {
  const { registrationUrl, registrationStatus } = EVENT_CONFIG;
  const isOpen = registrationStatus === 'open' && registrationUrl !== '#';

  const handleClick = (e: React.MouseEvent) => {
    if (!isOpen) {
      e.preventDefault();
      document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Button
      variant="primary"
      href={isOpen ? registrationUrl : '#registration'}
      onClick={handleClick}
      data-cursor="register"
      target={isOpen ? '_blank' : undefined}
      rel={isOpen ? 'noopener noreferrer' : undefined}
      className={className}
    >
      {label}
    </Button>
  );
}
