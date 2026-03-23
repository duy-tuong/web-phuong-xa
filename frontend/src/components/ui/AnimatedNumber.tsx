"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedNumberProps {
  value: string;
  duration?: number;
}

export default function AnimatedNumber({ value, duration = 2000 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const countRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Observer để chỉ chạy animation khi cuộn tới vị trí tử
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Tách phần chữ và phần số (hỗ trợ các dạng: "~45", "1.200+", "137.387")
    const numMatch = value.match(/[\d.]+/);
    if (!numMatch) {
      setDisplayValue(value);
      return;
    }

    const numericString = numMatch[0];
    const prefix = value.substring(0, numMatch.index);
    const suffix = value.substring(numMatch.index! + numericString.length);

    // Xóa dấu chấm phân cách hàng nghìn để lấy số thực tế
    const targetNumber = parseFloat(numericString.replace(/\./g, ""));
    const isFloat = numericString.includes(".") && numericString.split(".")[1].length > 0 && targetNumber < 1000;
    
    // Nếu là diện tích nhỏ kiểu 7.333 (nhưng format vi-VN hay en-US có thể nhầm lẫn với dấu chấm phần ngàn)
    // Thực tế ở đây 7.333 và 137.387 là dấu chấm ngàn theo chuẩn VN. Ta parse ra số int.
    
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Hiệu ứng easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentNumber = Math.floor(easeProgress * targetNumber);
      
      // Format lại với dấu chấm (vi-VN standard)
      const formattedNumber = new Intl.NumberFormat("vi-VN").format(currentNumber);
      
      setDisplayValue(`${prefix}${formattedNumber}${suffix}`);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // Đảm bảo số kết thúc chính xác bằng giá trị gốc
        setDisplayValue(value);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration, isVisible]);

  return <span ref={countRef}>{displayValue}</span>;
}
