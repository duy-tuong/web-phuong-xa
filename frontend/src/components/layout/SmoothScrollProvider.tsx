// Công dụng: Đây là một component provider dùng để tạo hiệu ứng cuộn mượt (smooth scrolling) cho toàn bộ ứng dụng.
// Khi được bọc quanh các component con, nó sẽ áp dụng hiệu ứng cuộn mượt cho tất cả các hành động cuộn trên trang.
// Sử dụng thư viện Lenis để thực hiện hiệu ứng cuộn mượt, với các tùy chọn cấu hình như duration, smoothWheel, syncTouch, wheelMultiplier, touchMultiplier.
// Kiểm tra nếu người dùng có thiết lập "prefers-reduced-motion: reduce" để tắt hiệu ứng cuộn mượt nếu họ ưu tiên giảm chuyển động.
// Khi component được unmount, nó sẽ hủy bỏ animation frame và hủy instance của Lenis để tránh rò rỉ bộ nhớ.
"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import Lenis from "lenis";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      syncTouch: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    });

    let frameId = 0;

    const onFrame = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(onFrame);
    };

    frameId = window.requestAnimationFrame(onFrame);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
