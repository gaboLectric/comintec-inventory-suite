import React from 'react';
import styled from '@emotion/styled';

type Col<T> = { key: keyof T; header: string; width?: number };

type Props<T extends Record<string, any>> = {
  columns: Col<T>[];
  rows: T[];
};

const Wrapper = styled.div`
  overflow: auto;
  border: 1px solid var(--border-color-light);
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
  box-shadow: var(--shadow-light);
`;

const Thead = styled.thead`
  position: sticky;
  top: 0;
  background: var(--bg-primary);
  z-index: 10;
`;

const Th = styled.th`
  font-weight: 500;
  font-size: 13px;
  color: var(--font-color-secondary);
  border-bottom: 1px solid var(--border-color-light);
`;

const Td = styled.td`
  font-size: 13px;
  color: var(--font-color-primary);
  border-bottom: 1px solid var(--border-color-light);
`;

export function Table<T extends Record<string, any>>({ columns, rows }: Props<T>) {
  return (
    <Wrapper>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <Thead>
          <tr>
            {columns.map((c, i) => (
              <Th key={String(c.key)} style={{ width: c.width ? `${c.width}px` : undefined }}>
                <div style={{ padding: '8px' }}>{c.header}</div>
              </Th>
            ))}
          </tr>
        </Thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {columns.map((c) => (
                <Td key={String(c.key)} style={{ width: c.width ? `${c.width}px` : undefined }}>
                  <div style={{ padding: '8px' }}>{String(r[c.key])}</div>
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Wrapper>
  );
}
