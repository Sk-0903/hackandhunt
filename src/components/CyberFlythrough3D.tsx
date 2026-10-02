import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface StarPoint {
  x: number;
  y: number;
  z: number;
  size: number;
  baseAlpha: number;
  speed: number;
}

interface CyberRing {
  z: number;
  rot: number;
  rotSpeed: number;
}

const TUNNEL_DEPTH = 2200;
const STAR_COUNT = 110;
const RING_COUNT = 8;
const FOV = 420;

export default function CyberFlythrough3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    const isMobileInitial = width < 640;
    const activeStarCount = isMobileInitial ? 55 : STAR_COUNT;

    // Initialize delicate 3D star points (clean, no clumps)
    const stars: StarPoint[] = [];
    for (let i = 0; i < activeStarCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = (isMobileInitial ? 70 : 120) + Math.random() * (isMobileInitial ? 260 : 480);
      stars.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: Math.random() * TUNNEL_DEPTH,
        size: (isMobileInitial ? 0.7 : 0.8) + Math.random() * (isMobileInitial ? 1.0 : 1.4),
        baseAlpha: 0.15 + Math.random() * 0.45,
        speed: 0.85 + Math.random() * 0.35,
      });
    }

    // Initialize 8 elegant, minimalist cyber rings
    const rings: CyberRing[] = [];
    const spacing = TUNNEL_DEPTH / RING_COUNT;
    for (let i = 0; i < RING_COUNT; i++) {
      rings.push({
        z: i * spacing,
        rot: (i * Math.PI) / 8,
        rotSpeed: (i % 2 === 0 ? 1 : -1) * 0.0018,
      });
    }

    // Scroll & Velocity tracking
    let scrollY = window.scrollY;
    let targetScrollY = window.scrollY;
    let smoothVelocity = 0;
    let lastScrollY = window.scrollY;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 1.5;
      targetMouseY = (e.clientY / height - 0.5) * 1.5;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };
    window.addEventListener('resize', onResize);

    let animationFrameId: number;

    const render = () => {
      // Smooth scroll interpolation
      const scrollDiff = targetScrollY - scrollY;
      scrollY += scrollDiff * 0.08;

      // Velocity calculation
      const instantVelocity = scrollY - lastScrollY;
      lastScrollY = scrollY;
      smoothVelocity += (instantVelocity - smoothVelocity) * 0.1;
      const speed = Math.abs(smoothVelocity);

      // Subtle mouse parallax
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2 + mouseX * 22;
      const cy = height / 2 + mouseY * 18;

      // Responsive radii for mobile screens
      const isMobile = width < 640;
      const ringRadius = isMobile ? Math.min(width * 0.40, 165) : 280;
      const railRadius = isMobile ? Math.min(width * 0.36, 145) : 260;

      // Global Scroll Progress (0 to 1)
      const docHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const progress = Math.min(Math.max(scrollY / docHeight, 0), 1);

      // Dynamic Section Color Mood (Emerald green -> Divine Golden Amber for Swamiji)
      let r = 0, g = 230, b = 118;
      if (progress >= 0.12 && progress <= 0.34) {
        const goldWeight = Math.sin(((progress - 0.12) / 0.22) * Math.PI);
        r = Math.round(0 * (1 - goldWeight) + 245 * goldWeight);
        g = Math.round(230 * (1 - goldWeight) + 168 * goldWeight);
        b = Math.round(118 * (1 - goldWeight) + 24 * goldWeight);
      }

      // Controlled Warp Speed: gentle cruise + sleek burst when scrolling
      const warpFactor = Math.min(speed * 0.5, 24);
      const step = (0.9 + warpFactor) * (reduced ? 0.2 : 1);

      // ── 1. CLEAN LONGITUDINAL GUIDE RAILS (Delicate, 4 Rails) ──────────────
      const railCount = 4;
      ctx.lineWidth = 0.75;

      for (let i = 0; i < railCount; i++) {
        const angle = (i * Math.PI * 2) / railCount + (rings[0]?.rot || 0) * 0.2;
        const rx = Math.cos(angle) * railRadius;
        const ry = Math.sin(angle) * railRadius;

        const nearScale = FOV / 140;
        const farScale = FOV / (TUNNEL_DEPTH * 0.95);

        const x1 = cx + rx * nearScale;
        const y1 = cy + ry * nearScale;
        const x2 = cx + rx * farScale;
        const y2 = cy + ry * farScale;

        const railAlpha = 0.04 + Math.min(warpFactor * 0.004, 0.1);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${railAlpha})`;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // ── 2. MINIMALIST CYBER RINGS (Smooth & Elegant) ────────────────────────
      rings.sort((a, b) => b.z - a.z);

      for (const ring of rings) {
        ring.z -= step;
        if (ring.z < 40) ring.z += TUNNEL_DEPTH;
        ring.rot += ring.rotSpeed;

        const z = ring.z;
        const scale = FOV / z;
        const screenRadius = ringRadius * scale;

        // Elegant opacity curve (fades softly in distance and near camera)
        let ringAlpha = (1 - z / TUNNEL_DEPTH) * 0.14;
        if (z < 180) ringAlpha *= (z - 40) / 140;
        if (ringAlpha <= 0) continue;

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${ringAlpha})`;
        ctx.lineWidth = Math.max(0.65, 1.4 * scale);

        // Clean circular portal with 4 subtle tick accents
        ctx.beginPath();
        ctx.arc(cx, cy, screenRadius, 0, Math.PI * 2);
        ctx.stroke();

        // 4 delicate tick marks on the ring (clean technical precision)
        if (z < 1100) {
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${ringAlpha * 1.6})`;
          ctx.lineWidth = 1;
          for (let a = 0; a < 4; a++) {
            const tickAngle = (a * Math.PI) / 2 + ring.rot;
            const innerR = screenRadius - 4 * scale;
            const outerR = screenRadius + 4 * scale;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(tickAngle) * innerR, cy + Math.sin(tickAngle) * innerR);
            ctx.lineTo(cx + Math.cos(tickAngle) * outerR, cy + Math.sin(tickAngle) * outerR);
            ctx.stroke();
          }
        }
      }

      // ── 3. DELICATE STARDUST PARTICLES (No Clutter, Smooth Trails) ─────────
      for (const p of stars) {
        p.z -= step * p.speed;
        if (p.z < 30) {
          p.z += TUNNEL_DEPTH;
          const angle = Math.random() * Math.PI * 2;
          const radius = 100 + Math.random() * 480;
          p.x = Math.cos(angle) * radius;
          p.y = Math.sin(angle) * radius;
        }

        const scale = FOV / p.z;
        const px = cx + p.x * scale;
        const py = cy + p.y * scale;

        if (px < -30 || px > width + 30 || py < -30 || py > height + 30) continue;

        let alpha = p.baseAlpha * (1 - p.z / TUNNEL_DEPTH);
        if (p.z < 180) alpha *= (p.z - 30) / 150;

        const size = Math.max(0.5, p.size * scale * 1.1);

        // Sleek motion blur streak when scrolling fast
        if (warpFactor > 2) {
          const streakLen = Math.min(warpFactor * scale * 8, 38);
          const dx = px - cx;
          const dy = py - cy;
          const dist = Math.hypot(dx, dy) || 1;
          const tailX = px - (dx / dist) * streakLen;
          const tailY = py - (dy / dist) * streakLen;

          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`;
          ctx.lineWidth = Math.max(0.6, size * 0.8);
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none select-none z-0"
      style={{
        width: '100%',
        height: '100%',
        mixBlendMode: 'screen',
      }}
      aria-hidden="true"
    />
  );
}
