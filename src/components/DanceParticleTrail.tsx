import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  sparkleSpeed: number;
  sparkleAngle: number;
}

interface Point {
  x: number;
  y: number;
  time: number;
}

export default function DanceParticleTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: Particle[] = [];
    const trailPoints: Point[] = [];
    const maxParticles = 60;
    const maxTrailPoints = 14;

    const goldPalette = [
      "rgba(246, 200, 107,", // Warm Gold
      "rgba(255, 230, 166,", // Champagne Cream
      "rgba(255, 246, 218,", // Light Radiant Cream
      "rgba(155, 176, 138,", // Sage Green Accent
      "rgba(229, 160, 69,"   // Amber Gold
    ];

    let lastX = 0;
    let lastY = 0;
    let isMoving = false;
    let idleTimer: any = null;

    const addParticles = (x: number, y: number, speed: number) => {
      // Add ribbon trail point
      trailPoints.push({ x, y, time: Date.now() });
      if (trailPoints.length > maxTrailPoints) {
        trailPoints.shift();
      }

      // Quantity of particles based on movement velocity (1 to 4 particles)
      const count = Math.min(Math.max(Math.floor(speed * 0.18), 1), 3);

      for (let i = 0; i < count; i++) {
        if (particles.length >= maxParticles) {
          particles.shift();
        }

        const angle = Math.random() * Math.PI * 2;
        const driftVelocity = Math.random() * 0.9 + 0.2;
        const colorBase = goldPalette[Math.floor(Math.random() * goldPalette.length)];

        particles.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * driftVelocity + (Math.random() - 0.5) * 0.2,
          vy: Math.sin(angle) * driftVelocity - Math.random() * 0.4, // gentle upward floating
          size: Math.random() * 2.2 + 1.2,
          alpha: Math.random() * 0.35 + 0.65,
          decay: Math.random() * 0.018 + 0.016, // fades in ~40-60 frames
          color: colorBase,
          sparkleSpeed: Math.random() * 0.15 + 0.05,
          sparkleAngle: Math.random() * Math.PI * 2
        });
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const dx = clientX - lastX;
      const dy = clientY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      lastX = clientX;
      lastY = clientY;
      isMoving = true;

      addParticles(clientX, clientY, speed);

      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isMoving = false;
      }, 100);
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    // Main animation render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw smooth fluid ribbon connecting recent cursor points
      if (trailPoints.length > 2) {
        ctx.beginPath();
        ctx.moveTo(trailPoints[0].x, trailPoints[0].y);

        for (let i = 1; i < trailPoints.length - 1; i++) {
          const xc = (trailPoints[i].x + trailPoints[i + 1].x) / 2;
          const yc = (trailPoints[i].y + trailPoints[i + 1].y) / 2;
          ctx.quadraticCurveTo(trailPoints[i].x, trailPoints[i].y, xc, yc);
        }

        const gradient = ctx.createLinearGradient(
          trailPoints[0].x,
          trailPoints[0].y,
          trailPoints[trailPoints.length - 1].x,
          trailPoints[trailPoints.length - 1].y
        );
        gradient.addColorStop(0, "rgba(246, 200, 107, 0)");
        gradient.addColorStop(0.7, "rgba(246, 200, 107, 0.25)");
        gradient.addColorStop(1, "rgba(255, 246, 218, 0.65)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(246, 200, 107, 0.5)";
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      }

      // Age and remove old ribbon points
      const now = Date.now();
      while (trailPoints.length > 0 && now - trailPoints[0].time > 180) {
        trailPoints.shift();
      }

      // 2. Draw sparkling dance stardust particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.sparkleAngle += p.sparkleSpeed;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const twinkle = Math.sin(p.sparkleAngle) * 0.3 + 0.7;
        const currentSize = Math.max(p.size * p.alpha * twinkle, 0.4);

        // Particle Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${(p.alpha * 0.3).toFixed(2)})`;
        ctx.fill();

        // Particle Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${(p.alpha * twinkle).toFixed(2)})`;
        ctx.fill();

        // Delicate star flare for larger particles
        if (currentSize > 1.8) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${(p.alpha * 0.4).toFixed(2)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x - currentSize * 1.6, p.y);
          ctx.lineTo(p.x + currentSize * 1.6, p.y);
          ctx.moveTo(p.x, p.y - currentSize * 1.6);
          ctx.lineTo(p.x, p.y + currentSize * 1.6);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      clearTimeout(idleTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[38] select-none"
    />
  );
}
