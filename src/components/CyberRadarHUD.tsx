import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface TargetNode {
  angle: number;
  dist: number;
  size: number;
  alpha: number;
  label: string;
}

export default function CyberRadarHUD() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    let sweepAngle = 0;

    const targets: TargetNode[] = [
      { angle: 0.8, dist: 0.45, size: 3.5, alpha: 0.9, label: 'NODE_ALPHA' },
      { angle: 2.1, dist: 0.72, size: 3, alpha: 0.7, label: 'TARGET_02' },
      { angle: 3.9, dist: 0.35, size: 4, alpha: 0.95, label: 'KEY_VAULT' },
      { angle: 5.2, dist: 0.65, size: 2.8, alpha: 0.6, label: 'BEACON_7' },
    ];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height || rect.width);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    io.observe(container);

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.42;

      ctx.clearRect(0, 0, w, h);

      if (!reduced) {
        sweepAngle = (time * 0.0018) % (Math.PI * 2);
      }

      // ── Concentric Range Rings ──
      const rings = [0.28, 0.52, 0.76, 1.0];
      for (const rMult of rings) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius * rMult, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 230, 118, 0.14)';
        ctx.lineWidth = 1;
        ctx.setLineDash(rMult === 1.0 ? [4, 4] : []);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Crosshairs
      ctx.strokeStyle = 'rgba(0, 230, 118, 0.15)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(cx - radius * 1.05, cy);
      ctx.lineTo(cx + radius * 1.05, cy);
      ctx.moveTo(cx, cy - radius * 1.05);
      ctx.lineTo(cx, cy + radius * 1.05);
      ctx.stroke();

      // Outer Degree Tick Marks
      ctx.strokeStyle = 'rgba(0, 230, 118, 0.3)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 36; i++) {
        const rad = (i * 10 * Math.PI) / 180;
        const len = i % 9 === 0 ? 8 : 4;
        const x1 = cx + Math.cos(rad) * (radius - len);
        const y1 = cy + Math.sin(rad) * (radius - len);
        const x2 = cx + Math.cos(rad) * radius;
        const y2 = cy + Math.sin(rad) * radius;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // ── Sweeping Radar Beam (Sector) ──
      const beamGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      beamGrad.addColorStop(0, 'rgba(0, 230, 118, 0.25)');
      beamGrad.addColorStop(1, 'rgba(0, 230, 118, 0.0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, sweepAngle - 0.5, sweepAngle);
      ctx.closePath();
      ctx.fillStyle = beamGrad;
      ctx.fill();

      // Sweeping Beam Leading Line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAngle) * radius, cy + Math.sin(sweepAngle) * radius);
      ctx.strokeStyle = 'rgba(22, 255, 143, 0.75)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // ── Detected Target Nodes ──
      for (const t of targets) {
        const tx = cx + Math.cos(t.angle) * (radius * t.dist);
        const ty = cy + Math.sin(t.angle) * (radius * t.dist);

        // Ping wave when sweep passes target
        let diff = (sweepAngle - t.angle) % (Math.PI * 2);
        if (diff < 0) diff += Math.PI * 2;
        const intensity = Math.max(0, 1 - diff / 1.5);

        // Target marker
        ctx.beginPath();
        ctx.arc(tx, ty, t.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 230, 118, ${0.4 + intensity * 0.6})`;
        ctx.fill();

        // Target pulse ring
        if (intensity > 0.05) {
          ctx.beginPath();
          ctx.arc(tx, ty, t.size + (1 - intensity) * 14, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(22, 255, 143, ${intensity * 0.8})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Target label
        ctx.font = '8px JetBrains Mono';
        ctx.fillStyle = `rgba(242, 245, 243, ${0.35 + intensity * 0.65})`;
        ctx.fillText(t.label, tx + 7, ty + 3);
      }

      // Center Core
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#00E676';
      ctx.fill();
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduced]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[380px] mx-auto flex flex-col items-center justify-center p-3 rounded-[2px] overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(0, 230, 118, 0.03) 0%, rgba(5, 8, 6, 0.7) 75%)',
        border: '1px solid var(--line-strong)',
      }}
      aria-label="Interactive Radar Scanner"
    >
      {/* Corner Bracket Accents */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-primary/60" aria-hidden="true" />
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-primary/60" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-primary/60" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-primary/60" aria-hidden="true" />

      {/* Top telemetry */}
      <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between pointer-events-none z-10 select-none">
        <span className="label-mono text-[8.5px] text-primary/80 tracking-widest flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          HUNT_RADAR // ACTIVE
        </span>
        <span className="label-mono text-[8px] opacity-40">
          RANGE: 50.0KM
        </span>
      </div>

      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Bottom telemetry */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none z-10 select-none pt-1 border-t border-white/[0.06]">
        <span className="label-mono text-[7.5px] opacity-50">
          TARGET LOCK: 4 DETECTED
        </span>
        <span className="label-mono text-[7.5px] text-primary/80">
          FREQ: 2.45GHz
        </span>
      </div>
    </div>
  );
}
