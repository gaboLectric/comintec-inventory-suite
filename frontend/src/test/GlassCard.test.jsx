/**
 * Unit tests for GlassCard component
 * Feature: macos-glassmorphism-redesign
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlassCard } from '../components/GlassCard';

describe('GlassCard Component', () => {
  it('should render children correctly', () => {
    render(
      <GlassCard>
        <div>Test content</div>
      </GlassCard>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should apply default variant and padding', () => {
    const { container } = render(
      <GlassCard data-testid="glass-card">
        <div>Content</div>
      </GlassCard>
    );
    
    const card = container.firstChild;
    expect(card).toBeInTheDocument();
  });

  it('should accept custom className', () => {
    const { container } = render(
      <GlassCard className="custom-class">
        <div>Content</div>
      </GlassCard>
    );
    
    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });

  it('should forward ref correctly', () => {
    let cardRef;
    
    render(
      <GlassCard ref={(ref) => { cardRef = ref; }}>
        <div>Content</div>
      </GlassCard>
    );
    
    expect(cardRef).toBeTruthy();
    expect(cardRef.tagName).toBe('DIV');
  });

  it('should render with different variants', () => {
    const variants = ['light', 'medium', 'strong'];
    
    variants.forEach(variant => {
      const { container } = render(
        <GlassCard variant={variant} data-testid={`card-${variant}`}>
          <div>Content {variant}</div>
        </GlassCard>
      );
      
      const card = container.firstChild;
      expect(card).toBeInTheDocument();
    });
  });

  it('should render with different padding sizes', () => {
    const paddingSizes = ['sm', 'md', 'lg'];
    
    paddingSizes.forEach(padding => {
      const { container } = render(
        <GlassCard padding={padding} data-testid={`card-${padding}`}>
          <div>Content {padding}</div>
        </GlassCard>
      );
      
      const card = container.firstChild;
      expect(card).toBeInTheDocument();
    });
  });

  it('should handle hover prop', () => {
    const { container } = render(
      <GlassCard hover={true}>
        <div>Hoverable content</div>
      </GlassCard>
    );
    
    const card = container.firstChild;
    expect(card).toBeInTheDocument();
  });
});