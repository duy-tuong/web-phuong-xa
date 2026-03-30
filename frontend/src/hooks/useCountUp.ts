// Công dụng: Hook tùy chỉnh để tạo hiệu ứng số đếm lên (count up) khi phần tử xuất hiện trên màn hình
"use client";

import { useEffect, useState, useRef } from "react";

/**
 * Hook cho hiệu ứng số chạy từ 0 đến một số cụ thể khi hiển thị trên màn hình
 * @param end Giá trị số cuối cùng cần đạt được (ví dụ: "137.387" hoặc "73,33")
 * @param duration Thời gian hiệu ứng chạy (miligiây)
 */
export function useCountUp(end: string, duration: number = 2000) {
  const [count, setCount] = useState("0");
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    // Chuyển đổi chuỗi "137.387" hay "1,734" thành số thập phân thuần túy
    const targetNumber = parseFloat(end.replace(/\./g, "").replace(/,/g, "."));
    let startTime: number | null = null;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Hàm gia tốc giảm dần (easeOut Cubic) 
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = targetNumber * easeOut;

      // Định dạng lại theo chuẩn tiếng Việt
      if (end.includes(",")) {
        setCount(currentVal.toFixed(2).replace(".", ","));
      } else {
        setCount(Math.floor(currentVal).toLocaleString("vi-VN").replace(/,/g, "."));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end); // Neo chính xác số cuối cùng khi kết thúc
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, isVisible, duration]);

  return { count, ref };
}
