//Hiển thị số liệu động, tự động tăng/giảm số khi render (dùng cho thống kê, dashboard).
"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: string;
  duration?: number;
}

export default function AnimatedNumber({ value, duration = 2000 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const countRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const numMatch = value.match(/[\d.]+/);
    if (!numMatch) {
      const frameId = window.requestAnimationFrame(() => setDisplayValue(value));
      return () => window.cancelAnimationFrame(frameId);
    }

    const numericString = numMatch[0];
    const prefix = value.substring(0, numMatch.index);
    const suffix = value.substring(numMatch.index! + numericString.length);
    const targetNumber = parseFloat(numericString.replace(/\./g, ""));

    let frameId = 0;
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentNumber = Math.floor(easeProgress * targetNumber);
      const formattedNumber = new Intl.NumberFormat("vi-VN").format(currentNumber);

      setDisplayValue(`${prefix}${formattedNumber}${suffix}`);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, [value, duration, isVisible]);

  return <span ref={countRef}>{displayValue}</span>;
}
