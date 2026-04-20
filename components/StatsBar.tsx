"use client";

import { useEffect, useRef, useState } from "react";

const LINEN = "#F0EBE3";
const STONE = "#B8A898";
const SLATE = "#212529";

interface Stat {
  value:   number | null;
  prefix?: string;
  suffix?: string;
  display?: string;
  label:   string;
}

const STATS: Stat[] = [
  { value: 100, prefix: "$", suffix: "M+", label: "In Real Estate Sold"      },
  { value: 650, suffix: "+",               label: "Transactions Closed"       },
  { value: null, display: "Top 2",         label: "In the Southwest Region"   },
  { value: null, display: "Top 1%",        label: "In Arizona"                },
];

function useCountUp(target: number, duration: number, started: boolean): number {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!started) return;
    const t0 = performance.now();

    function tick(now: number) {
      const p      = Math.min((now - t0) / duration, 1);
      const eased  = 1 - Math.pow(1 - p, 3); // cubic ease-out
      setCount(Math.floor(eased * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [started, target, duration]);

  return count;
}

function StatNumber({ stat, started }: { stat: Stat; started: boolean }) {
  const count = useCountUp(stat.value ?? 0, 1200, started && stat.value !== null);

  if (stat.display) {
    return (
      <span
        style={{
          fontFamily:   "var(--font-inter), sans-serif",
          fontWeight:   500,
          fontSize:     56,
          color:        LINEN,
          letterSpacing: "-.02em",
          lineHeight:   1,
          opacity:      started ? 1 : 0,
          transition:   "opacity 0.8s ease-out",
        }}
      >
        {stat.display}
      </span>
    );
  }

  return (
    <span style={{
      fontFamily:   "var(--font-inter), sans-serif",
      fontWeight:   500,
      fontSize:     56,
      color:        LINEN,
      letterSpacing: "-.02em",
      lineHeight:   1,
    }}>
      {stat.prefix}{count}{stat.suffix}
    </span>
  );
}

export default function StatsBar() {
  const ref                 = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{ background: SLATE }}
      className="py-[80px] px-12"
    >
      <div
        className="max-w-[1240px] mx-auto grid grid-cols-2 desk:grid-cols-4"
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              textAlign:   "center",
              padding:     "24px 12px",
              borderRight: i < STATS.length - 1 ? "1px solid rgba(240,235,227,.08)" : "none",
            }}
          >
            <StatNumber stat={stat} started={started} />
            <p style={{
              fontFamily:   "var(--font-inter), sans-serif",
              fontSize:     12,
              color:        STONE,
              textTransform: "uppercase",
              letterSpacing: ".2em",
              marginTop:    12,
              margin:       "12px 0 0",
            }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
