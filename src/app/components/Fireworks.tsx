"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface FireworksProps {
  density?: number;
  autoLaunch?: boolean;
  remainingTime?: any;
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
    const count = 150; // more particles for bigger fireworks
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

  // Expanded color palette for more vibrant fireworks
  const colors = [
    "#FF0000",
    "#008000",
    "#FFFFFF",
    "#FFD700",
    "#00BFFF",
    "#FF69B4",
    "#FF8C00",
    "#ADFF2F",
  ];

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
      ctxRef.current.fillStyle = "#8B0000"; // Dark red background
      ctxRef.current.fillRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      fireworksRef.current.forEach((firework, index) => {
        firework.update();
        firework.particles.forEach((p) => {
          ctxRef.current!.beginPath();
          ctxRef.current!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctxRef.current!.fillStyle = p.color;
          ctxRef.current!.globalAlpha = p.alpha;
          ctxRef.current!.fill();
        });
        firework.particles = firework.particles.filter((p) => p.alpha > 0);
        if (firework.particles.length === 0) {
          fireworksRef.current.splice(index, 1);
        }
      });

      ctxRef.current.globalAlpha = 1;

      ctxRef.current.fillStyle = "white";
      ctxRef.current.textAlign = "center";

      const responsiveMainFont = () => {
        if (window.innerWidth >= 1024) {
          return 128;
        } else if (window.innerWidth >= 768) {
          return 80;
        } else {
          return 40;
        }
      };

      const responsiveSubFont = () => {
        if (window.innerWidth >= 1024) {
          return 50;
        } else if (window.innerWidth >= 768) {
          return 30;
        } else {
          return 15;
        }
      };

      const responsiveTextLine = () => {
        if (window.innerWidth >= 768) {
          return 90;
        } else {
          return 40;
        }
      };

      ctxRef.current.font = `bold ${responsiveMainFont()}px 'Mountains of Christmas', serif`;
      ctxRef.current.fillText(
        "Merry Christmas",
        canvasRef.current.width / 2,
        canvasRef.current.height / 2
      );

      ctxRef.current.font = `bold ${responsiveSubFont()}px 'Mountains of Christmas', serif`;
      ctxRef.current.fillText(
        '"Hope your christmas is merry, bright and full of love"',
        canvasRef.current.width / 2,
        canvasRef.current.height / 2 + responsiveTextLine()
      );

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    if (autoLaunch) {
      const interval = setInterval(() => {
        if (Math.random() < density) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height * 0.5;
          fireworksRef.current.push(new Firework(x, y, colors));
        }
      }, 150); // more frequent launches
      return () => {
        clearInterval(interval);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        window.removeEventListener("resize", resize);
      };
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [autoLaunch, density]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    fireworksRef.current.push(new Firework(x, y, colors));
  };

  useGSAP(() => {
    if (remainingTime <= 0) {
      gsap.to("#fireworks", {
        opacity: 1,
        display: "block",
        duration: 0.5,
        onComplete: () => {
          gsap.to("#fireworks", {
            opacity: 0,
            display: "hidden",
            duration: 0.5,
            delay: 60,
          });
        },
      });
    }
  }, [remainingTime]);

  return (
    <>
      <div id="fireworks" className="w-full h-full fixed hidden opacity-0 z-40">
        <canvas
          ref={canvasRef}
          onClick={handleClick}
          aria-label="Christmas Fireworks canvas"
          id="fireworks"
          className="fixed top-0 left-0 w-full h-full"
        />
        ;
        {/* <div className="absolute inset-0 flex flex-col justify-center-safe items-center-safe gap-5 font-christmas font-bold text-white text-shadow-[2px_2px_1px_#000000] z-50">
        <h1 className="md:text-9xl">Merry Christmas</h1>
        <p className="md:text-5xl">"Hope your christmas is merry, bright and full of love"</p>
      </div> */}
      </div>
    </>
  );
};

export default Fireworks;
