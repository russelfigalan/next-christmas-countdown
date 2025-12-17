"use client";

import Fireworks from "./Fireworks";
import { useEffect, useRef, useState } from "react";

export default function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentYear, setCurrentYear] = useState<number>(0);

  const targetDate = useRef<number>(0);

  // Initialize ONLY on client
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();

    setCurrentYear(year);
    setCurrentTime(Date.now());

    const christmas = new Date(year, 11, 25);

    targetDate.current =
      now > christmas
        ? new Date(year + 1, 11, 25).getTime()
        : christmas.getTime();

    setMounted(true);
  }, []);

  // Tick every second
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [mounted]);

  if (!mounted) return null;

  let remainingTime = targetDate.current - currentTime;

  // Year rollover
  if (remainingTime <= 0) {
    const nextYear = currentYear + 1;
    setCurrentYear(nextYear);
    targetDate.current = new Date(nextYear, 11, 25).getTime();
    remainingTime = targetDate.current - currentTime;
  }

  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
  const seconds = Math.floor((remainingTime / 1000) % 60);

  return (
    <>
      <Fireworks remainingTime={remainingTime} />

      <div className="p-[1rem] relative font-christmas font-bold text-white text-shadow-[2px_2px_1px_#000000] flex flex-col gap-10 z-10">
        <h1 className="text-6xl md:text-8xl text-center self-center">
          Christmas Countdown {currentYear}
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
