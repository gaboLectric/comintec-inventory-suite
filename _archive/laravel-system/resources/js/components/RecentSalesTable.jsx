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
  position: sticky;
  top: 0;
  z-index: 1;
  transition: background 0.3s ease;
`;

const Th = styled.th`
  text-align: left;
  padding: var(--space-3) var(--space-5);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--font-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border-color-strong);
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
  padding: var(--space-4) var(--space-5);
  font-size: var(--font-size-md);
  color: var(--font-color-primary);
`;

const ProductName = styled.span`
  font-weight: var(--font-weight-medium);
`;

const Price = styled.span`
  font-weight: var(--font-weight-semibold);
  color: var(--color-green-600);
`;

export function RecentSalesTable({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <TableContainer>
        <TableHeader>
          <TableTitle>Ventas Recientes</TableTitle>
        </TableHeader>
        <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--font-color-secondary)' }}>
          No hay ventas recientes.
        </div>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>Ventas Recientes</TableTitle>
      </TableHeader>
      <Table>
        <Thead>
          <tr>
            <Th>Producto</Th>
            <Th>Cantidad</Th>
            <Th>Precio Total</Th>
            <Th>Fecha</Th>
          </tr>
        </Thead>
        <Tbody>
          {data.map((sale) => (
            <Tr key={sale.id}>
              <Td>
                <ProductName>{sale.product}</ProductName>
              </Td>
              <Td>{sale.quantity}</Td>
              <Td>
                <Price>${parseFloat(sale.price).toFixed(2)}</Price>
              </Td>
              <Td>{new Date(sale.date).toLocaleDateString('es-MX')}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
