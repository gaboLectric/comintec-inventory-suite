/**
 * Unit tests for MobileCard component
 * Feature: mobile-responsive-optimization
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileCard } from '../components/MobileCard';

describe('MobileCard Component', () => {
  const mockItem = {
    id: '1',
    name: 'Test Item',
    description: 'Test Description',
    category: 'Test Category',
    status: 'active',
    image: 'test-image.jpg'
  };

  const mockColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { header: 'Category', accessor: 'category', render: (item) => `Category: ${item.category}` },
    { header: 'Status', accessor: 'status' }
  ];

  it('should render basic card structure', () => {
    render(
      <MobileCard
        item={mockItem}
        titleField="name"
        subtitleField="description"
      />
    );

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render image when imageField is provided', () => {
    render(
      <MobileCard
        item={mockItem}
        titleField="name"
        imageField="image"
      />
    );

    const image = screen.getByAltText('Test Item');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');
  });

  it('should render secondary fields correctly', () => {
    render(
      <MobileCard
        item={mockItem}
        columns={mockColumns}
        titleField="name"
        secondaryFields={['category', 'status']}
      />
    );

    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Category: Test Category')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('should render actions when provided', () => {
    const mockAction = <button>Edit</button>;
    
    render(
      <MobileCard
        item={mockItem}
        titleField="name"
        actions={mockAction}
      />
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('should render footer content when provided', () => {
    const footerContent = <div>Footer Content</div>;
    
    render(
      <MobileCard
        item={mockItem}
        titleField="name"
        footerContent={footerContent}
      />
    );

    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('should handle click events when onCardClick is provided', () => {
    const mockClick = vi.fn();
    
    render(
      <MobileCard
        item={mockItem}
        titleField="name"
        onCardClick={mockClick}
      />
    );

    const card = screen.getByText('Test Item').closest('[data-testid]') || 
                 screen.getByText('Test Item').closest('div');
    
    fireEvent.click(card);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('should apply hover styling when onCardClick is provided', () => {
    render(
      <MobileCard
        item={mockItem}
        titleField="name"
        onCardClick={() => {}}
      />
    );

    // Find the GlassCard component (the actual clickable element)
    const cardElement = screen.getByText('Test Item').closest('[style*="cursor"]');
    expect(cardElement).toHaveAttribute('style', expect.stringContaining('cursor: pointer'));
  });

  it('should not render empty secondary fields', () => {
    const itemWithEmptyFields = {
      ...mockItem,
      emptyField: '',
      nullField: null,
      undefinedField: undefined
    };

    render(
      <MobileCard
        item={itemWithEmptyFields}
        columns={mockColumns}
        titleField="name"
        secondaryFields={['emptyField', 'nullField', 'undefinedField', 'category']}
      />
    );

    // Should only render category field
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.queryByText('Emptyfield')).not.toBeInTheDocument();
    expect(screen.queryByText('Nullfield')).not.toBeInTheDocument();
    expect(screen.queryByText('Undefinedfield')).not.toBeInTheDocument();
  });

  it('should truncate long titles and subtitles', () => {
    const longItem = {
      ...mockItem,
      name: 'This is a very long title that should be truncated when displayed in the mobile card',
      description: 'This is a very long description that should also be truncated when displayed'
    };

    render(
      <MobileCard
        item={longItem}
        titleField="name"
        subtitleField="description"
      />
    );

    const title = screen.getByText(longItem.name);
    const subtitle = screen.getByText(longItem.description);

    // Check that elements have truncation styles
    expect(title).toHaveStyle({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    });

    expect(subtitle).toHaveStyle({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    });
  });

  it('should use custom column render function when available', () => {
    render(
      <MobileCard
        item={mockItem}
        columns={mockColumns}
        titleField="name"
        secondaryFields={['category']}
      />
    );

    // Should use the custom render function for category
    expect(screen.getByText('Category: Test Category')).toBeInTheDocument();
  });

  it('should apply different glass variants', () => {
    const { rerender } = render(
      <MobileCard
        item={mockItem}
        titleField="name"
        variant="light"
      />
    );

    let card = screen.getByText('Test Item').closest('div');
    expect(card).toBeInTheDocument();

    rerender(
      <MobileCard
        item={mockItem}
        titleField="name"
        variant="strong"
      />
    );

    card = screen.getByText('Test Item').closest('div');
    expect(card).toBeInTheDocument();
  });

  it('should handle missing item gracefully', () => {
    render(
      <MobileCard
        item={null}
        titleField="name"
        subtitleField="description"
      />
    );

    // Should render without crashing
    expect(screen.queryByText('Test Item')).not.toBeInTheDocument();
  });

  it('should handle missing fields gracefully', () => {
    render(
      <MobileCard
        item={mockItem}
        titleField="nonexistentField"
        subtitleField="anotherNonexistentField"
      />
    );

    // Should render without crashing, but without title/subtitle
    expect(screen.queryByText('Test Item')).not.toBeInTheDocument();
  });
});