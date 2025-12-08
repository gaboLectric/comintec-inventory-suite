import styled from '@emotion/styled';
import { SimpleTable } from '../components/SimpleTable';
import { useEffect, useState } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser } from '../services/api';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Modal } from '../components/Modal';
import { Form, FormRow, FormGroup, Label, Input, Select, ButtonGroup, Button } from '../components/FormComponents';

const PageContainer = styled.div`
  padding: var(--space-6);
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
`;

const Title = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
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
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all var(--anim-duration-fast);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: ${props => props.disabled ? 1 : 0.8};
    transform: ${props => props.disabled ? 'none' : 'scale(1.05)'};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    user_level: '3',
    status: '1'
  });

  const loadUsers = () => {
    fetchUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', username: '', password: '', user_level: '3', status: '1' });
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      password: '', // Password is not populated for security
      user_level: user.user_level,
      status: user.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      deleteUser(id).then(() => loadUsers());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // If password is empty, don't send it (backend should handle this)
        const dataToSend = { ...formData };
        if (!dataToSend.password) delete dataToSend.password;
        
        await updateUser(editingUser.id, dataToSend);
      } else {
        await createUser(formData);
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error al guardar usuario. Verifica los datos.');
    }
  };

  const columns = ['ID', 'Nombre', 'Usuario', 'Nivel', 'Estado', 'Acciones'];
  const data = users.map((u) => [
    u.id,
    u.name,
    u.username,
    u.kind === 'admin' ? 'Admin (PB)' : (u.user_level === 1 ? 'Admin' : (u.user_level === 2 ? 'Especial' : 'Usuario')),
    u.status === 1 ? 'Activo' : 'Inactivo',
    <ActionButtons>
      <IconButton onClick={() => u.kind !== 'admin' && handleEdit(u)} title={u.kind === 'admin' ? 'No editable' : 'Editar'} disabled={u.kind === 'admin'}>
        <Edit />
      </IconButton>
      <IconButton $variant="danger" onClick={() => u.kind !== 'admin' && handleDelete(u.id)} title={u.kind === 'admin' ? 'No eliminable' : 'Eliminar'} disabled={u.kind === 'admin'}>
        <Trash2 />
      </IconButton>
    </ActionButtons>
  ]);

  return (
    <PageContainer>
      <PageHeader>
        <Title>Gestión de Usuarios</Title>
        <AddButton onClick={handleAdd}>
          <Plus />
          Agregar Usuario
        </AddButton>
      </PageHeader>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <SimpleTable title="" columns={columns} data={data} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Editar Usuario' : 'Agregar Usuario'}
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nombre Completo</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Usuario</Label>
            <Input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Contraseña {editingUser && '(Dejar en blanco para mantener)'}</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!editingUser}
            />
          </FormGroup>

          <FormRow $columns="1fr 1fr">
            <FormGroup>
              <Label>Nivel de Usuario</Label>
              <Select
                value={formData.user_level}
                onChange={(e) => setFormData({ ...formData, user_level: parseInt(e.target.value) })}
              >
                <option value="1">Administrador</option>
                <option value="2">Especial</option>
                <option value="3">Usuario</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Estado</Label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
              >
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </Select>
            </FormGroup>
          </FormRow>

          <ButtonGroup>
            <Button type="button" $variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </PageContainer>
  );
}
