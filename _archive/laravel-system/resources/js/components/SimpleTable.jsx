import styled from '@emotion/styled';

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

export function SimpleTable({ title, columns, data }) {
    return (
        <TableContainer>
            <TableHeader>
                <TableTitle>{title}</TableTitle>
            </TableHeader>
            <Table>
                <Thead>
                    <tr>
                        {columns.map((col, idx) => (
                            <Th key={idx}>{col}</Th>
                        ))}
                    </tr>
                </Thead>
                <Tbody>
                    {data.map((row, rowIdx) => (
                        <Tr key={rowIdx}>
                            {row.map((cell, cellIdx) => (
                                <Td key={cellIdx}>{cell}</Td>
                            ))}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
}
