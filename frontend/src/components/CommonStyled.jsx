import styled from '@emotion/styled';

export const ButtonStyled = styled.button`
  padding: var(--space-3) var(--space-5);
  background: ${props => props.$variant === 'secondary'
        ? 'var(--bg-tertiary)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: ${props => props.$variant === 'secondary' ? 'var(--font-color-primary)' : 'white'};
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--anim-duration-fast);

  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
`;
