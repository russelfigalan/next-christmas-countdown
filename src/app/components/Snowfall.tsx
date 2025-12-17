"use client";

import { useRef, useEffect } from "react";

export default function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx) return; // safeguard against null

    let w = window.innerWidth;
    let h = window.innerHeight;
    const numFlakes = 120;
    let flakes: { x: number; y: number; r: number; d: number }[] = [];

    function generateFlakes() {
      flakes = [];
      for (let i = 0; i < numFlakes; i++) {
        flakes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1.5 + Math.random() * 4.5, // radius between 1.5 and 6
          d: Math.random() * numFlakes, // density
        });
      }
    }

    function resize() {
      if (!canvas || !ctx) return;
      // Update canvas size for responsiveness
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
      ctx.scale(dpr, dpr);
      generateFlakes();
    }

    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!ctx) return; // safeguard each frame
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
        ctx.fill();
      }

      update();
      requestAnimationFrame(draw);
    }

    function update() {
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        // Slow falling speed depending on size and density
        f.y += Math.pow(f.d, 0.5) * 0.1 + f.r * 0.05;
        // f.x += Math.sin(f.y * 0.01) * 0.3; // gentle side sway

        if (f.y > h) {
          flakes[i] = { x: Math.random() * w, y: -10, r: f.r, d: f.d };
        }
      }
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}
