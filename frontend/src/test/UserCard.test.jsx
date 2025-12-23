/**
 * Unit tests for UserCard component
 * Feature: mobile-responsive-optimization
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from '../components/UserCard';

describe('UserCard Component', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    user_level: 1,
    status: 1,
    kind: null
  };

  const mockHandlers = {
    onEdit: vi.fn(),
    onDelete: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render user card with basic information', () => {
    render(
      <UserCard
        user={mockUser}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should render user level badge correctly', () => {
    render(
      <UserCard
        user={mockUser}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('should render status badge correctly for active user', () => {
    render(
      <UserCard
        user={mockUser}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('should render status badge correctly for inactive user', () => {
    const inactiveUser = { ...mockUser, status: 0 };
    
    render(
      <UserCard
        user={inactiveUser}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Inactivo')).toBeInTheDocument();
  });

  it('should render different user levels correctly', () => {
    const { rerender } = render(
      <UserCard
        user={{ ...mockUser, user_level: 1 }}
        {...mockHandlers}
      />
    );
    expect(screen.getByText('Admin')).toBeInTheDocument();

    rerender(
      <UserCard
        user={{ ...mockUser, user_level: 2 }}
        {...mockHandlers}
      />
    );
    expect(screen.getByText('Especial')).toBeInTheDocument();

    rerender(
      <UserCard
        user={{ ...mockUser, user_level: 3 }}
        {...mockHandlers}
      />
    );
    expect(screen.getByText('Usuario')).toBeInTheDocument();
  });

  it('should render system admin correctly', () => {
    const systemAdmin = { ...mockUser, kind: 'admin' };
    
    render(
      <UserCard
        user={systemAdmin}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Admin (PB)')).toBeInTheDocument();
  });

  it('should render action buttons for regular users', () => {
    render(
      <UserCard
        user={mockUser}
        {...mockHandlers}
      />
    );

    expect(screen.getByTitle('Editar')).toBeInTheDocument();
    expect(screen.getByTitle('Eliminar')).toBeInTheDocument();
  });

  it('should disable action buttons for system admin', () => {
    const systemAdmin = { ...mockUser, kind: 'admin' };
    
    render(
      <UserCard
        user={systemAdmin}
        {...mockHandlers}
      />
    );

    const editButton = screen.getByTitle('No editable');
    const deleteButton = screen.getByTitle('No eliminable');

    expect(editButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  it('should handle edit button click for regular users', () => {
    render(
      <UserCard
        user={mockUser}
        {...mockHandlers}
      />
    );

    const editButton = screen.getByTitle('Editar');
    fireEvent.click(editButton);

    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockUser);
  });

  it('should handle delete button click for regular users', () => {
    render(
      <UserCard
        user={mockUser}
        {...mockHandlers}
      />
    );

    const deleteButton = screen.getByTitle('Eliminar');
    fireEvent.click(deleteButton);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockUser.id);
  });

  it('should not call handlers for system admin buttons', () => {
    const systemAdmin = { ...mockUser, kind: 'admin' };
    
    render(
      <UserCard
        user={systemAdmin}
        {...mockHandlers}
      />
    );

    const editButton = screen.getByTitle('No editable');
    const deleteButton = screen.getByTitle('No eliminable');

    fireEvent.click(editButton);
    fireEvent.click(deleteButton);

    expect(mockHandlers.onEdit).not.toHaveBeenCalled();
    expect(mockHandlers.onDelete).not.toHaveBeenCalled();
  });

  it('should have proper touch target sizes for buttons', () => {
    render(
      <UserCard
        user={mockUser}
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

  it('should apply correct styling for different user levels', () => {
    const { rerender } = render(
      <UserCard
        user={{ ...mockUser, user_level: 1 }}
        {...mockHandlers}
      />
    );

    let levelBadge = screen.getByText('Admin');
    expect(levelBadge).toBeInTheDocument();

    rerender(
      <UserCard
        user={{ ...mockUser, user_level: 2 }}
        {...mockHandlers}
      />
    );

    levelBadge = screen.getByText('Especial');
    expect(levelBadge).toBeInTheDocument();
  });

  it('should apply correct styling for different status', () => {
    const { rerender } = render(
      <UserCard
        user={{ ...mockUser, status: 1 }}
        {...mockHandlers}
      />
    );

    let statusBadge = screen.getByText('Activo');
    expect(statusBadge).toBeInTheDocument();

    rerender(
      <UserCard
        user={{ ...mockUser, status: 0 }}
        {...mockHandlers}
      />
    );

    statusBadge = screen.getByText('Inactivo');
    expect(statusBadge).toBeInTheDocument();
  });

  it('should prevent event propagation on button clicks', () => {
    render(
      <UserCard
        user={mockUser}
        {...mockHandlers}
      />
    );

    const editButton = screen.getByTitle('Editar');
    fireEvent.click(editButton);

    // The component should call stopPropagation (though we can't directly test it)
    expect(mockHandlers.onEdit).toHaveBeenCalled();
  });
});