import type { ReactNode } from "react";

interface TableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

export default function Table({ headers, children, className = "" }: TableProps) {
  return (
    <div
      className={`overflow-x-auto rounded-[var(--radius-card)] border border-surface-border bg-surface-card ${className}`}
    >
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-surface-border">
            {headers.map((header) => (
              <th
                key={header}
                className="whitespace-nowrap px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/50"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border">{children}</tbody>
      </table>
    </div>
  );
}
