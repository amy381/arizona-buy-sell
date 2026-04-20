"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

interface FadeInProps {
  children:   ReactNode;
  delay?:     number;
  threshold?: number;
  className?: string;
  style?:     CSSProperties;
}

export default function FadeIn({
  children,
  delay     = 0,
  threshold = 0.2,
  className,
  style,
}: FadeInProps) {
  const ref             = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 1s ease-out ${delay}ms, transform 1s ease-out ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
