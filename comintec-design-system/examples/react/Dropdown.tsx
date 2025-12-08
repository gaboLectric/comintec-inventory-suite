import React, { useEffect, useRef, useState } from 'react';

type Item = { id: string; label: string };

type Props = {
  items: Item[];
  onSelect?: (item: Item) => void;
  buttonClassName?: string;
  menuClassName?: string;
};

export const Dropdown: React.FC<Props> = ({ items, onSelect, buttonClassName = '', menuClassName = '' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center h-8 px-3 rounded-[var(--radius-sm)] border border-[color:var(--border-color-light)] bg-[var(--bg-secondary)] text-[color:var(--font-color-secondary)] hover:bg-[var(--bg-tertiary)] active:bg-[var(--bg-quaternary)] ${buttonClassName}`}
        style={{ transition: 'var(--clickable-bg-transition)' }}
      >
        Seleccionar
        <svg className="ml-2" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2"/></svg>
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute mt-1 min-w-[160px] right-0 z-50 rounded-[var(--radius-sm)] border border-[color:var(--border-color-light)] bg-[var(--bg-primary)] shadow-[var(--shadow-light)] ${menuClassName}`}
        >
          <ul className="py-1">
            {items.map((it) => (
              <li key={it.id}>
                <button
                  role="menuitem"
                  className="w-full text-left px-3 py-2 text-[13px] text-[color:var(--font-color-primary)] hover:bg-[var(--bg-transparent-light)] active:bg-[var(--bg-transparent-medium)]"
                  onClick={() => { setOpen(false); onSelect?.(it); }}
                >
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
