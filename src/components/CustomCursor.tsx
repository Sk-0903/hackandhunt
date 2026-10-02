import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const lblRef  = useRef<HTMLSpanElement>(null);
  const pos     = useRef({ x: 0, y: 0 });
  const ring    = useRef({ x: 0, y: 0 });
  const raf     = useRef(0);
  const [state, setState] = useState<'default' | 'hover' | 'register'>('default');
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);  // pointer down

  useEffect(() => {
    // Disable on coarse pointer / touch
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      setVisible(true);

      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el?.closest('[data-cursor="register"]')) setState('register');
      else if (el?.closest('a, button, [role="button"], [data-hover], label, select, input[type="submit"]'))
        setState('hover');
      else setState('default');
    };

    const onLeave  = () => setVisible(false);
    const onDown   = () => setActive(true);
    const onUp     = () => setActive(false);

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

    const loop = () => {
      const lp = 0.11;
      ring.current.x += (pos.current.x - ring.current.x) * lp;
      ring.current.y += (pos.current.y - ring.current.y) * lp;

      dotRef.current!.style.transform  = `translate(${pos.current.x}px,${pos.current.y}px)`;
      ringRef.current!.style.transform = `translate(${ring.current.x}px,${ring.current.y}px)`;
      if (lblRef.current) {
        lblRef.current.style.transform = `translate(${pos.current.x + 18}px,${pos.current.y + 2}px)`;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const isHover    = state === 'hover';
  const isRegister = state === 'register';

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ willChange: 'transform', opacity: visible ? 1 : 0 }}
      >
        <div style={{
          width:  active ? '4px' : isHover || isRegister ? '5px' : '6px',
          height: active ? '4px' : isHover || isRegister ? '5px' : '6px',
          borderRadius: '50%',
          background: 'var(--primary)',
          transform: 'translate(-50%,-50%)',
          transition: 'width 0.15s, height 0.15s',
          opacity: isRegister ? 0.7 : 1,
        }} />
      </div>

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{ willChange: 'transform', opacity: visible ? 1 : 0 }}
      >
        <div style={{
          width:  isRegister ? '38px' : isHover ? '30px' : '22px',
          height: isRegister ? '38px' : isHover ? '30px' : '22px',
          borderRadius: '50%',
          border: `1px solid ${isRegister ? 'var(--primary)' : isHover ? 'rgba(0,230,118,0.6)' : 'rgba(99,217,157,0.35)'}`,
          transform: 'translate(-50%,-50%)',
          transition: 'width 0.2s var(--ease), height 0.2s var(--ease), border-color 0.15s',
        }} />
      </div>

      {/* ENTER label on register */}
      <span
        ref={lblRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997] label-mono"
        style={{
          willChange: 'transform',
          opacity: isRegister && visible ? 1 : 0,
          transition: 'opacity 0.15s',
          color: 'var(--primary)',
          fontSize: '8px',
        }}
      >
        ENTER
      </span>
    </>
  );
}
