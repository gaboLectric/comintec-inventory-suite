import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const TableContainer = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color-strong);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: background 0.3s ease, border-color 0.3s ease;
`;

const TableHeader = styled.div`
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--border-color-strong);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-3);
`;

const TableTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--font-color-primary);
  margin: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: var(--bg-tertiary);
  transition: background 0.3s ease;
`;

const Th = styled.th`
  text-align: left;
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--font-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: ${props => props.width || 'auto'};
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  transition: background var(--anim-duration-fast);
  
  &:hover {
    background: var(--bg-tertiary);
  }
  
  &:not(:last-child) td {
    border-bottom: 1px solid var(--border-color-strong);
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
  background: var(--bg-primary);
  border: 1px solid var(--border-color-strong);
  border-radius: var(--radius-sm);
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
  border-top: 1px solid var(--border-color-strong);
  gap: var(--space-4);
  color: var(--font-color-secondary);
  font-size: var(--font-size-sm);
`;

const PageButton = styled.button`
  background: none;
  border: 1px solid var(--border-color-medium);
  border-radius: var(--radius-sm);
  padding: var(--space-1);
  color: var(--font-color-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background: var(--bg-tertiary);
    border-color: var(--border-color-strong);
  }
`;

export function SimpleTable({ title, columns, data, actions, onSearch, pagination }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (onSearch) onSearch(term);
    };

    return (
        <TableContainer>
            <TableHeader>
                <TableTitle>{title}</TableTitle>
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
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
                                <Tr key={row.id || rowIdx}>
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
}
