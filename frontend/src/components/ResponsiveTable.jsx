import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDebounce, useViewport } from '../hooks';
import { SimpleTable } from './SimpleTable';
import { MobileCard } from './MobileCard';

/**
 * ResponsiveTable Component
 * 
 * A responsive table component that automatically switches between:
 * - Traditional table layout on desktop (>=768px)
 * - Card-based layout on mobile (<768px)
 * 
 * Maintains all functionality including search and pagination across both layouts.
 */

const ResponsiveContainer = styled.div`
  background: var(--glass-bg-medium);
  backdrop-filter: blur(var(--glass-blur-medium));
  -webkit-backdrop-filter: blur(var(--glass-blur-medium));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--glass-shadow);
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
  
  @supports not (backdrop-filter: blur(16px)) {
    background: var(--bg-secondary);
    border-color: var(--border-color-strong);
  }
  
  &:hover {
    border-color: var(--glass-border-hover);
    box-shadow: var(--glass-shadow-elevated);
  }
  
  /* Mobile: ensure proper height adaptation */
  @media (max-width: 767px) {
    max-height: calc(100vh - 140px);
    max-height: calc(100dvh - 140px);
    
    @media (orientation: landscape) {
      max-height: calc(100vh - 100px);
      max-height: calc(100dvh - 100px);
    }
    
    @media (max-height: 599px) {
      max-height: calc(100vh - 80px);
      max-height: calc(100dvh - 80px);
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const TableHeader = styled.div`
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--glass-border);
  background: var(--glass-bg-light);
  backdrop-filter: blur(var(--glass-blur-light));
  -webkit-backdrop-filter: blur(var(--glass-blur-light));
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-3);
  
  /* Mobile optimizations */
  @media (max-width: 767px) {
    padding: var(--space-3) var(--space-4);
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-2);
  }
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(10px)) {
    background: var(--bg-tertiary);
    border-bottom-color: var(--border-color-strong);
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--glass-bg-medium);
  backdrop-filter: blur(var(--glass-blur-light));
  -webkit-backdrop-filter: blur(var(--glass-blur-light));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  
  /* Mobile full-width search */
  @media (max-width: 767px) {
    width: 100%;
  }
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(10px)) {
    background: var(--bg-primary);
    border-color: var(--border-color-strong);
  }
  
  &:focus-within {
    border-color: var(--accent-blue);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    background: var(--glass-bg-strong);
  }
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  color: var(--font-color-primary);
  font-size: var(--font-size-sm);
  outline: none;
  width: 200px;
  transition: all var(--transition-fast);
  
  /* Mobile full-width input */
  @media (max-width: 767px) {
    width: 100%;
    font-size: max(var(--font-size-sm), 16px); /* Prevent zoom on iOS */
  }

  &::placeholder {
    color: var(--font-color-tertiary);
  }
  
  /* Loading state styling */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MobileCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  flex: 1;
  
  @media (max-width: 479px) {
    padding: var(--space-3);
    gap: var(--space-2);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-8) var(--space-4);
  color: var(--font-color-secondary);
  font-size: var(--font-size-md);
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-5);
  border-top: 1px solid var(--glass-border);
  background: var(--glass-bg-light);
  backdrop-filter: blur(var(--glass-blur-light));
  -webkit-backdrop-filter: blur(var(--glass-blur-light));
  gap: var(--space-4);
  color: var(--font-color-secondary);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  
  /* Mobile layout adjustments */
  @media (max-width: 767px) {
    padding: var(--space-3) var(--space-4);
    flex-direction: column;
    gap: var(--space-2);
    text-align: center;
  }
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(10px)) {
    background: var(--bg-tertiary);
    border-top-color: var(--border-color-strong);
  }
  
  /* Loading state */
  &.loading {
    opacity: 0.6;
    pointer-events: none;
  }
`;

const PageButton = styled.button`
  background: var(--glass-bg-medium);
  backdrop-filter: blur(var(--glass-blur-light));
  -webkit-backdrop-filter: blur(var(--glass-blur-light));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  padding: var(--space-2);
  color: var(--font-color-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  
  /* Touch-friendly sizing on mobile */
  min-width: 44px;
  min-height: 44px;
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(10px)) {
    background: transparent;
    border-color: var(--border-color-medium);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background: var(--glass-bg-strong);
    border-color: var(--glass-border-hover);
    transform: translateY(-1px);
    
    @supports not (backdrop-filter: blur(24px)) {
      background: var(--bg-tertiary);
      border-color: var(--border-color-strong);
    }
  }
  
  /* Enhanced touch feedback on mobile */
  @media (max-width: 767px) {
    &:active:not(:disabled) {
      transform: scale(0.95);
    }
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: var(--space-2);
  align-items: center;
  
  /* Mobile full-width actions */
  @media (max-width: 767px) {
    width: 100%;
    justify-content: center;
  }
`;

export const ResponsiveTable = React.memo(function ResponsiveTable({ 
  title, 
  columns, 
  data, 
  actions, 
  onSearch, 
  pagination = {}, 
  rowStyle,
  isSearching = false,
  // Mobile card specific props
  mobileCardRenderer,
  imageField,
  titleField,
  subtitleField,
  primaryFields = [],
  secondaryFields = [],
  onCardClick,
  ...props 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { isMobile } = useViewport();

  // Execute search when debounced term changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // If desktop viewport, render traditional table
  if (!isMobile) {
    return (
      <SimpleTable
        title={title}
        columns={columns}
        data={data}
        actions={actions}
        onSearch={onSearch}
        pagination={pagination}
        rowStyle={rowStyle}
        {...props}
      />
    );
  }

  // Mobile viewport - render card layout
  const renderMobileCard = (item, index) => {
    // Use custom renderer if provided
    if (mobileCardRenderer) {
      return (
        <div key={item.id || index}>
          {mobileCardRenderer(item, index)}
        </div>
      );
    }

    // Default card rendering
    return (
      <MobileCard
        key={item.id || index}
        item={item}
        columns={columns}
        imageField={imageField}
        titleField={titleField}
        subtitleField={subtitleField}
        primaryFields={primaryFields}
        secondaryFields={secondaryFields}
        onCardClick={onCardClick ? () => onCardClick(item) : undefined}
        variant="medium"
      />
    );
  };

  return (
    <ResponsiveContainer {...props}>
      {/* Header with search and actions */}
      <TableHeader>
        <div style={{ 
          display: 'flex', 
          gap: 'var(--space-3)', 
          alignItems: 'center', 
          flex: 1,
          width: '100%'
        }}>
          {onSearch && (
            <SearchContainer>
              <Search size={16} color="var(--font-color-secondary)" />
              <SearchInput 
                placeholder="Buscar..." 
                value={searchTerm} 
                onChange={handleSearch}
                disabled={isSearching}
              />
              {isSearching && (
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  border: '2px solid var(--glass-border)', 
                  borderTop: '2px solid var(--accent-blue)', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite' 
                }} />
              )}
            </SearchContainer>
          )}
          {actions && (
            <ActionsContainer>
              {actions}
            </ActionsContainer>
          )}
        </div>
      </TableHeader>

      {/* Mobile card list */}
      {data && data.length > 0 ? (
        <MobileCardList>
          {data.map((item, index) => renderMobileCard(item, index))}
        </MobileCardList>
      ) : (
        <EmptyState>
          No hay datos
        </EmptyState>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <PaginationContainer className={pagination.isLoadingMore ? 'loading' : ''}>
          <span>
            Página {pagination.page} de {pagination.totalPages} ({pagination.totalItems} registros)
            {pagination.isLoadingMore && ' - Cargando...'}
          </span>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <PageButton 
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || pagination.isLoadingMore}
              title="Página anterior"
            >
              <ChevronLeft size={16} />
            </PageButton>
            <PageButton 
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || pagination.isLoadingMore}
              title="Página siguiente"
            >
              <ChevronRight size={16} />
            </PageButton>
          </div>
        </PaginationContainer>
      )}
    </ResponsiveContainer>
  );
});