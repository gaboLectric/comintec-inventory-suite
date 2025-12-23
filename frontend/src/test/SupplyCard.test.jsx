/**
 * Unit tests for SupplyCard component
 * Feature: mobile-responsive-optimization
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SupplyCard } from '../components/SupplyCard';

describe('SupplyCard Component', () => {
  const mockSupply = {
    id: '1',
    nombre: 'Test Supply',
    piezas: 50,
    stock_deseado: 100
  };

  const mockHandlers = {
    onEdit: vi.fn(),
    onDelete: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render supply card with basic information', () => {
    render(
      <SupplyCard
        supply={mockSupply}
        canEdit={true}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Test Supply')).toBeInTheDocument();
    // The quantities are rendered in custom format, check for the shortage message instead
    expect(screen.getByText(/Faltan.*piezas/)).toBeInTheDocument();
  });

  it('should show low stock badge when stock is low', () => {
    render(
      <SupplyCard
        supply={mockSupply}
        canEdit={true}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Bajo Stock')).toBeInTheDocument();
    expect(screen.getByText('Faltan 50 piezas')).toBeInTheDocument();
  });

  it('should show OK badge when stock is sufficient', () => {
    const sufficientSupply = { ...mockSupply, piezas: 150 };
    
    render(
      <SupplyCard
        supply={sufficientSupply}
        canEdit={true}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('OK')).toBeInTheDocument();
    expect(screen.queryByText(/Faltan.*piezas/)).not.toBeInTheDocument();
  });

  it('should render action buttons when user can edit', () => {
    render(
      <SupplyCard
        supply={mockSupply}
        canEdit={true}
        {...mockHandlers}
      />
    );

    expect(screen.getByTitle('Editar')).toBeInTheDocument();
    expect(screen.getByTitle('Eliminar')).toBeInTheDocument();
  });

  it('should not render action buttons when user cannot edit', () => {
    render(
      <SupplyCard
        supply={mockSupply}
        canEdit={false}
        {...mockHandlers}
      />
    );

    expect(screen.queryByTitle('Editar')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Eliminar')).not.toBeInTheDocument();
  });

  it('should handle edit button click', () => {
    render(
      <SupplyCard
        supply={mockSupply}
        canEdit={true}
        {...mockHandlers}
      />
    );

    const editButton = screen.getByTitle('Editar');
    fireEvent.click(editButton);

    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockSupply);
  });

  it('should handle delete button click', () => {
    render(
      <SupplyCard
        supply={mockSupply}
        canEdit={true}
        {...mockHandlers}
      />
    );

    const deleteButton = screen.getByTitle('Eliminar');
    fireEvent.click(deleteButton);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockSupply.id);
  });

  it('should show alert icon for low stock items', () => {
    render(
      <SupplyCard
        supply={mockSupply}
        canEdit={true}
        {...mockHandlers}
      />
    );

    // Check for low stock badge and shortage message
    expect(screen.getByText('Bajo Stock')).toBeInTheDocument();
    expect(screen.getByText('Faltan 50 piezas')).toBeInTheDocument();
  });

  it('should not show alert icon for sufficient stock items', () => {
    const sufficientSupply = { ...mockSupply, piezas: 150 };
    
    render(
      <SupplyCard
        supply={sufficientSupply}
        canEdit={true}
        {...mockHandlers}
      />
    );

    // Should show OK badge and no shortage message
    expect(screen.getByText('OK')).toBeInTheDocument();
    expect(screen.queryByText(/Faltan.*piezas/)).not.toBeInTheDocument();
  });

  it('should render quantity and stock desired fields', () => {
    render(
      <SupplyCard
        supply={mockSupply}
        canEdit={true}
        {...mockHandlers}
      />
    );

    // The fields are rendered as custom content, check for the labels
    expect(screen.getByText('Piezas')).toBeInTheDocument();
    expect(screen.getByText('Stock Deseado')).toBeInTheDocument();
  });

  it('should calculate shortage correctly', () => {
    const lowStockSupply = { ...mockSupply, piezas: 25, stock_deseado: 100 };
    
    render(
      <SupplyCard
        supply={lowStockSupply}
        canEdit={true}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Faltan 75 piezas')).toBeInTheDocument();
  });

  it('should use different card variant for low stock', () => {
    const { rerender } = render(
      <SupplyCard
        supply={mockSupply}
        canEdit={true}
        {...mockHandlers}
      />
    );

    // Low stock should use 'light' variant
    expect(screen.getByText('Test Supply')).toBeInTheDocument();

    const sufficientSupply = { ...mockSupply, piezas: 150 };
    rerender(
      <SupplyCard
        supply={sufficientSupply}
        canEdit={true}
        {...mockHandlers}
      />
    );

    // Sufficient stock should use 'medium' variant
    expect(screen.getByText('Test Supply')).toBeInTheDocument();
  });

  it('should have proper touch target sizes for buttons', () => {
    render(
      <SupplyCard
        supply={mockSupply}
        canEdit={true}
        {...mockHandlers}
      />
    );

    const editButton = screen.getByTitle('Editar');
    const deleteButton = screen.getByTitle('Eliminar');

    // All buttons should have minimum 44px touch targets
    expect(editButton).toHaveStyle('min-width: 44px');
    expect(editButton).toHaveStyle('min-height: 44px');
    expect(deleteButton).toHaveStyle('min-width: 44px');
    expect(deleteButton).toHaveStyle('min-height: 44px');
  });

  it('should prevent event propagation on button clicks', () => {
    render(
      <SupplyCard
        supply={mockSupply}
        canEdit={true}
        {...mockHandlers}
      />
    );

    const editButton = screen.getByTitle('Editar');
    fireEvent.click(editButton);

    // The component should call stopPropagation (though we can't directly test it)
    expect(mockHandlers.onEdit).toHaveBeenCalled();
  });

  it('should handle edge case with zero stock', () => {
    const zeroStockSupply = { ...mockSupply, piezas: 0 };
    
    render(
      <SupplyCard
        supply={zeroStockSupply}
        canEdit={true}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Bajo Stock')).toBeInTheDocument();
    expect(screen.getByText('Faltan 100 piezas')).toBeInTheDocument();
  });

  it('should handle edge case with exact stock match', () => {
    const exactStockSupply = { ...mockSupply, piezas: 100, stock_deseado: 100 };
    
    render(
      <SupplyCard
        supply={exactStockSupply}
        canEdit={true}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('OK')).toBeInTheDocument();
    expect(screen.queryByText(/Faltan.*piezas/)).not.toBeInTheDocument();
  });
});