import React from 'react';
import styled from '@emotion/styled';


const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-6);
  background: var(--glass-bg-medium);
  backdrop-filter: blur(var(--glass-blur-medium));
  -webkit-backdrop-filter: blur(var(--glass-blur-medium));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--glass-shadow);
  min-height: ${props => props.$fullHeight ? '200px' : 'auto'};
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(16px)) {
    background: var(--bg-secondary);
    border-color: var(--border-color-strong);
  }
`;

const Spinner = styled.div`
  width: ${props => props.$size === 'sm' ? '24px' : props.$size === 'lg' ? '48px' : '32px'};
  height: ${props => props.$size === 'sm' ? '24px' : props.$size === 'lg' ? '48px' : '32px'};
  border: 3px solid var(--glass-border);
  border-top: 3px solid var(--accent-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  /* Respect user's motion preferences */
  @media (prefers-reduced-motion: reduce) {
    animation: pulse 2s ease-in-out infinite;
    border-top-color: var(--accent-blue);
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
`;

const LoadingText = styled.p`
  color: var(--font-color-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin: 0;
  text-align: center;
`;

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
`;

const SkeletonLine = styled.div`
  height: ${props => props.$height || '16px'};
  width: ${props => props.$width || '100%'};
  background: var(--glass-bg-light);
  backdrop-filter: blur(var(--glass-blur-light));
  -webkit-backdrop-filter: blur(var(--glass-blur-light));
  border-radius: var(--radius-sm);
  animation: pulse 1.5s ease-in-out infinite;
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(10px)) {
    background: var(--bg-tertiary);
  }
  
  /* Respect user's motion preferences */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.6;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
`;

const InlineSpinner = styled(Spinner)`
  display: inline-block;
  vertical-align: middle;
  margin-right: var(--space-2);
`;

// Main Loading component with spinner
export const Loading = ({ 
  size = 'md', 
  text = 'Cargando...', 
  fullHeight = false,
  className,
  ...props
}) => {
  return (
    <LoadingContainer $fullHeight={fullHeight} className={className} {...props}>
      <Spinner $size={size} />
      {text && <LoadingText>{text}</LoadingText>}
    </LoadingContainer>
  );
};

// Inline spinner for buttons or small spaces
export const LoadingSpinner = ({ size = 'sm', ...props }) => {
  return <InlineSpinner $size={size} {...props} />;
};

// Skeleton loader for content placeholders
export const LoadingSkeleton = ({ lines = 3, className, ...props }) => {
  return (
    <LoadingContainer className={className} {...props}>
      <SkeletonContainer>
        {Array.from({ length: lines }, (_, i) => (
          <SkeletonLine 
            key={i}
            $width={i === lines - 1 ? '60%' : '100%'}
            $height={i === 0 ? '20px' : '16px'}
          />
        ))}
      </SkeletonContainer>
    </LoadingContainer>
  );
};

// Card skeleton for dashboard stats
export const LoadingCard = ({ ...props }) => {
  return (
    <LoadingContainer {...props}>
      <SkeletonContainer>
        <SkeletonLine $height="24px" $width="70%" />
        <SkeletonLine $height="32px" $width="40%" />
        <SkeletonLine $height="16px" $width="90%" />
      </SkeletonContainer>
    </LoadingContainer>
  );
};

export default Loading;
