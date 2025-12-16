import styled from '@emotion/styled';
import { SimpleTable } from '../components/SimpleTable';
import { useEffect, useState } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser, getUserLevel } from '../services/api';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Modal } from '../components/Modal';
import { Form, FormRow, FormGroup, Label, Input, Select, ButtonGroup, ButtonStyled as Button } from '../components/FormComponents';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const userLevel = getUserLevel();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    user_level: '3'
  });

  // Redirect if user is not Admin or Special
  useEffect(() => {
    if (userLevel > 2) {
      navigate('/dashboard');
    }
  }, [userLevel, navigate]);

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
    setFormData({ name: '', email: '', password: '', user_level: '3' });
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email || '',
      password: '', // Password is not populated for security
      user_level: user.user_level
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
      const dataToSend = { ...formData };
      
      // PocketBase requires passwordConfirm
      if (dataToSend.password) {
        dataToSend.passwordConfirm = dataToSend.password;
      } else {
        delete dataToSend.password;
      }

      // Ensure user_level is a number
      dataToSend.user_level = parseInt(dataToSend.user_level);

      if (editingUser) {
        await updateUser(editingUser.id, dataToSend);
      } else {
        await createUser(dataToSend);
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      if (error.data) console.error('Validation errors:', error.data);
      alert(`Error al guardar usuario: ${error.message}`);
    }
  };

  const columns = [
      { header: 'ID', accessor: 'id' },
      { header: 'Nombre', accessor: 'name' },
      { header: 'Email', accessor: 'email' },
      { header: 'Nivel', render: (u) => u.kind === 'admin' ? 'Admin (PB)' : (u.user_level === 1 ? 'Admin' : (u.user_level === 2 ? 'Especial' : 'Usuario')) },
      { header: 'Estado', render: (u) => u.status === 1 ? 'Activo' : 'Inactivo' },
      { header: 'Acciones', render: (u) => (
          <ActionButtons>
            <IconButton onClick={() => u.kind !== 'admin' && handleEdit(u)} title={u.kind === 'admin' ? 'No editable' : 'Editar'} disabled={u.kind === 'admin'}>
              <Edit />
            </IconButton>
            <IconButton $variant="danger" onClick={() => u.kind !== 'admin' && handleDelete(u.id)} title={u.kind === 'admin' ? 'No eliminable' : 'Eliminar'} disabled={u.kind === 'admin'}>
              <Trash2 />
            </IconButton>
          </ActionButtons>
      )}
  ];

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
        <SimpleTable title="" columns={columns} data={users} />
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
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

          <FormRow $columns="1fr">
            <FormGroup>
              <Label>Nivel de Usuario</Label>
              <Select
                value={formData.user_level}
                onChange={(e) => setFormData({ ...formData, user_level: e.target.value })}
              >
                <option value="1">Administrador</option>
                <option value="2">Especial</option>
                <option value="3">Usuario</option>
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
