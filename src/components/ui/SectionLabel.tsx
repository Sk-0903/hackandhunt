interface SectionLabelProps {
  index: string;    // e.g. "01"
  label: string;    // e.g. "HERO"
  coord?: string;   // e.g. "12.9716° N, 77.5946° E"
  className?: string;
}

export default function SectionLabel({ index, label, coord, className = '' }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span
        className="label-mono"
        style={{ color: 'var(--primary)', opacity: 0.7 }}
      >
        {index.padStart(2, '0')}
      </span>
      <div className="w-4 h-px" style={{ background: 'var(--line-strong)' }} />
      <span className="label-mono">{label}</span>
      {coord && (
        <>
          <div className="hidden sm:block w-4 h-px" style={{ background: 'var(--line)' }} />
          <span className="label-mono hidden sm:block" style={{ opacity: 0.3 }}>{coord}</span>
        </>
      )}
    </div>
  );
}
