"use client";

import Fireworks from "./Fireworks";
import { useEffect, useMemo, useState } from "react";

export default function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    // We use a small timeout to move the update out of the synchronous effect body
    // This satisfies the "set-state-in-effect" lint rule in Next.js 15
    const timeout = setTimeout(() => {
      setMounted(true);
      setCurrentTime(Date.now());
    }, 0);

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  const countdownData = useMemo(() => {
    // Safety check for first render
    if (currentTime === 0) {
      return { remainingTime: 0, displayYear: new Date().getFullYear() };
    }

    const dateObj = new Date(currentTime);
    const currentYear = dateObj.getFullYear();

    let target = new Date(currentYear, 11, 25).getTime();
    let remaining = target - currentTime;

    if (remaining <= 0) {
      const nextYear = currentYear + 1;
      target = new Date(nextYear, 11, 25).getTime();
      remaining = target - currentTime;
      return { remainingTime: remaining, displayYear: nextYear };
    }

    return { remainingTime: remaining, displayYear: currentYear };
  }, [currentTime]);

  // Prevent hydration mismatch
  if (!mounted) return null;

  const { remainingTime, displayYear } = countdownData;

  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
  const seconds = Math.floor((remainingTime / 1000) % 60);

  return (
    <>
      <Fireworks remainingTime={remainingTime} />
      <div className="p-[1rem] relative font-christmas font-bold text-white text-shadow-[2px_2px_1px_#000000] flex flex-col gap-10 z-10">
        <h1 className="text-6xl md:text-8xl text-center self-center">
          Christmas Countdown {displayYear}
        </h1>
        <div className="flex flex-col lg:flex-row lg:flex-wrap justify-center gap-3 md:gap-5 lg:gap-7 text-4xl md:text-6xl text-center">
          <span>{days} days</span>
          <span>{String(hours).padStart(2, "0")} hours</span>
          <span>{String(minutes).padStart(2, "0")} minutes</span>
          <span>{String(seconds).padStart(2, "0")} seconds</span>
          <h3 className="md:w-full text-4xl md:text-6xl text-center">
            until Christmas
          </h3>
        </div>
      </div>
    </>
  );
}
