import type { ReactNode, MouseEventHandler } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function Card({
  children,
  className = "",
  header,
  footer,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface-card border border-surface-border rounded-[var(--radius-card)] ${onClick ? "cursor-pointer hover:bg-surface-hover transition-colors" : ""} ${className}`}
    >
      {header && (
        <div className="px-6 py-4 border-b border-surface-border">
          {header}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-surface-border">
          {footer}
        </div>
      )}
    </div>
  );
}
