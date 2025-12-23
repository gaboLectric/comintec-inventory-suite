import styled from '@emotion/styled';
import { ResponsiveTable } from '../components/ResponsiveTable';
import { UserCard } from '../components/UserCard';
import { useEffect, useState } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser, getUserLevel } from '../services/api';
import { Edit, Trash2, Plus } from 'lucide-react';
import { MobileModal } from '../components/MobileModal';
import { Form, FormRow, FormGroup, Label, Input, Select, ButtonGroup } from '../components/FormComponents';
import { GlassButton } from '../components/GlassButton';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  padding: var(--space-6);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--space-2);
  justify-content: center;
`;

const IconButtonStyled = styled.button`
  padding: var(--space-2);
  background: ${props => props.$variant === 'danger' ? '#EF4444' : '#3B82F6'};
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--anim-duration-fast);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.$variant === 'danger' ? '#DC2626' : '#2563EB'};
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
  background: ${props => props.$variant === 'danger' ? '#EF4444' : '#3B82F6'};
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
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <ResponsiveTable 
            title="" 
            columns={columns} 
            data={users} 
            actions={
                <GlassButton variant="primary" onClick={handleAdd} icon={<Plus />}>
                  Agregar Usuario
                </GlassButton>
            }
            // Mobile card specific props
            mobileCardRenderer={(user) => (
                <UserCard
                    user={user}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        />
      )}

      <MobileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Editar Usuario' : 'Agregar Usuario'}
        actions={
          <ButtonGroup>
            <GlassButton type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </GlassButton>
            <GlassButton type="submit" variant="primary" form="user-form">
              {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
            </GlassButton>
          </ButtonGroup>
        }
      >
        <Form id="user-form" onSubmit={handleSubmit}>
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
        </Form>
      </MobileModal>
    </PageContainer>
  );
}
