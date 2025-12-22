import styled from '@emotion/styled';
import React from 'react';

const Card = styled.div`
  background: var(--glass-bg-medium);
  backdrop-filter: blur(var(--glass-blur-medium));
  -webkit-backdrop-filter: blur(var(--glass-blur-medium));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  transition: all var(--transition-normal);
  box-shadow: var(--glass-shadow);
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(16px)) {
    background: var(--bg-secondary);
    border-color: var(--border-color-strong);
  }
  
  &:hover {
    background: var(--glass-bg-strong);
    backdrop-filter: blur(var(--glass-blur-strong));
    -webkit-backdrop-filter: blur(var(--glass-blur-strong));
    border-color: var(--glass-border-hover);
    box-shadow: var(--glass-shadow-elevated);
    transform: translateY(-4px);
    
    /* Fallback for browsers without backdrop-filter support */
    @supports not (backdrop-filter: blur(24px)) {
      background: var(--bg-tertiary);
      box-shadow: var(--shadow-strong);
    }
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

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--glass-bg-strong);
  backdrop-filter: blur(var(--glass-blur-strong));
  -webkit-backdrop-filter: blur(var(--glass-blur-strong));
  border: 1px solid var(--glass-border-hover);
  box-shadow: var(--glass-shadow);
  transition: all var(--transition-fast);
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(24px)) {
    background: var(--bg-quaternary);
    border-color: var(--border-color-strong);
  }

  svg {
    width: 24px;
    height: 24px;
    color: var(--accent-blue);
    transition: all var(--transition-fast);
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: var(--glass-shadow-elevated);
    
    svg {
      color: var(--accent-purple);
    }
  }
`;

const CardValue = styled.div`
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-semibold);
  color: var(--font-color-primary);
  line-height: 1;
  transition: all var(--transition-fast);
`;

const CardTrend = styled.div`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  background: var(--glass-bg-light);
  backdrop-filter: blur(var(--glass-blur-light));
  -webkit-backdrop-filter: blur(var(--glass-blur-light));
  border: 1px solid var(--glass-border);
  width: fit-content;
  transition: all var(--transition-fast);

  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(10px)) {
    background: var(--bg-tertiary);
  }

  ${props => props.$positive ? `
    color: var(--accent-green);
    
    &:hover {
      background: rgba(52, 199, 89, 0.1);
      border-color: var(--accent-green);
    }
  ` : `
    color: var(--accent-red);
    
    &:hover {
      background: rgba(255, 59, 48, 0.1);
      border-color: var(--accent-red);
    }
  `}
`;

export const StatCard = React.memo(function StatCard({ title, value, icon: Icon, trend }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {Icon && (
          <IconWrapper>
            <Icon />
          </IconWrapper>
        )}
      </CardHeader>
      <CardValue>{value}</CardValue>
      {trend && (
        <CardTrend $positive={trend.isPositive}>
          {trend.isPositive ? '↗' : '↘'} {trend.value}
        </CardTrend>
      )}
    </Card>
  );
});
