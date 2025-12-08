import styled from '@emotion/styled';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { Form, FormRow, FormGroup, Label, Input, Select, ButtonGroup, Button } from '../components/FormComponents';
import { fetchSales, createSale, updateSale, deleteSale, fetchProducts } from '../services/api';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;
// ...existing code...
const IconButton = styled('button', {
  shouldForwardProp: (prop) => !['$variant'].includes(prop)
})`
  padding: var(--space-2);
  background: ${props => props.$variant === 'danger' ? '#dc3545' : '#ffc107'};
  color: ${props => props.$variant === 'danger' ? 'white' : '#000'};
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--anim-duration-fast);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [salesData, productsData] = await Promise.all([
        fetchSales(),
        fetchProducts()
      ]);
      setSales(salesData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAdd = () => {
    setEditingSale(null);
    setFormData({ productId: '', quantity: '', date: new Date().toISOString().split('T')[0] });
    setIsModalOpen(true);
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setFormData({
      productId: sale.product_id,
      quantity: sale.qty,
      date: sale.date ? sale.date.split('T')[0] : ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar esta venta?')) {
      try {
        await deleteSale(id);
        setSales(sales.filter(s => s.id !== id));
      } catch (error) {
        console.error('Error deleting sale:', error);
        alert('Error al eliminar la venta');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const product = products.find(p => p.id === formData.productId);
    const qty = parseInt(formData.quantity);
    const unit = product ? parseFloat(product.sale_price) : 0;

    const saleData = {
      product_id: formData.productId, // keep PB id as string
      qty,
      price: unit, // store unit price; totals are derived in dashboard
      date: formData.date
    };

    try {
      if (editingSale) {
        const updatedSale = await updateSale(editingSale.id, saleData);
        setSales(sales.map(s => s.id === editingSale.id ? updatedSale : s));
      } else {
        const newSale = await createSale(saleData);
        setSales([...sales, newSale]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving sale:', error);
      alert('Error al guardar la venta');
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>Todas las ventas</Title>
        <AddButton onClick={handleAdd}>
          <Plus />
          Agregar venta
        </AddButton>
      </PageHeader>

      <TableContainer>
        <Table>
          <Thead>
            <tr>
              <Th className="text-center">#</Th>
              <Th>Nombre del producto</Th>
              <Th className="text-center">Cantidad</Th>
              <Th className="text-center">Total</Th>
              <Th className="text-center">Fecha</Th>
              <Th className="text-center">Acciones</Th>
            </tr>
          </Thead>
          <Tbody>
            {sales.map((sale, index) => (
              <Tr key={sale.id}>
                <Td className="text-center">{index + 1}</Td>
                <Td>{sale.product?.name || 'Producto eliminado'}</Td>
                <Td className="text-center">{sale.qty}</Td>
                <Td className="text-center">${parseFloat(sale.price).toFixed(2)}</Td>
                <Td className="text-center">{sale.date ? new Date(sale.date).toLocaleDateString('es-MX') : '-'}</Td>
                <Td className="text-center">
                  <ActionButtons>
                    <IconButton onClick={() => handleEdit(sale)} title="Editar">
                      <Edit />
                    </IconButton>
                    <IconButton $variant="danger" onClick={() => handleDelete(sale.id)} title="Eliminar">
                      <Trash2 />
                    </IconButton>
                  </ActionButtons>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSale ? 'Editar venta' : 'Agregar venta'}
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Producto</Label>
            <Select
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              required
            >
              <option value="">Selecciona un producto</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${parseFloat(product.sale_price).toFixed(2)}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormRow $columns="1fr 1fr">
            <FormGroup>
              <Label>Cantidad</Label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Cantidad"
                min="1"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Fecha</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </FormGroup>
          </FormRow>

          <ButtonGroup>
            <Button type="button" $variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingSale ? 'Actualizar' : 'Agregar'} venta
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </PageContainer>
  );
}

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--font-color-primary);
  margin: 0;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--anim-duration-fast);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const TableContainer = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color-strong);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: background 0.3s ease, border-color 0.3s ease;
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
  
  &.text-center {
    text-align: center;
  }
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
  
  &.text-center {
    text-align: center;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--space-2);
  justify-content: center;
`;

