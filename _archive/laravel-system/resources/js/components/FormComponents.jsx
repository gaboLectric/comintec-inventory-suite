import styled from '@emotion/styled';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const FormRowStyled = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$columns || '1fr'};
  gap: var(--space-4);
`;

export const FormRow = styled(FormRowStyled, {
  shouldForwardProp: (prop) => !['$columns'].includes(prop)
})`
  display: grid;
  grid-template-columns: ${props => props.$columns || '1fr'};
  gap: var(--space-4);
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

export const Label = styled.label`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--font-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Input = styled.input`
  padding: var(--space-3);
  background: var(--bg-primary);
  border: 1px solid var(--border-color-strong);
  border-radius: var(--radius-sm);
  color: var(--font-color-primary);
  font-size: var(--font-size-md);
  font-family: var(--font-family);

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &::placeholder {
    color: var(--font-color-tertiary);
  }
`;

export const Select = styled.select`
  padding: var(--space-3);
  background: var(--bg-primary);
  border: 1px solid var(--border-color-strong);
  border-radius: var(--radius-sm);
  color: var(--font-color-primary);
  font-size: var(--font-size-md);
  font-family: var(--font-family);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  option {
    background: var(--bg-secondary);
    color: var(--font-color-primary);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  margin-top: var(--space-2);
`;

const ButtonStyled = styled.button`
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

export const Button = styled(ButtonStyled, {
  shouldForwardProp: (prop) => !['$variant'].includes(prop)
})`
  padding: var(--space-3) var(--space-5);
  background: ${props => props.$variant === 'secondary'
        ? '#3e3e3a'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
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
