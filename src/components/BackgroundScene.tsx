import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "motion/react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  type: "heart" | "spark" | "firework" | "accent";
  life?: number;
  maxLife?: number;
  angle?: number;
  rotationSpeed?: number;
  swayFreq?: number;
  swayAmp?: number;
}

export default function BackgroundScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll();

  // Gentle background color shifts depending on scroll
  const bgTransformY = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "-5%", "-10%"]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const MAX_HEARTS = 45;

    // Handle Resize perfectly with ResizeObserver
    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    handleResize();

    // Create a helper to draw a beautiful heart
    const drawHeart = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      opacity: number,
      color: string,
      angle: number
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.beginPath();
      // Use standard canvas bezier paths to construct an elegant heart
      const d = size;
      c.moveTo(0, -d / 4);
      c.bezierCurveTo(-d / 2, -d, -d * 1.1, -d / 3, 0, d * 0.9);
      c.bezierCurveTo(d * 1.1, -d / 3, d / 2, -d, 0, -d / 4);
      c.closePath();
      c.fillStyle = color;
      c.globalAlpha = opacity;
      c.shadowBlur = size * 1.2;
      c.shadowColor = color;
      c.fill();
      c.restore();
    };

    // Helper to draw clean stars / sparkles
    const drawSparkle = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      opacity: number,
      color: string
    ) => {
      c.save();
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.moveTo(x - size, y);
        c.lineTo(x + size, y);
        c.moveTo(x, y - size);
        c.lineTo(x, y + size);
      }
      c.strokeStyle = color;
      c.lineWidth = 1.5;
      c.globalAlpha = opacity;
      c.shadowBlur = 4;
      c.shadowColor = color;
      c.stroke();
      c.restore();
    };

    // Draw firework spark with soft golden tails
    const drawFireworkSpark = (
      c: CanvasRenderingContext2D,
      p: Particle
    ) => {
      c.save();
      c.beginPath();
      c.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      c.fillStyle = p.color;
      c.globalAlpha = p.opacity;
      c.shadowBlur = 6;
      c.shadowColor = p.color;
      c.fill();
      c.restore();
    };

    // Initialize base floating hearts
    for (let i = 0; i < MAX_HEARTS; i++) {
      const colorType = Math.random();
      const color = colorType < 0.5 
        ? "rgba(244, 63, 94, 0.45)"       // main rose red
        : colorType < 0.85 
          ? "rgba(251, 113, 133, 0.35)"   // pastel pink
          : "rgba(234, 179, 8, 0.25)";    // warm gold glow

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height + canvas.height,
        size: Math.random() * 14 + 10,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: -(Math.random() * 0.7 + 0.4),
        opacity: Math.random() * 0.5 + 0.3,
        color: color,
        type: "heart",
        angle: (Math.random() - 0.5) * 0.2,
        rotationSpeed: (Math.random() - 0.5) * 0.005,
        swayFreq: Math.random() * 0.01 + 0.005,
        swayAmp: Math.random() * 1.5 + 0.5,
      });
    }

    // Interactive mouse movement tracker
    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseActive = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseActive = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      if (Math.random() < 0.25) {
        // Leave tiny glints as mouse trail
        particles.push({
          x: lastMouseX,
          y: lastMouseY,
          size: Math.random() * 5 + 3,
          speedX: (Math.random() - 0.5) * 0.8,
          speedY: (Math.random() - 0.5) * 0.8,
          opacity: 0.8,
          color: "rgba(251, 113, 133, 0.7)",
          type: "accent",
          life: 0,
          maxLife: 60 + Math.random() * 40,
        });
      }
    };

    const handleMouseLeave = () => {
      mouseActive = false;
    };

    const handleClick = (e: MouseEvent) => {
      // Trigger user-instantiated instant localized fireworks!
      createFirework(e.clientX, e.clientY);
    };

    // Create a beautiful firework explosion
    const createFirework = (targetX: number, targetY: number) => {
      const hueSelect = Math.random();
      const colors = hueSelect < 0.4 
        ? ["#fda4af", "#ff2e63", "#ff7597", "#ffe4e6"] // Rose themes
        : hueSelect < 0.8
          ? ["#ffd700", "#ffaa00", "#fffbeb", "#fef08a"] // Gold themes
          : ["#e11d48", "#fff", "#f43f5e", "#fda4af"]; // Intense Valentine red-whites
      
      const particleCount = 40 + Math.floor(Math.random() * 20);
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 3 + 1.2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particles.push({
          x: targetX,
          y: targetY,
          size: Math.random() * 2.5 + 1.5,
          speedX: Math.cos(angle) * velocity,
          speedY: Math.sin(angle) * velocity,
          opacity: 1,
          color: color,
          type: "firework",
          life: 0,
          maxLife: 80 + Math.random() * 60,
        });
      }
    };

    const handleAddHeartsEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ count: number }>;
      const count = customEvent.detail?.count || 15;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 40,
          size: Math.random() * 16 + 10,
          speedX: (Math.random() - 0.5) * 1.8,
          speedY: -(Math.random() * 1.8 + 1.2),
          opacity: 0.9,
          color: Math.random() > 0.5 ? "rgba(244, 63, 94, 0.85)" : "rgba(251, 113, 133, 0.8)",
          type: "heart",
          angle: (Math.random() - 0.5) * 0.4,
          rotationSpeed: (Math.random() - 0.5) * 0.015,
          swayFreq: Math.random() * 0.01 + 0.005,
          swayAmp: Math.random() * 2 + 1,
        });
      }
    };

    const handleFireworkEvent = () => {
      const targetX = Math.random() * (canvas.width * 0.7) + canvas.width * 0.15;
      const targetY = Math.random() * (canvas.height * 0.4) + canvas.height * 0.15;
      createFirework(targetX, targetY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("click", handleClick);
    window.addEventListener("love_os_add_hearts", handleAddHeartsEvent);
    window.addEventListener("love_os_firework", handleFireworkEvent);

    // Periodic ambient background fireworks!
    let fireworkTimer = 0;

    // Core Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Trigger standard soft automated firework occasionally in the upper half
      fireworkTimer++;
      if (fireworkTimer > 180 + Math.random() * 120) {
        fireworkTimer = 0;
        const fx = Math.random() * canvas.width;
        const fy = Math.random() * (canvas.height * 0.45) + 80;
        createFirework(fx, fy);
      }

      // Physics + Draw
      const nextParticles: Particle[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.type === "heart") {
          // Sway and rise
          p.y += p.speedY;
          p.x += p.speedX + Math.sin(p.y * (p.swayFreq || 0.01)) * (p.swayAmp || 1) * 0.02;
          if (p.angle !== undefined && p.rotationSpeed !== undefined) {
            p.angle += p.rotationSpeed;
          }

          // Wrap around top or reset at bottom
          if (p.y < -30) {
            p.y = canvas.height + 40;
            p.x = Math.random() * canvas.width;
            p.opacity = Math.random() * 0.5 + 0.3;
          }

          drawHeart(ctx, p.x, p.y, p.size, p.opacity, p.color, p.angle || 0);
          nextParticles.push(p);

        } else if (p.type === "firework") {
          // Gravity deceleration pull
          p.speedY += 0.025; // gravity pull
          p.speedX *= 0.98;  // air resistance
          p.speedY *= 0.98;
          p.x += p.speedX;
          p.y += p.speedY;

          if (p.life !== undefined && p.maxLife !== undefined) {
            p.life++;
            p.opacity = 1 - (p.life / p.maxLife);
            if (p.life < p.maxLife) {
              drawFireworkSpark(ctx, p);
              nextParticles.push(p);
            }
          }

        } else if (p.type === "accent") {
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.life !== undefined && p.maxLife !== undefined) {
            p.life++;
            p.opacity = 0.8 * (1 - p.life / p.maxLife);
            if (p.life < p.maxLife) {
              drawSparkle(ctx, p.x, p.y, p.size, p.opacity, p.color);
              nextParticles.push(p);
            }
          }
        }
      }

      // Expose state/reassign
      particles = nextParticles;

      // Draw subtle background glowing ambiance clouds directly via standard radial gradients
      ctx.save();
      const grad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        20,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      );
      grad.addColorStop(0, "rgba(244, 63, 94, 0.015)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("love_os_add_hearts", handleAddHeartsEvent);
      window.removeEventListener("love_os_firework", handleFireworkEvent);
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        transform: "translateY(0%)", // driven via modern CSS
        backgroundImage: "radial-gradient(ellipse at top, rgba(29, 13, 23, 0.85) 0%, rgba(12, 5, 10, 1) 100%)"
      }}
    >
      {/* Background Atmosphere: Distinct Romantic Glows from Artistic Flair design */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-pink-900/25 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[65%] h-[65%] bg-red-900/15 blur-[150px] rounded-full"></div>
        <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] bg-rose-500/10 blur-[100px] rounded-full"></div>
      </div>

      {/* Decorative roses positioned elegant in the corners */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-25 mix-blend-screen select-none pointer-events-none transition-opacity duration-1000 animate-pulse duration-[6000ms] p-4">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">
          <path d="M50 30 C 40 10, 10 10, 10 40 C 10 70, 50 90, 50 90 C 50 90, 90 70, 90 40 C 90 10, 60 10, 50 30 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
          <path d="M50 50 C 40 35, 30 45, 35 55 C 40 65, 60 65, 65 55 C 70 45, 60 35, 50 50 Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1" />
          <path d="M50 40 C 45 42, 45 48, 50 50 C 55 48, 55 42, 50 40 Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
          <path d="M15 45 C 5 55, 10 70, 25 75 C 40 80, 48 65, 50 50" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />
          <path d="M85 45 C 95 55, 90 70, 75 75 C 60 80, 52 65, 50 50" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 w-72 h-72 opacity-25 mix-blend-screen select-none pointer-events-none transition-opacity duration-1000 animate-pulse duration-[8000ms] p-4">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]">
          <path d="M50 30 C 40 10, 10 10, 10 40 C 10 70, 50 90, 50 90 C 50 90, 90 70, 90 40 C 90 10, 60 10, 50 30 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
          <path d="M35 40 C 25 25, 15 35, 20 45 C 25 55, 45 55, 50 45 C 55 35, 45 25, 35 40 Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1" />
          <path d="M65 40 C 55 25, 45 35, 50 45 C 55 55, 75 55, 80 45 C 85 35, 75 25, 65 40 Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1" />
          <path d="M50 75 C 45 80, 30 83, 20 70" stroke="currentColor" strokeWidth="1" />
          <path d="M50 75 C 55 80, 70 83, 80 70" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
}
