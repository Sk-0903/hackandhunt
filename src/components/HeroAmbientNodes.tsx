import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface AmbientNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  alpha: number;
  label?: string;
  pulseTimer: number;
}

export default function HeroAmbientNodes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isVisible = true;

    // 6 subtle ambient nodes
    const nodes: AmbientNode[] = [
      { x: 40, y: 35, vx: 0.12, vy: 0.08, baseRadius: 2.2, alpha: 0.5, label: 'SYS_NODE.01', pulseTimer: 0 },
      { x: 120, y: 70, vx: -0.09, vy: 0.11, baseRadius: 1.8, alpha: 0.35, pulseTimer: 2.5 },
      { x: 210, y: 30, vx: 0.08, vy: -0.1, baseRadius: 2.0, alpha: 0.45, label: '12.9716°N', pulseTimer: 4.8 },
      { x: 170, y: 110, vx: -0.11, vy: -0.07, baseRadius: 1.6, alpha: 0.3, pulseTimer: 1.2 },
      { x: 75, y: 120, vx: 0.07, vy: -0.09, baseRadius: 1.9, alpha: 0.38, pulseTimer: 3.7 },
      { x: 260, y: 85, vx: -0.06, vy: 0.08, baseRadius: 1.5, alpha: 0.28, label: 'SEC.07', pulseTimer: 6.0 },
    ];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current.targetX = nx * 24; // Subtle max 24px parallax shift
      mouseRef.current.targetY = ny * 18;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    io.observe(container);

    let lastTime = performance.now();

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Smooth mouse parallax damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const px = mouseRef.current.x;
      const py = mouseRef.current.y;

      // Update & wrap node positions
      if (!reduced) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;

          if (n.x < 15) { n.x = 15; n.vx *= -1; }
          if (n.x > w - 15) { n.x = w - 15; n.vx *= -1; }
          if (n.y < 15) { n.y = 15; n.vy *= -1; }
          if (n.y > h - 15) { n.y = h - 15; n.vy *= -1; }

          n.pulseTimer = (n.pulseTimer + dt) % 7.0; // soft pulse cycle every 7s
        }
      }

      // Draw faint connection lines between nearby nodes
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = (nodes[i].x + px * 0.5) - (nodes[j].x + px * 0.5);
          const dy = (nodes[i].y + py * 0.5) - (nodes[j].y + py * 0.5);
          const dist = Math.hypot(dx, dy);
          const maxDist = 135;

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.16;
            ctx.strokeStyle = `rgba(0, 230, 118, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x + px * 0.6, nodes[i].y + py * 0.6);
            ctx.lineTo(nodes[j].x + px * 0.6, nodes[j].y + py * 0.6);
            ctx.stroke();
          }
        }
      }

      // Draw nodes & micro-coordinates
      ctx.font = '7.5px Plus Jakarta Sans';
      for (const n of nodes) {
        const nx = n.x + px * 0.8;
        const ny = n.y + py * 0.8;

        // Occasional soft pulse ring
        if (n.pulseTimer < 1.8) {
          const pProgress = n.pulseTimer / 1.8;
          const pRadius = n.baseRadius + pProgress * 14;
          const pAlpha = (1 - pProgress) * 0.28;

          ctx.beginPath();
          ctx.arc(nx, ny, pRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 230, 118, ${pAlpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }

        // Soft glow halo
        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.baseRadius * 3);
        grad.addColorStop(0, `rgba(0, 230, 118, ${n.alpha * 0.7})`);
        grad.addColorStop(1, 'rgba(0, 230, 118, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(nx, ny, n.baseRadius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Node center
        ctx.fillStyle = `rgba(0, 230, 118, ${n.alpha})`;
        ctx.beginPath();
        ctx.arc(nx, ny, n.baseRadius, 0, Math.PI * 2);
        ctx.fill();

        // Tiny technical label if present
        if (n.label) {
          ctx.fillStyle = `rgba(140, 152, 145, ${n.alpha * 0.6})`;
          ctx.fillText(n.label, nx + 6, ny + 2.5);
        }
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduced]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[340px] h-[75px] pointer-events-none select-none opacity-85"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
