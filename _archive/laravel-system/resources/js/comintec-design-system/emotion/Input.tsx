import React from 'react';
import styled from '@emotion/styled';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Label = styled.label`
  display: block;
  font-size: 13px;
  color: var(--font-color-secondary);
  margin-bottom: 4px;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 32px;
  padding: 0 8px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color-light);
  background: var(--bg-primary);
  color: var(--font-color-primary);
  transition: var(--clickable-bg-transition);

  &:hover { background: var(--bg-secondary); }
  &:focus { outline: none; background: var(--bg-tertiary); border-color: var(--border-color-medium); }
`;

export const Input: React.FC<InputProps> = ({ label, ...rest }) => (
  <div>
    {label ? <Label>{label}</Label> : null}
    <StyledInput {...rest} />
  </div>
);
