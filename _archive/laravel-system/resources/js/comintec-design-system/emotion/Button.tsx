import React from 'react';
import styled from '@emotion/styled';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'sm' | 'md';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const StyledButton = styled.button<Required<Pick<Props, 'variant' | 'size'>>>`
  align-items: center;
  display: inline-flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(1)};
  height: ${({ size }) => (size === 'sm' ? '24px' : '32px')};
  padding: 0 ${({ theme }) => theme.spacing(2)};

  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  white-space: nowrap;

  border-radius: ${({ theme }) => theme.border.radius.sm};
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
  transition: ${({ theme }) => theme.clickableElementBackgroundTransition};

  ${({ theme, variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.background.secondary};
          color: ${theme.font.color.secondary};
          border-color: ${theme.border.color.light};
          &:hover { background: ${theme.background.tertiary}; }
          &:active { background: ${theme.background.quaternary}; }
        `;
      case 'secondary':
        return `
          background: transparent;
          color: ${theme.font.color.secondary};
          border-color: ${theme.border.color.medium};
          &:hover { background: ${theme.background.transparent.light}; }
          &:active { background: ${theme.background.transparent.medium}; }
        `;
      case 'tertiary':
      default:
        return `
          background: transparent;
          color: ${theme.font.color.secondary};
          border-color: transparent;
          &:hover { background: ${theme.background.transparent.light}; }
          &:active { background: ${theme.background.transparent.medium}; }
        `;
    }
  }}
`;

export const Button: React.FC<Props> = ({ variant = 'primary', size = 'md', ...rest }) => {
  return <StyledButton variant={variant} size={size} {...rest} />;
};
