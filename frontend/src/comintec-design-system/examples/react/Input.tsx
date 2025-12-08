import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };

export const Input: React.FC<Props> = ({ label, className = '', ...rest }) => (
  <div>
    {label ? (
      <label className="block text-[13px] text-[color:var(--font-color-secondary)] mb-1">{label}</label>
    ) : null}
    <input
      {...rest}
      className={`w-full h-8 px-2 rounded-[var(--radius-sm)] border border-[color:var(--border-color-light)] bg-[var(--bg-primary)] text-[color:var(--font-color-primary)] hover:bg-[var(--bg-secondary)] focus:outline-none focus:bg-[var(--bg-tertiary)] focus:border-[color:var(--border-color-medium)] ${className}`}
      style={{ transition: 'var(--clickable-bg-transition)' }}
    />
  </div>
);
