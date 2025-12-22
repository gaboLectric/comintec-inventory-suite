import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDebounce } from '../hooks';

const TableContainer = styled.div`
  background: var(--glass-bg-medium);
  backdrop-filter: blur(var(--glass-blur-medium));
  -webkit-backdrop-filter: blur(var(--glass-blur-medium));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--glass-shadow);
  transition: all var(--transition-normal);
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(16px)) {
    background: var(--bg-secondary);
    border-color: var(--border-color-strong);
  }
  
  &:hover {
    border-color: var(--glass-border-hover);
    box-shadow: var(--glass-shadow-elevated);
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
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(10px)) {
    background: var(--bg-tertiary);
    border-bottom-color: var(--border-color-strong);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: var(--glass-bg-light);
  backdrop-filter: blur(var(--glass-blur-light));
  -webkit-backdrop-filter: blur(var(--glass-blur-light));
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(10px)) {
    background: var(--bg-tertiary);
  }
`;

const Th = styled.th`
  text-align: left;
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--font-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: ${props => props.width || 'auto'};
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--glass-bg-light);
    backdrop-filter: blur(var(--glass-blur-light));
    -webkit-backdrop-filter: blur(var(--glass-blur-light));
    
    @supports not (backdrop-filter: blur(10px)) {
      background: var(--bg-tertiary);
    }
  }
  
  &:not(:last-child) td {
    border-bottom: 1px solid var(--glass-border);
  }
  
  /* Alternating row backgrounds with transparency */
  &:nth-of-type(even) {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const Td = styled.td`
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-md);
  color: var(--font-color-primary);
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

  &::placeholder {
    color: var(--font-color-tertiary);
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: var(--space-3) var(--space-5);
  border-top: 1px solid var(--glass-border);
  background: var(--glass-bg-light);
  backdrop-filter: blur(var(--glass-blur-light));
  -webkit-backdrop-filter: blur(var(--glass-blur-light));
  gap: var(--space-4);
  color: var(--font-color-secondary);
  font-size: var(--font-size-sm);
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(10px)) {
    background: var(--bg-tertiary);
    border-top-color: var(--border-color-strong);
  }
`;

const PageButton = styled.button`
  background: var(--glass-bg-medium);
  backdrop-filter: blur(var(--glass-blur-light));
  -webkit-backdrop-filter: blur(var(--glass-blur-light));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  padding: var(--space-1);
  color: var(--font-color-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  
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
`;

export const SimpleTable = React.memo(function SimpleTable({ title, columns, data, actions, onSearch, pagination = {}, rowStyle }) {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Ejecutar búsqueda cuando el término con debounce cambie
    useEffect(() => {
        if (onSearch) {
            onSearch(debouncedSearchTerm);
        }
    }, [debouncedSearchTerm]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <TableContainer>
            <TableHeader>
                {/* Title removed as per request */}
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flex: 1 }}>
                    {onSearch && (
                        <SearchContainer>
                            <Search size={16} color="var(--font-color-secondary)" />
                            <SearchInput 
                                placeholder="Buscar..." 
                                value={searchTerm} 
                                onChange={handleSearch} 
                            />
                        </SearchContainer>
                    )}
                    {actions}
                </div>
            </TableHeader>
            <div style={{ overflowX: 'auto' }}>
                <Table>
                    <Thead>
                        <tr>
                            {columns.map((col, idx) => (
                                <Th key={idx} width={col.width}>{col.header || col}</Th>
                            ))}
                        </tr>
                    </Thead>
                    <Tbody>
                        {data && data.length > 0 ? (
                            data.map((row, rowIdx) => (
                                <Tr key={row.id || rowIdx} style={rowStyle ? rowStyle(row) : {}}>
                                    {columns.map((col, cellIdx) => (
                                        <Td key={cellIdx}>
                                            {col.render ? col.render(row) : (col.accessor ? row[col.accessor] : row[cellIdx])}
                                        </Td>
                                    ))}
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan={columns.length} style={{ textAlign: 'center', color: 'var(--font-color-secondary)' }}>
                                    No hay datos
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </div>
            {pagination && (
                <PaginationContainer>
                    <span>
                        Página {pagination.page} de {pagination.totalPages} ({pagination.totalItems} registros)
                    </span>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <PageButton 
                            onClick={() => pagination.onPageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                        >
                            <ChevronLeft size={16} />
                        </PageButton>
                        <PageButton 
                            onClick={() => pagination.onPageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                        >
                            <ChevronRight size={16} />
                        </PageButton>
                    </div>
                </PaginationContainer>
            )}
        </TableContainer>
    );
});
