
import styled from '@emotion/styled';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { Form, FormRow, FormGroup, Label, Input, Select, ButtonGroup, Button } from '../components/FormComponents';
import { fetchProducts, createProduct, updateProduct, deleteProduct, fetchCategories } from '../services/api';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const ProductImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--space-2);
  justify-content: center;
`;

const IconButtonStyled = styled.button`
  padding: var(--space-2);
  background: ${props => props.$variant === 'danger' ? '#dc3545' : '#17a2b8'};
  color: white;
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
const IconButton = styled(IconButtonStyled, {
  shouldForwardProp: (prop) => !['$variant'].includes(prop)
})`
  padding: var(--space-2);
  background: ${props => props.$variant === 'danger' ? '#dc3545' : '#17a2b8'};
  color: white;
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

export function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    quantity: '',
    buyPrice: '',
    salePrice: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ name: '', categoryId: '', quantity: '', buyPrice: '', salePrice: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      categoryId: product.categorie_id,
      quantity: product.quantity,
      buyPrice: product.buy_price,
      salePrice: product.sale_price
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      categorie_id: parseInt(formData.categoryId),
      quantity: parseInt(formData.quantity),
      buy_price: parseFloat(formData.buyPrice),
      sale_price: parseFloat(formData.salePrice)
    };

    try {
      if (editingProduct) {
        const updatedProduct = await updateProduct(editingProduct.id, productData);
        setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
      } else {
        const newProduct = await createProduct(productData);
        setProducts([...products, newProduct]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto');
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <div />
        <AddButton onClick={handleAdd}>
          <Plus />
          Agregar producto
        </AddButton>
      </PageHeader>

      <TableContainer>
        <Table>
          <Thead>
            <tr>
              <Th className="text-center">#</Th>
              <Th>Imagen</Th>
              <Th>Descripción</Th>
              <Th className="text-center">Categoría</Th>
              <Th className="text-center">Stock</Th>
              <Th className="text-center">Precio de compra</Th>
              <Th className="text-center">Precio de venta</Th>
              <Th className="text-center">Agregado</Th>
              <Th className="text-center">Acciones</Th>
            </tr>
          </Thead>
          <Tbody>
            {products.map((product, index) => (
              <Tr key={product.id}>
                <Td className="text-center">{index + 1}</Td>
                <Td>
                  <ProductImage
                    src={product.image || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNlMmU4ZjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NDc0OGIiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}
                    alt={product.name}
                  />
                </Td>
                <Td>{product.name}</Td>
                <Td className="text-center">{product.category?.name || 'Sin categoría'}</Td>
                <Td className="text-center">{product.quantity}</Td>
                <Td className="text-center">${parseFloat(product.buy_price).toFixed(2)}</Td>
                <Td className="text-center">${parseFloat(product.sale_price).toFixed(2)}</Td>
                <Td className="text-center">{product.date ? new Date(product.date).toLocaleDateString('es-MX') : '-'}</Td>
                <Td className="text-center">
                  <ActionButtons>
                    <IconButton onClick={() => handleEdit(product)} title="Editar">
                      <Edit />
                    </IconButton>
                    <IconButton $variant="danger" onClick={() => handleDelete(product.id)} title="Eliminar">
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
        title={editingProduct ? 'Editar producto' : 'Agregar producto'}
        size="large"
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Descripción del producto</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nombre del producto"
              required
            />
          </FormGroup>

          <FormRow $columns="1fr 1fr">
            <FormGroup>
              <Label>Categoría</Label>
              <Select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
              >
                <option value="">Selecciona una categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Cantidad</Label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Stock"
                required
              />
            </FormGroup>
          </FormRow>

          <FormRow $columns="1fr 1fr">
            <FormGroup>
              <Label>Precio de compra</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.buyPrice}
                onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                placeholder="0.00"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Precio de venta</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                placeholder="0.00"
                required
              />
            </FormGroup>
          </FormRow>

          <ButtonGroup>
            <Button type="button" $variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingProduct ? 'Actualizar' : 'Agregar'} producto
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </PageContainer>
  );
}

