import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

// 3D Icosahedron vertices definition
const PHI = (1 + Math.sqrt(5)) / 2;
const BASE_VERTICES: Point3D[] = [
  { x: -1, y: PHI, z: 0 }, { x: 1, y: PHI, z: 0 }, { x: -1, y: -PHI, z: 0 }, { x: 1, y: -PHI, z: 0 },
  { x: 0, y: -1, z: PHI }, { x: 0, y: 1, z: PHI }, { x: 0, y: -1, z: -PHI }, { x: 0, y: 1, z: -PHI },
  { x: PHI, y: 0, z: -1 }, { x: PHI, y: 0, z: 1 }, { x: -PHI, y: 0, z: -1 }, { x: -PHI, y: 0, z: 1 },
];

// Normalize vertices to unit sphere
const VERTICES = BASE_VERTICES.map(v => {
  const len = Math.hypot(v.x, v.y, v.z);
  return { x: v.x / len, y: v.y / len, z: v.z / len };
});

// Icosahedron 30 edges
const EDGES: [number, number][] = [
  [0,1], [0,5], [0,7], [0,10], [0,11],
  [1,5], [1,7], [1,8], [1,9],
  [2,3], [2,4], [2,6], [2,10], [2,11],
  [3,4], [3,6], [3,8], [3,9],
  [4,5], [4,9], [4,11],
  [5,9], [5,11],
  [6,7], [6,8], [6,10],
  [7,8], [7,10],
  [8,9],
  [10,11],
];

export default function CyberCore3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [telemetry, setTelemetry] = useState({ rotX: 0, rotY: 0, fps: 60 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    let angleX = 0.4;
    let angleY = 0.6;
    let angleZ = 0;
    let targetAngleX = 0.4;
    let targetAngleY = 0.6;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    // Resize handling with DPR
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height || rect.width); // square default
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Mouse & Touch tilt interaction
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetAngleY = x * 2.2;
      targetAngleX = -y * 2.2;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width - 0.5;
      const y = (touch.clientY - rect.top) / rect.height - 0.5;
      targetAngleY = x * 2.5;
      targetAngleX = -y * 2.5;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });

    // IntersectionObserver to pause when off-screen
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    io.observe(container);

    // Main 3D render loop
    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // FPS counter
      frameCount++;
      if (time - fpsTimer > 500) {
        setTelemetry(t => ({
          ...t,
          rotX: Math.round(((angleX % (Math.PI * 2)) * 180) / Math.PI),
          rotY: Math.round(((angleY % (Math.PI * 2)) * 180) / Math.PI),
          fps: Math.round((frameCount * 1000) / (time - fpsTimer)),
        }));
        frameCount = 0;
        fpsTimer = time;
      }

      if (!reduced) {
        // Smooth rotation interpolation + auto-spin
        angleY += (targetAngleY + time * 0.00045 - angleY) * 0.06;
        angleX += (targetAngleX + Math.sin(time * 0.0003) * 0.3 - angleX) * 0.06;
        angleZ += 0.0002;
      }

      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.34;

      ctx.clearRect(0, 0, w, h);

      // Rotation matrix values
      const radX = angleX;
      const radY = angleY;
      const radZ = angleZ;

      const cosX = Math.cos(radX), sinX = Math.sin(radX);
      const cosY = Math.cos(radY), sinY = Math.sin(radY);
      const cosZ = Math.cos(radZ), sinZ = Math.sin(radZ);

      const project = (p: Point3D): { x: number; y: number; z: number; scale: number } => {
        // Rotate around Y
        let x1 = p.x * cosY + p.z * sinY;
        let y1 = p.y;
        let z1 = -p.x * sinY + p.z * cosY;

        // Rotate around X
        let x2 = x1;
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;

        // Rotate around Z
        let x3 = x2 * cosZ - y2 * sinZ;
        let y3 = x2 * sinZ + y2 * cosZ;
        let z3 = z2;

        const fov = 3.2;
        const scale = fov / (fov + z3);
        return {
          x: cx + x3 * radius * scale,
          y: cy + y3 * radius * scale,
          z: z3,
          scale,
        };
      };

      // ── 1. Background Hologram Grid & Scanline ──
      const scanY = cy + Math.sin(time * 0.002) * radius * 1.1;
      const scanGrad = ctx.createLinearGradient(0, scanY - 15, 0, scanY + 15);
      scanGrad.addColorStop(0, 'rgba(0, 230, 118, 0)');
      scanGrad.addColorStop(0.5, 'rgba(0, 230, 118, 0.12)');
      scanGrad.addColorStop(1, 'rgba(0, 230, 118, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(cx - radius * 1.3, scanY - 15, radius * 2.6, 30);

      // Faint scan line
      ctx.strokeStyle = 'rgba(0, 230, 118, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - radius * 1.25, scanY);
      ctx.lineTo(cx + radius * 1.25, scanY);
      ctx.stroke();

      // ── 2. Orbital 3D Gyroscope Rings ──
      const drawRing = (tiltX: number, tiltY: number, speed: number, rMult: number, alpha: number) => {
        const ringSegments = 48;
        const rRad = radius * rMult;
        ctx.beginPath();
        for (let i = 0; i <= ringSegments; i++) {
          const theta = (i / ringSegments) * Math.PI * 2 + time * speed;
          const rx = Math.cos(theta) * rRad;
          const ry = 0;
          const rz = Math.sin(theta) * rRad;

          // Apply ring tilt
          const ry2 = ry * Math.cos(tiltX) - rz * Math.sin(tiltX);
          const rz2 = ry * Math.sin(tiltX) + rz * Math.cos(tiltX);
          const rx2 = rx * Math.cos(tiltY) + rz2 * Math.sin(tiltY);
          const rz3 = -rx * Math.sin(tiltY) + rz2 * Math.cos(tiltY);

          // Project with global rotation
          const pt = project({ x: rx2 / radius, y: ry2 / radius, z: rz3 / radius });
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = `rgba(0, 230, 118, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      };

      drawRing(0.5, 0.2, 0.0006, 1.2, 0.22);
      drawRing(-0.6, 0.4, -0.0008, 1.35, 0.16);
      drawRing(1.1, -0.3, 0.0004, 1.05, 0.28);

      // ── 3. Projected 3D Icosahedron Core ──
      const projected = VERTICES.map(project);

      // Draw 3D Edges with depth-based brightness
      for (const [i, j] of EDGES) {
        const p1 = projected[i];
        const p2 = projected[j];
        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.08, Math.min(0.85, 0.45 - avgZ * 0.4));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(0, 230, 118, ${alpha})`;
        ctx.lineWidth = Math.max(0.6, 1.4 * ((p1.scale + p2.scale) / 2));
        ctx.stroke();
      }

      // ── 4. Glowing Vertices ──
      for (const pt of projected) {
        const dotAlpha = Math.max(0.2, Math.min(1, 0.65 - pt.z * 0.45));
        const dotSize = Math.max(1.8, 3.2 * pt.scale);

        // Halo
        const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, dotSize * 3);
        grad.addColorStop(0, `rgba(0, 230, 118, ${dotAlpha * 0.8})`);
        grad.addColorStop(1, 'rgba(0, 230, 118, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, dotSize * 3, 0, Math.PI * 2);
        ctx.fill();

        // Center dot
        ctx.fillStyle = `rgba(242, 245, 243, ${dotAlpha})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, dotSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── 5. Inner Pulsing Core ──
      const pulse = 1 + Math.sin(time * 0.004) * 0.15;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.35 * pulse);
      coreGrad.addColorStop(0, 'rgba(0, 230, 118, 0.4)');
      coreGrad.addColorStop(0.4, 'rgba(22, 255, 143, 0.15)');
      coreGrad.addColorStop(1, 'rgba(0, 230, 118, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.35 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Core center diamond
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.001);
      ctx.strokeStyle = 'rgba(0, 230, 118, 0.7)';
      ctx.lineWidth = 1;
      const dSize = 10 * pulse;
      ctx.strokeRect(-dSize / 2, -dSize / 2, dSize, dSize);
      ctx.restore();
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('touchmove', onTouchMove);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduced]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[420px] mx-auto flex flex-col items-center justify-center p-4 rounded-[2px] overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(0, 230, 118, 0.035) 0%, rgba(5, 8, 6, 0.75) 75%)',
        border: '1px solid var(--line-strong)',
      }}
      aria-label="3D Interactive Holographic Matrix"
    >
      {/* Corner Bracket Accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/60" aria-hidden="true" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/60" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/60" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/60" aria-hidden="true" />

      {/* Top HUD Telemetry */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10 select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="label-mono text-[9px] text-primary/90 tracking-widest">
            3D.CORE // ACTIVE
          </span>
        </div>
        <span className="label-mono text-[8.5px] opacity-40">
          MATRIX_V26.0
        </span>
      </div>

      {/* The 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Bottom HUD Telemetry */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10 select-none pt-2 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="label-mono text-[8px] opacity-50">
            X:{telemetry.rotX}° Y:{telemetry.rotY}°
          </span>
          <span className="text-white/20">|</span>
          <span className="label-mono text-[8px] opacity-50">
            {telemetry.fps} FPS
          </span>
        </div>
        <span className="label-mono text-[8px] text-primary tracking-widest opacity-80">
          INTERACTIVE 3D
        </span>
      </div>
    </div>
  );
}
