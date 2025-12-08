
import styled from '@emotion/styled';
import { Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { Button, Input, Form, FormGroup } from '../components/FormComponents';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../services/api';

const PageContainer = styled.div`
  display: flex;
  gap: var(--space-4);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
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

export function Categories() {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newCategory = await createCategory(formData);
            setCategories([...categories, newCategory]);
            setFormData({ name: '' });
        } catch (error) {
            console.error('Error creating category:', error);
            alert('Error al crear la categoría');
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({ name: category.name });
        setIsModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedCategory = await updateCategory(editingCategory.id, formData);
            setCategories(categories.map(c => c.id === editingCategory.id ? updatedCategory : c));
            setIsModalOpen(false);
            setEditingCategory(null);
            setFormData({ name: '' });
        } catch (error) {
            console.error('Error updating category:', error);
            alert('Error al actualizar la categoría');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de eliminar esta categoría?')) {
            try {
                await deleteCategory(id);
                setCategories(categories.filter(c => c.id !== id));
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Error al eliminar la categoría');
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '' });
    };

    return (
        <PageContainer>
            <FormSection>
                <Panel>
                    <PanelHeader>
                        <PanelTitle>Agregar categoría</PanelTitle>
                    </PanelHeader>
                    <PanelBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Input
                                    type="text"
                                    placeholder="Nombre de la categoría"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </FormGroup>
                            <SubmitButton type="submit">Agregar categoría</SubmitButton>
                        </Form>
                    </PanelBody>
                </Panel>
            </FormSection>

            <TableSection>
                <Panel>
                    <PanelHeader>
                        <PanelTitle>Lista de categorías</PanelTitle>
                    </PanelHeader>
                    <PanelBody style={{ padding: 0 }}>
                        <Table>
                            <Thead>
                                <tr>
                                    <Th className="text-center">#</Th>
                                    <Th>Categorías</Th>
                                    <Th className="text-center">Acciones</Th>
                                </tr>
                            </Thead>
                            <Tbody>
                                {categories.map((category, index) => (
                                    <Tr key={category.id}>
                                        <Td className="text-center">{index + 1}</Td>
                                        <Td>{category.name}</Td>
                                        <Td className="text-center">
                                            <ActionButtons>
                                                <IconButton 
                                                    title="Editar"
                                                    onClick={() => handleEdit(category)}
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton 
                                                    $variant="danger" 
                                                    title="Eliminar"
                                                    onClick={() => handleDelete(category.id)}
                                                >
                                                    <Trash2 />
                                                </IconButton>
                                            </ActionButtons>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </PanelBody>
                </Panel>
            </TableSection>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Editar Categoría"
            >
                <Form onSubmit={handleUpdate}>
                    <FormGroup>
                        <label style={{ color: 'var(--font-color-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>Nombre de la categoría</label>
                        <Input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </FormGroup>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                        <Button type="button" $variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button type="submit" $variant="primary">
                            Guardar Cambios
                        </Button>
                    </div>
                </Form>
            </Modal>
        </PageContainer>
    );
}

const FormSection = styled.div`
  flex: 1;
  min-width: 300px;
`;

const TableSection = styled.div`
  flex: 2;
  min-width: 300px;
`;

const Panel = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color-light);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
`;

const PanelHeader = styled.div`
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-color-light);
  background: var(--bg-tertiary);
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--font-color-primary);
`;

const PanelBody = styled.div`
  padding: var(--space-4);
`;

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: var(--space-4);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: var(--bg-tertiary);
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
  border-bottom: 1px solid var(--border-color-light);
  transition: background var(--anim-duration-fast);
  
  &:hover {
    background: var(--bg-tertiary);
  }
  
  &:last-child {
    border-bottom: none;
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


