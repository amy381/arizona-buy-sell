"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number | null;
  prefix?: string;
  suffix?: string;
  label: string;
  display?: string; // static display (no animation)
}

const STATS: Stat[] = [
  { value: 100, prefix: "$", suffix: "M+", label: "In Real Estate Sold" },
  { value: 650, suffix: "+",               label: "Transactions Closed" },
  { value: null, display: "Top 2",         label: "In the Southwest Region" },
  { value: null, display: "Top 1%",        label: "In Arizona" },
];

function useCountUp(target: number, duration: number, started: boolean): number {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setCount(Math.floor(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [started, target, duration]);

  return count;
}

function CountStat({ stat, started }: { stat: Stat; started: boolean }) {
  const count = useCountUp(stat.value ?? 0, 2000, started && stat.value !== null);

  if (stat.display) {
    return (
      <span
        className={`text-linen font-medium text-4xl md:text-5xl${started ? " stats-fade-in" : " opacity-0"}`}
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        {stat.display}
      </span>
    );
  }

  return (
    <span
      className="text-linen font-medium text-4xl md:text-5xl"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {stat.prefix}{count}{stat.suffix}
    </span>
  );
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-steel w-full py-14 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center text-center gap-2">
            <CountStat stat={stat} started={started} />
            <span
              className="text-brand-stone text-sm leading-snug max-w-[140px]"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
