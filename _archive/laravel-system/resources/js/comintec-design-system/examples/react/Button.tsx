import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md';
};

export const Button: React.FC<Props> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) => {
  const base = `inline-flex items-center justify-center rounded-[var(--radius-sm)] border px-3 whitespace-nowrap select-none`;
  const sizing = size === 'sm' ? 'h-6 text-[13px]' : 'h-8 text-[var(--font-size-md)]';
  const theme =
    variant === 'primary'
      ? [
          'border-[color:var(--border-color-light)]',
          'bg-[var(--bg-secondary)]',
          'text-[color:var(--font-color-secondary)]',
          'hover:bg-[var(--bg-tertiary)]',
          'active:bg-[var(--bg-quaternary)]',
        ].join(' ')
      : variant === 'secondary'
        ? [
            'border-[color:var(--border-color-medium)]',
            'bg-[transparent]',
            'text-[color:var(--font-color-secondary)]',
            'hover:bg-[var(--bg-transparent-light)]',
            'active:bg-[var(--bg-transparent-medium)]',
          ].join(' ')
        : [
            'border-transparent',
            'bg-[transparent]',
            'text-[color:var(--font-color-secondary)]',
            'hover:bg-[var(--bg-transparent-light)]',
            'active:bg-[var(--bg-transparent-medium)]',
          ].join(' ');

  return (
    <button
      {...rest}
      className={`${base} ${sizing} ${theme} ${className}`}
      style={{ transition: 'var(--clickable-bg-transition)' }}
    >
      {children}
    </button>
  );
};
