/**
 * Unit tests for ResponsiveTable component
 * Feature: mobile-responsive-optimization
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ResponsiveTable } from '../components/ResponsiveTable';

// Mock the hooks
vi.mock('../hooks', () => ({
  useDebounce: (value, delay) => value, // Return value immediately for tests
  useViewport: vi.fn()
}));

import { useViewport } from '../hooks';

describe('ResponsiveTable Component', () => {
  const mockColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Status', accessor: 'status', render: (item) => item.status ? 'Active' : 'Inactive' }
  ];

  const mockData = [
    { id: '1', name: 'John Doe', email: 'john@example.com', status: true },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: false },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: true }
  ];

  const mockPagination = {
    page: 1,
    totalPages: 3,
    totalItems: 25,
    onPageChange: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Desktop Layout (>=768px)', () => {
    beforeEach(() => {
      // Mock desktop viewport
      useViewport.mockReturnValue({
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: false,
        isDesktop: true
      });
    });

    it('should render traditional table layout on desktop', () => {
      render(
        <ResponsiveTable
          columns={mockColumns}
          data={mockData}
        />
      );

      // Should render table elements
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Email' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
    });

    it('should display all data in table rows on desktop', () => {
      render(
        <ResponsiveTable
          columns={mockColumns}
          data={mockData}
        />
      );

      // Should render all data rows
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getAllByText('Active')).toHaveLength(2); // Two active users
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });

    it('should render search functionality on desktop', () => {
      const mockSearch = vi.fn();
      
      render(
        <ResponsiveTable
          columns={mockColumns}
          data={mockData}
          onSearch={mockSearch}
        />
      );

      const searchInput = screen.getByPlaceholderText('Buscar...');
      expect(searchInput).toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: 'john' } });
      expect(searchInput.value).toBe('john');
    });

    it('should render pagination on desktop', () => {
      render(
        <ResponsiveTable
          columns={mockColumns}
          data={mockData}
          pagination={mockPagination}
        />
      );

      expect(screen.getByText('Página 1 de 3 (25 registros)')).toBeInTheDocument();
      expect(screen.getByTitle('Página anterior')).toBeInTheDocument();
      expect(screen.getByTitle('Página siguiente')).toBeInTheDocument();
    });
  });

  describe('Mobile Layout (<768px)', () => {
    beforeEach(() => {
      // Mock mobile viewport
      useViewport.mockReturnValue({
        width: 375,
        height: 667,
        isMobile: true,
        isTablet: false,
        isDesktop: false
      });
    });

    it('should render card layout on mobile', () => {
      render(
        <ResponsiveTable
          columns={mockColumns}
          data={mockData}
          titleField="name"
          subtitleField="email"
        />
      );

      // Should NOT render table elements
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
      
      // Should render cards instead
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('should render mobile-optimized search bar', () => {
      const mockSearch = vi.fn();
      
      render(
        <ResponsiveTable
          columns={mockColumns}
          data={mockData}
          onSearch={mockSearch}
        />
      );

      const searchInput = screen.getByPlaceholderText('Buscar...');
      expect(searchInput).toBeInTheDocument();
      
      // Search input should exist (CSS width is handled by media queries)
      expect(searchInput).toBeInTheDocument();
    });

    it('should render touch-friendly pagination on mobile', () => {
      render(
        <ResponsiveTable
          columns={mockColumns}
          data={mockData}
          pagination={mockPagination}
        />
      );

      const prevButton = screen.getByTitle('Página anterior');
      const nextButton = screen.getByTitle('Página siguiente');
      
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
      
      // Buttons should have minimum touch target size
      expect(prevButton).toHaveStyle('min-width: 44px');
      expect(prevButton).toHaveStyle('min-height: 44px');
      expect(nextButton).toHaveStyle('min-width: 44px');
      expect(nextButton).toHaveStyle('min-height: 44px');
    });

    it('should handle card clicks on mobile', () => {
      const mockCardClick = vi.fn();
      
      render(
        <ResponsiveTable
          columns={mockColumns}
          data={mockData}
          titleField="name"
          onCardClick={mockCardClick}
        />
      );

      const firstCard = screen.getByText('John Doe').closest('[style*="cursor"]');
      expect(firstCard).toBeInTheDocument();
      
      fireEvent.click(firstCard);
      expect(mockCardClick).toHaveBeenCalledWith(mockData[0]);
    });

    it('should use custom mobile card renderer when provided', () => {
      const customRenderer = vi.fn((item) => (
        <div data-testid={`custom-card-${item.id}`}>
          Custom: {item.name}
        </div>
      ));
      
      render(
        <ResponsiveTable
          columns={mockColumns}
          data={mockData}
          mobileCardRenderer={customRenderer}
        />
      );

      expect(customRenderer).toHaveBeenCalledTimes(3);
      expect(screen.getByTestId('custom-card-1')).toBeInTheDocument();
      expect(screen.getByText('Custom: John Doe')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      // Mock desktop viewport for search tests
      useViewport.mockReturnValue({
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: false,
        isDesktop: true
      });
    });

    it('should call search function when input changes', () => {
      const mockSearch = vi.fn();
      
      render(
        <ResponsiveTable
          columns={mockColumns}
          data={mockData}
          onSearch={mockSearch}
        />
      );

      const searchInput = screen.getByPlaceholderText('Buscar...');
      
      fireEvent.change(searchInput, { target: { value: 'john' } });

      // Since we mocked useDebounce to return immediately, search should be called
      expect(mockSearch).toHaveBeenCalledWith('john');
    });
  });

  describe('Pagination Functionality', () => {
    beforeEach(() => {
      // Mock desktop viewport for pagination tests
      useViewport.mockReturnValue({
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: false,
        isDesktop: true
      });
    });

    it('should handle page navigation', () => {
      render(
        <ResponsiveTable
          columns={mockColumns}
          data={mockData}
          pagination={mockPagination}
        />
      );

      const nextButton = screen.getByTitle('Página siguiente');
      fireEvent.click(nextButton);
      
      expect(mockPagination.onPageChange).toHaveBeenCalledWith(2);
    });

    it('should disable previous button on first page', () => {
      render(
        <ResponsiveTable
          columns={mockColumns}
          data={mockData}
          pagination={{ ...mockPagination, page: 1 }}
        />
      );

      const prevButton = screen.getByTitle('Página anterior');
      expect(prevButton).toBeDisabled();
    });

    it('should disable next button on last page', () => {
      render(
        <ResponsiveTable
          columns={mockColumns}
          data={mockData}
          pagination={{ ...mockPagination, page: 3 }}
        />
      );

      const nextButton = screen.getByTitle('Página siguiente');
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Empty State', () => {
    beforeEach(() => {
      // Mock desktop viewport for empty state tests
      useViewport.mockReturnValue({
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: false,
        isDesktop: true
      });
    });

    it('should render empty state when no data', () => {
      render(
        <ResponsiveTable
          columns={mockColumns}
          data={[]}
        />
      );

      expect(screen.getByText('No hay datos')).toBeInTheDocument();
    });

    it('should render empty state in both desktop and mobile', () => {
      const { rerender } = render(
        <ResponsiveTable
          columns={mockColumns}
          data={[]}
        />
      );

      // Desktop
      expect(screen.getByText('No hay datos')).toBeInTheDocument();

      // Switch to mobile
      useViewport.mockReturnValue({
        width: 375,
        height: 667,
        isMobile: true,
        isTablet: false,
        isDesktop: false
      });

      rerender(
        <ResponsiveTable
          columns={mockColumns}
          data={[]}
        />
      );

      expect(screen.getByText('No hay datos')).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    beforeEach(() => {
      // Mock desktop viewport for actions tests
      useViewport.mockReturnValue({
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: false,
        isDesktop: true
      });
    });

    it('should render actions in header', () => {
      const actions = <button>Add New</button>;
      
      render(
        <ResponsiveTable
          columns={mockColumns}
          data={mockData}
          actions={actions}
        />
      );

      expect(screen.getByText('Add New')).toBeInTheDocument();
    });

    it('should render actions on mobile', () => {
      // Mock mobile viewport
      useViewport.mockReturnValue({
        width: 375,
        height: 667,
        isMobile: true,
        isTablet: false,
        isDesktop: false
      });

      const actions = <button>Add New</button>;
      
      render(
        <ResponsiveTable
          columns={mockColumns}
          data={mockData}
          actions={actions}
        />
      );

      expect(screen.getByText('Add New')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should switch layouts when viewport changes', () => {
      // Start with desktop
      useViewport.mockReturnValue({
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: false,
        isDesktop: true
      });

      const { rerender } = render(
        <ResponsiveTable
          columns={mockColumns}
          data={mockData}
          titleField="name"
        />
      );

      // Should show table
      expect(screen.getByRole('table')).toBeInTheDocument();

      // Switch to mobile mock
      useViewport.mockReturnValue({
        width: 375,
        height: 667,
        isMobile: true,
        isTablet: false,
        isDesktop: false
      });

      // Force re-render with new mock
      rerender(
        <ResponsiveTable
          columns={mockColumns}
          data={mockData}
          titleField="name"
          key="mobile" // Force new component instance
        />
      );

      // Should show cards instead
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});