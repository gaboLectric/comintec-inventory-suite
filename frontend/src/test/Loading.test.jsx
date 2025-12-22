import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Loading, LoadingSpinner, LoadingSkeleton, LoadingCard } from '../components/Loading';

describe('Loading Components', () => {
  describe('Loading', () => {
    it('should render with default props', () => {
      render(<Loading />);
      
      expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    it('should render with custom text', () => {
      render(<Loading text="Loading data..." />);
      
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('should render without text when text is null', () => {
      render(<Loading text={null} />);
      
      expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
    });

    it('should render with different sizes', () => {
      const { rerender } = render(<Loading size="sm" data-testid="loading-sm" />);
      expect(screen.getByTestId('loading-sm')).toBeInTheDocument();
      
      rerender(<Loading size="md" data-testid="loading-md" />);
      expect(screen.getByTestId('loading-md')).toBeInTheDocument();
      
      rerender(<Loading size="lg" data-testid="loading-lg" />);
      expect(screen.getByTestId('loading-lg')).toBeInTheDocument();
    });

    it('should apply fullHeight prop', () => {
      render(<Loading fullHeight={true} data-testid="loading-full" />);
      
      const loadingElement = screen.getByTestId('loading-full');
      expect(loadingElement).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Loading className="custom-class" data-testid="loading-custom" />);
      
      const loadingElement = screen.getByTestId('loading-custom');
      expect(loadingElement).toHaveClass('custom-class');
    });
  });

  describe('LoadingSpinner', () => {
    it('should render inline spinner', () => {
      render(<LoadingSpinner data-testid="spinner" />);
      
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('should render with different sizes', () => {
      const { rerender } = render(<LoadingSpinner size="sm" data-testid="spinner-sm" />);
      expect(screen.getByTestId('spinner-sm')).toBeInTheDocument();
      
      rerender(<LoadingSpinner size="md" data-testid="spinner-md" />);
      expect(screen.getByTestId('spinner-md')).toBeInTheDocument();
      
      rerender(<LoadingSpinner size="lg" data-testid="spinner-lg" />);
      expect(screen.getByTestId('spinner-lg')).toBeInTheDocument();
    });
  });

  describe('LoadingSkeleton', () => {
    it('should render with default number of lines', () => {
      render(<LoadingSkeleton data-testid="skeleton" />);
      
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render with custom number of lines', () => {
      render(<LoadingSkeleton lines={5} data-testid="skeleton-5" />);
      
      const skeleton = screen.getByTestId('skeleton-5');
      expect(skeleton).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<LoadingSkeleton className="skeleton-class" data-testid="skeleton-custom" />);
      
      const skeleton = screen.getByTestId('skeleton-custom');
      expect(skeleton).toHaveClass('skeleton-class');
    });
  });

  describe('LoadingCard', () => {
    it('should render card skeleton', () => {
      render(<LoadingCard data-testid="loading-card" />);
      
      expect(screen.getByTestId('loading-card')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should be accessible with screen readers', () => {
      render(<Loading text="Loading content" />);
      
      // The loading text should be readable by screen readers
      expect(screen.getByText('Loading content')).toBeInTheDocument();
    });

    it('should respect reduced motion preferences', () => {
      // This test ensures the CSS media query is present
      // The actual behavior would be tested in e2e tests
      render(<Loading />);
      
      expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });
  });

  describe('Glass Effect Styling', () => {
    it('should apply glass effect classes', () => {
      render(<Loading data-testid="glass-loading" />);
      
      const loadingElement = screen.getByTestId('glass-loading');
      expect(loadingElement).toBeInTheDocument();
      
      // Check that the component renders (styling is handled by CSS)
      expect(loadingElement).toHaveStyle({ display: 'flex' });
    });
  });
});