"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Move colors outside to prevent it being a dependency in useEffect
const FIREWORK_COLORS = [
  "#FF0000",
  "#008000",
  "#FFFFFF",
  "#FFD700",
  "#00BFFF",
  "#FF69B4",
  "#FF8C00",
  "#ADFF2F",
];

interface FireworksProps {
  density?: number;
  autoLaunch?: boolean;
  remainingTime: number; // Changed from any to number
}

interface Particle {
  x: number;
  y: number;
  color: string;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
  decay: number;
}

class Firework {
  particles: Particle[] = [];

  constructor(x: number, y: number, colors: string[]) {
    const count = 150;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = Math.random() * 6 + 2;
      this.particles.push({
        x,
        y,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 3 + 1,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.005,
      });
    }
  }

  update() {
    this.particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.alpha -= p.decay;
    });
  }
}

const Fireworks: React.FC<FireworksProps> = ({
  density = 0.05,
  autoLaunch = true,
  remainingTime,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      if (!ctxRef.current || !canvasRef.current) return;

      const ctx = ctxRef.current;
      const cvs = canvasRef.current;

      ctx.fillStyle = "#8B0000";
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      fireworksRef.current.forEach((firework, index) => {
        firework.update();
        firework.particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        });
        firework.particles = firework.particles.filter((p) => p.alpha > 0);
        if (firework.particles.length === 0) {
          fireworksRef.current.splice(index, 1);
        }
      });

      ctx.globalAlpha = 1;
      ctx.fillStyle = "white";
      ctx.textAlign = "center";

      const getFontSize = (base: number) => {
        if (window.innerWidth >= 1024) return base;
        if (window.innerWidth >= 768) return base * 0.6;
        return base * 0.3;
      };

      ctx.font = `bold ${getFontSize(128)}px 'Mountains of Christmas', serif`;
      ctx.fillText("Merry Christmas", cvs.width / 2, cvs.height / 2);

      ctx.font = `bold ${getFontSize(50)}px 'Mountains of Christmas', serif`;
      const offset = window.innerWidth >= 768 ? 90 : 40;
      ctx.fillText(
        '"Hope your christmas is merry, bright and full of love"',
        cvs.width / 2,
        cvs.height / 2 + offset
      );

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    let interval: NodeJS.Timeout;
    if (autoLaunch) {
      interval = setInterval(() => {
        if (Math.random() < density) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height * 0.5;
          fireworksRef.current.push(new Firework(x, y, FIREWORK_COLORS));
        }
      }, 150);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [autoLaunch, density]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    fireworksRef.current.push(new Firework(x, y, FIREWORK_COLORS));
  };

  useGSAP(() => {
    if (remainingTime <= 0) {
      gsap.to("#fireworks-container", {
        opacity: 1,
        display: "block",
        duration: 0.5,
        onComplete: () => {
          gsap.to("#fireworks-container", {
            opacity: 0,
            display: "none",
            duration: 0.5,
            delay: 60,
          });
        },
      });
    }
  }, [remainingTime]);

  return (
    <div
      id="fireworks-container"
      className="w-full h-full fixed hidden opacity-0 z-40"
    >
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        aria-label="Christmas Fireworks canvas"
        className="fixed top-0 left-0 w-full h-full"
      />
    </div>
  );
};

export default Fireworks;
