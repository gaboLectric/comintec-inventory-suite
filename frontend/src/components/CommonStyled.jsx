import styled from '@emotion/styled';

const getButtonBackground = (variant) => {
  switch (variant) {
    case 'secondary':
      return '#3B82F6'; // Azul sólido
    case 'danger':
      return '#EF4444'; // Rojo sólido
    case 'success':
      return '#22C55E'; // Verde sólido
    case 'warning':
      return '#F59E0B'; // Ámbar sólido
    case 'ghost':
      return 'transparent';
    case 'primary':
    default:
      return '#FF6B35'; // Naranja vibrante (primary)
  }
};

const getButtonHoverBackground = (variant) => {
  switch (variant) {
    case 'secondary':
      return '#2563EB';
    case 'danger':
      return '#DC2626';
    case 'success':
      return '#16A34A';
    case 'warning':
      return '#D97706';
    case 'ghost':
      return 'var(--glass-bg-light)';
    case 'primary':
    default:
      return '#E85A2A';
  }
};

export const ButtonStyled = styled.button`
  padding: var(--space-3) var(--space-5);
  background: ${props => getButtonBackground(props.$variant)};
  color: ${props => props.$variant === 'ghost' ? 'var(--font-color-primary)' : 'white'};
  border: ${props => props.$variant === 'ghost' ? '1px solid var(--glass-border)' : 'none'};
  border-radius: var(--radius-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--anim-duration-fast);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);

  &:hover:not(:disabled) {
    background: ${props => getButtonHoverBackground(props.$variant)};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;
