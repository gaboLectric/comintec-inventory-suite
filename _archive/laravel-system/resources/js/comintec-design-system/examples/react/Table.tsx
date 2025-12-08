import React from 'react';

type Col<T> = { key: keyof T; header: string; width?: number };

type Props<T extends Record<string, any>> = {
  columns: Col<T>[];
  rows: T[];
};

export function Table<T extends Record<string, any>>({ columns, rows }: Props<T>) {
  return (
    <div className="overflow-auto shadow-[var(--shadow-light)] rounded-[var(--radius-sm)] border border-[color:var(--border-color-light)] bg-[var(--bg-primary)]">
      <table className="min-w-full border-collapse">
        <thead className="text-left sticky top-0 bg-[var(--bg-primary)] z-10">
          <tr>
            {columns.map((c, i) => (
              <th
                key={String(c.key)}
                className={`text-[color:var(--font-color-secondary)] font-medium text-[13px] border-b border-[color:var(--border-color-light)] ${
                  i === 0 ? 'sticky left-0 z-20 bg-[var(--bg-primary)]' : ''
                }`}
                style={{ width: c.width ? `${c.width}px` : undefined }}
              >
                <div className="px-2 py-2">{c.header}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="align-top">
              {columns.map((c, ci) => (
                <td
                  key={String(c.key)}
                  className={`text-[color:var(--font-color-primary)] text-[13px] border-b border-[color:var(--border-color-light)] ${
                    ci === 0 ? 'sticky left-0 z-10 bg-[var(--bg-primary)]' : ''
                  }`}
                  style={{ width: c.width ? `${c.width}px` : undefined }}
                >
                  <div className="px-2 py-2">{String(r[c.key])}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
