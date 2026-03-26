import type { ReactNode } from "react";

export default function UserTemplate({ children }: { children: ReactNode }) {
  return <div className="page-transition-enter">{children}</div>;
}
