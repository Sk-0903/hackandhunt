import { useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ── Types ────────────────────────────────────────────────────────────────────

interface Node {
  x: number; y: number;
  bx: number; by: number;   // base (drifting)
  vx: number; vy: number;
  phase: number;
  r: number;
  opacity: number;
  label?: string;
  secret?: string;
}

const VISIBLE_LABELS = ['NODE 01', 'ACCESS', 'TRACE', 'SIGNAL', 'TARGET', 'PATH', 'SECTOR 07'];
const SECRETS = ['KEEP LOOKING.', 'THE FIRST CLUE IS NEVER THE FIRST CLUE.', 'ACCESS GRANTED.'];
const CONNECT_DIST = 120;
const NODE_SPEED  = 0.18;

// ── Helpers ──────────────────────────────────────────────────────────────────

function rand(min: number, max: number) { return min + Math.random() * (max - min); }

function buildNodes(w: number, h: number, count: number): Node[] {
  const nodes: Node[] = [];
  const labelPicks = [...VISIBLE_LABELS].sort(() => Math.random() - 0.5).slice(0, Math.min(5, count));
  const secretPicks = [...SECRETS];

  for (let i = 0; i < count; i++) {
    const x = rand(0, w);
    const y = rand(0, h);
    nodes.push({
      x, y, bx: x, by: y,
      vx: rand(-NODE_SPEED, NODE_SPEED),
      vy: rand(-NODE_SPEED, NODE_SPEED),
      phase: rand(0, Math.PI * 2),
      r: Math.random() < 0.15 ? 2.5 : 1.5,
      opacity: rand(0.35, 0.7),
      label: i < labelPicks.length ? labelPicks[i] : undefined,
      secret: i >= labelPicks.length && i < labelPicks.length + secretPicks.length
        ? secretPicks[i - labelPicks.length]
        : undefined,
    });
  }
  return nodes;
}

// ── Component ────────────────────────────────────────────────────────────────

interface Props { className?: string }

export default function NetworkBackground({ className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef({
    nodes: [] as Node[],
    mouse: { x: -9999, y: -9999 },
    raf: 0,
    running: false,
    t: 0,
    w: 0,
    h: 0,
    tooltip: null as { msg: string; x: number; y: number } | null,
  });
  const reduced = useReducedMotion();

  const draw = useCallback((ts: number) => {
    const s = stateRef.current;
    if (!s.running) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dt = Math.min((ts - s.t) / 1000, 0.05);
    s.t = ts;
    const { w, h, mouse, nodes } = s;

    ctx.clearRect(0, 0, w, h);
    s.tooltip = null;

    // Move nodes (sine drift)
    if (!reduced) {
      for (const n of nodes) {
        n.phase += dt * 0.35;
        n.bx += n.vx;
        n.by += n.vy;
        if (n.bx < 0 || n.bx > w) n.vx *= -1;
        if (n.by < 0 || n.by > h) n.vy *= -1;
        n.x = n.bx + Math.sin(n.phase) * 16;
        n.y = n.by + Math.cos(n.phase * 0.8) * 10;
      }
    }

    // Connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        if (dist >= CONNECT_DIST) continue;

        const mx = (a.x + b.x) * 0.5, my = (a.y + b.y) * 0.5;
        const md = Math.hypot(mouse.x - mx, mouse.y - my);
        const prox = Math.max(0, 1 - md / 160);
        const base = (1 - dist / CONNECT_DIST) * 0.1;
        const alpha = base + prox * 0.25;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(99,217,157,${alpha})`;
        ctx.lineWidth = prox > 0.25 ? 0.7 : 0.35;
        ctx.stroke();
      }
    }

    // Nodes + labels
    for (const n of nodes) {
      const md = Math.hypot(mouse.x - n.x, mouse.y - n.y);
      const hovered = md < 14;
      if (hovered && n.secret) s.tooltip = { msg: n.secret, x: n.x, y: n.y };

      // Dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,230,118,${hovered ? 0.9 : n.opacity})`;
      ctx.fill();

      // Label (barely visible)
      if (n.label) {
        ctx.font = '7px Plus Jakarta Sans';
        ctx.fillStyle = `rgba(140,152,145,0.25)`;
        ctx.fillText(n.label, n.x + 5, n.y - 4);
      }
    }

    // Tooltip for secret nodes
    if (s.tooltip) {
      const { msg, x, y } = s.tooltip;
      ctx.font = '9px Plus Jakarta Sans';
      const tw = ctx.measureText(msg).width;
      const px = 8, py = 5;
      const tx = Math.min(x + 14, w - tw - px * 2 - 8);
      const ty = y - 22;

      ctx.fillStyle = 'rgba(5,8,6,0.95)';
      ctx.strokeStyle = 'rgba(0,230,118,0.35)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.rect(tx - px, ty - 13, tw + px * 2, 18 + py);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#00E676';
      ctx.fillText(msg, tx, ty);
    }

    s.raf = requestAnimationFrame(draw);
  }, [reduced]);

  const start = useCallback(() => {
    const s = stateRef.current;
    if (s.running) return;
    s.running = true;
    s.t = performance.now();
    s.raf = requestAnimationFrame(draw);
  }, [draw]);

  const stop = useCallback(() => {
    const s = stateRef.current;
    s.running = false;
    cancelAnimationFrame(s.raf);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setup = () => {
      const dpr  = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(dpr, dpr);
      stateRef.current.w = w;
      stateRef.current.h = h;
      const isMobile = w < 768;
      stateRef.current.nodes = buildNodes(w, h, isMobile ? 25 : 55);
    };

    setup();

    // Resize
    const ro = new ResizeObserver(() => { stop(); setup(); start(); });
    ro.observe(canvas);

    // Mouse
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      stateRef.current.mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { stateRef.current.mouse = { x: -9999, y: -9999 }; };
    canvas.addEventListener('mousemove', onMove, { passive: true });
    canvas.addEventListener('mouseleave', onLeave);

    // Pause when tab hidden
    const onVisibility = () => { document.hidden ? stop() : start(); };
    document.addEventListener('visibilitychange', onVisibility);

    // Pause when off-screen
    const io = new IntersectionObserver(([e]) => { e.isIntersecting ? start() : stop(); }, { threshold: 0 });
    io.observe(canvas);

    if (!document.hidden) start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [start, stop]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}
