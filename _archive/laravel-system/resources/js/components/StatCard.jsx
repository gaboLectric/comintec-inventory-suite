import styled from '@emotion/styled';

const Card = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color-strong);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  transition: all var(--anim-duration-fast);
  
  &:hover {
    box-shadow: var(--shadow-strong);
    transform: translateY(-2px);
    border-color: var(--border-color-medium);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardTitle = styled.h3`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--font-color-secondary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const IconWrapperStyled = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

const IconWrapper = styled(IconWrapperStyled, {
  shouldForwardProp: (prop) => !['$gradient'].includes(prop)
})`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

const CardValue = styled.div`
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  color: var(--font-color-primary);
  line-height: 1;
`;

const CardTrendStyled = styled.div`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  display: flex;
  align-items: center;
  gap: var(--space-1);

  ${props => props.$positive ? `
    color: var(--color-green-600);
  ` : `
    color: var(--color-red-600);
  `}
`;

const CardTrend = styled(CardTrendStyled, {
  shouldForwardProp: (prop) => !['$positive'].includes(prop)
})`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  display: flex;
  align-items: center;
  gap: var(--space-1);

  ${props => props.$positive ? `
    color: var(--color-green-600);
  ` : `
    color: var(--color-red-600);
  `}
`;

export function StatCard({ title, value, icon: Icon, trend, gradient }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {Icon && (
          <IconWrapper $gradient={gradient}>
            <Icon />
          </IconWrapper>
        )}
      </CardHeader>
      <CardValue>{value}</CardValue>
      {trend && (
        <CardTrend $positive={trend.isPositive}>
          {trend.isPositive ? '↑' : '↓'} {trend.value}
        </CardTrend>
      )}
    </Card>
  );
}
