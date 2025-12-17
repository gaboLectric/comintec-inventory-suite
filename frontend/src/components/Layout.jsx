import styled from '@emotion/styled';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarItem } from './SidebarItem';
import { useAuth } from '../contexts/AuthContext';
import pb from '../services/pocketbase';
import { useTheme } from '../comintec-design-system/emotion/ThemeProvider';
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  ShoppingCart,
  FolderOpen,
  Users,
  BarChart3,
  LogOut,
  User as UserIcon,
  Sun,
  Moon
} from 'lucide-react';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
  font-family: var(--font-family);
  color: var(--font-color-primary);
  transition: background 0.3s ease, color 0.3s ease;
`;

const Sidebar = styled.aside`
  width: 240px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color-strong);
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  transition: background 0.3s ease, border-color 0.3s ease;
`;

const SidebarHeader = styled.div`
  padding: var(--space-6) var(--space-4);
  border-bottom: 1px solid var(--border-color-strong);
`;

const Logo = styled.h1`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--font-color-primary);
  margin: 0;
  letter-spacing: 0.08em;
`;

const SidebarNav = styled.nav`
  flex: 1;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  overflow-y: auto;
`;

const SidebarFooter = styled.div`
  padding: var(--space-4);
  border-top: 1px solid var(--border-color-strong);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-2);
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-quaternary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--font-color-primary);
`;

const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--font-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.div`
  font-size: var(--font-size-xs);
  color: var(--font-color-secondary);
`;

const ActionButton = styled.button`
  width: 100%;
  padding: var(--space-2) var(--space-3);
  background: transparent;
  border: 1px solid var(--border-color-strong);
  border-radius: var(--radius-sm);
  color: var(--font-color-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: var(--bg-tertiary);
    border-color: var(--border-color-medium);
  }
`;

const LogoutButton = styled(ActionButton)`
  &:hover {
    border-color: var(--brand-red-9);
    color: var(--brand-red-9);
    background: var(--bg-tertiary);
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  transition: background 0.3s ease;
`;

const Header = styled.header`
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color-strong);
  padding: var(--space-4) var(--space-6);
  position: sticky;
  top: 0;
  z-index: 10;
  transition: background 0.3s ease, border-color 0.3s ease;
`;

const PageTitle = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--font-color-primary);
  margin: 0;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: var(--space-6);
  background: var(--bg-primary);
`;

// Niveles de permisos (igual que sistema legacy):
// 1 = Admin (acceso total)
// 2 = Special (productos, ventas, reportes)
// 3 = User (solo ventas y reportes)
const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/', requiredLevel: 3 },
  { 
    icon: PackagePlus, 
    label: 'Entradas', 
    requiredLevel: 2,
    submenu: [
      { label: 'Entradas Equipos', to: '/almacen/entradas', requiredLevel: 2 }
    ]
  },
  { 
    icon: Package, 
    label: 'Almacén', 
    requiredLevel: 3,
    submenu: [
      { label: 'Equipos', to: '/almacen/equipos', requiredLevel: 3 },
      { label: 'Insumos', to: '/almacen/insumos', requiredLevel: 2 }
    ]
  },
  { 
    icon: ShoppingCart, 
    label: 'Salidas', 
    requiredLevel: 2,
    submenu: [
      { label: 'Salidas Equipos', to: '/salidas/equipos', requiredLevel: 2 },
      { label: 'Salidas Insumos', to: '/salidas/insumos', requiredLevel: 2 }
    ]
  },
  { icon: Users, label: 'Usuarios', to: '/users', requiredLevel: 1 },
  { icon: BarChart3, label: 'Reportes', to: '/reports', requiredLevel: 3 },
];

export function Layout() {
  const location = useLocation();
  const { user, logout, hasPermission } = useAuth();
  const { mode, toggleTheme } = useTheme();

  const avatarUrl = user?.avatar ? pb.files.getUrl(user, user.avatar) : null;
  const displayName = user?.name || user?.username || user?.email || 'Usuario';

  const getRoleName = (level) => {
    switch(level) {
      case 1: return 'Administrador';
      case 2: return 'Especial';
      case 3: return 'Usuario';
      default: return 'Usuario';
    }
  };

  const handleLogout = async () => {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      await logout();
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/almacen/entradas')) return 'Entradas de Equipos';
    if (path.startsWith('/almacen/equipos')) return 'Equipos';
    if (path.startsWith('/almacen/insumos')) return 'Insumos';
    if (path.startsWith('/salidas/equipos')) return 'Salidas de Equipos';
    if (path.startsWith('/salidas/insumos')) return 'Salidas de Insumos';
    if (path.startsWith('/users')) return 'Usuarios';
    if (path.startsWith('/reports')) return 'Reportes';
    return 'Dashboard';
  };

  return (
    <LayoutContainer>
      <Sidebar>
        <SidebarHeader>
          <Logo>COMINTEC</Logo>
        </SidebarHeader>
        <SidebarNav>
          {menuItems.map((item, index) => {
             if (!hasPermission(item.requiredLevel)) return null;
             
             if (item.submenu) {
                 const visibleSubitems = item.submenu.filter(sub => hasPermission(sub.requiredLevel));
                 if (visibleSubitems.length === 0) return null;
                 
                 return (
                     <div key={index}>
                         <div style={{ padding: '12px 16px 4px', fontSize: '11px', fontWeight: 'bold', color: 'var(--font-color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                             {item.label}
                         </div>
                         {visibleSubitems.map(sub => (
                             <SidebarItem
                                 key={sub.to}
                                 icon={item.icon}
                                 label={sub.label}
                                 to={sub.to}
                             />
                         ))}
                     </div>
                 );
             }
             
             return (
              <SidebarItem
                key={item.to}
                icon={item.icon}
                label={item.label}
                to={item.to}
              />
            );
          })}
        </SidebarNav>
        <SidebarFooter>
          <UserInfo>
            <UserAvatar>
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={displayName} 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                />
              ) : (
                <UserIcon size={18} />
              )}
            </UserAvatar>
            <UserDetails>
              <UserName>{displayName}</UserName>
              <UserRole>{getRoleName(user?.user_level)}</UserRole>
            </UserDetails>
          </UserInfo>
          
          <ActionButton onClick={toggleTheme}>
            {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {mode === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
          </ActionButton>

          <LogoutButton onClick={handleLogout}>
            <LogOut size={16} />
            Cerrar Sesión
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>

      <MainContent>
        <Header>
          <PageTitle>{getPageTitle()}</PageTitle>
        </Header>
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
}
