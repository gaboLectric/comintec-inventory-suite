import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarItem } from './SidebarItem';
import { useAuth } from '../contexts/AuthContext';
import pb from '../services/pocketbase';
import { useTheme } from '../comintec-design-system/emotion/ThemeProvider';
import { useIsMobile } from '../hooks';
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
  Moon,
  Menu,
  X
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
  background: var(--glass-bg-medium);
  backdrop-filter: blur(var(--glass-blur-medium));
  -webkit-backdrop-filter: blur(var(--glass-blur-medium));
  border-right: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1000;
  transition: all var(--transition-normal);
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(16px)) {
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-color-strong);
  }

  /* Mobile styles */
  @media (max-width: 767px) {
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${props => props.$isOpen ? 'var(--glass-shadow-elevated)' : 'none'};
  }

  /* Desktop styles */
  @media (min-width: 768px) {
    transform: translateX(0);
    position: fixed;
  }
`;

const SidebarBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all var(--transition-normal);
  
  /* Only show on mobile */
  @media (min-width: 768px) {
    display: none;
  }
`;

const SidebarHeader = styled.div`
  padding: var(--space-5) var(--space-4);
  border-bottom: 1px solid var(--glass-border);
  background: var(--glass-bg-light);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #FF6B35 0%, #E85A2A 100%);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
`;

// Custom Round Bottom Flask SVG component
const RoundBottomFlask = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Neck of flask */}
    <path d="M10 2h4" />
    <path d="M10 2v6" />
    <path d="M14 2v6" />
    {/* Round bottom */}
    <circle cx="12" cy="16" r="6" />
    {/* Connection from neck to ball */}
    <path d="M10 8c-2 1-4 3.5-4 8" />
    <path d="M14 8c2 1 4 3.5 4 8" />
  </svg>
);

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const Logo = styled.h1`
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--font-color-primary);
  margin: 0;
  letter-spacing: 0.12em;
  line-height: 1.2;
`;

const LogoSubtitle = styled.span`
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--font-color-tertiary);
  letter-spacing: 0.15em;
  text-transform: uppercase;
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
  border-top: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  background: var(--glass-bg-light);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-1);
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35 0%, #E85A2A 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.25);
`;

const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--font-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
`;

const UserRole = styled.div`
  font-size: 0.7rem;
  color: var(--font-color-tertiary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 2px;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: var(--space-2) var(--space-3);
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  color: var(--font-color-primary);
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: var(--font-family);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  justify-content: center;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--glass-bg-medium);
    border-color: var(--glass-border-hover);
    transform: translateY(-1px);
  }
  
  svg {
    opacity: 0.8;
  }
`;

const LogoutButton = styled(ActionButton)`
  color: var(--font-color-secondary);
  
  &:hover {
    border-color: #EF4444;
    color: #EF4444;
    background: rgba(239, 68, 68, 0.1);
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  transition: background 0.3s ease;
  
  /* Mobile styles */
  @media (max-width: 767px) {
    margin-left: 0;
  }
`;

const Header = styled.header`
  background: var(--glass-bg-light);
  backdrop-filter: blur(var(--glass-blur-medium));
  -webkit-backdrop-filter: blur(var(--glass-blur-medium));
  border-bottom: 1px solid var(--glass-border);
  padding: var(--space-4) var(--space-6);
  position: sticky;
  top: 0;
  z-index: 10;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(10px)) {
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color-strong);
  }
  
  /* Mobile styles */
  @media (max-width: 767px) {
    padding: var(--space-3) var(--space-4);
  }
`;

const MenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: var(--font-color-primary);
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--glass-bg-medium);
  }
  
  /* Only show on mobile */
  @media (max-width: 767px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const PageTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const PageTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--font-color-primary);
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.01em;
  
  /* Mobile styles */
  @media (max-width: 767px) {
    font-size: 1.25rem;
  }
`;

const PageBreadcrumb = styled.span`
  font-size: 0.75rem;
  color: var(--font-color-tertiary);
  font-weight: 500;
  letter-spacing: 0.02em;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: var(--space-6);
  background: var(--bg-primary);
  
  /* Transición de página */
  & > * {
    animation: pageEnter 0.2s ease-out;
  }
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
      { label: 'Insumos', to: '/almacen/insumos', requiredLevel: 2 },
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
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const avatarUrl = user?.avatar ? pb.files.getUrl(user, user.avatar) : null;
  const displayName = user?.name || user?.username || user?.email || 'Usuario';

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Close sidebar when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

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

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleBackdropClick = () => {
    setSidebarOpen(false);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return { title: 'Dashboard', breadcrumb: 'Inicio' };
    if (path.startsWith('/almacen/entradas')) return { title: 'Entradas de Equipos', breadcrumb: 'Almacén / Entradas' };
    if (path.startsWith('/almacen/equipos')) return { title: 'Equipos', breadcrumb: 'Almacén / Inventario' };
    if (path.startsWith('/almacen/insumos')) return { title: 'Insumos', breadcrumb: 'Almacén / Inventario' };
    if (path.startsWith('/salidas/equipos')) return { title: 'Salidas de Equipos', breadcrumb: 'Salidas / Equipos' };
    if (path.startsWith('/salidas/insumos')) return { title: 'Salidas de Insumos', breadcrumb: 'Salidas / Insumos' };
    if (path.startsWith('/users')) return { title: 'Usuarios', breadcrumb: 'Administración' };
    if (path.startsWith('/reports')) return { title: 'Reportes', breadcrumb: 'Análisis' };
    return { title: 'Dashboard', breadcrumb: 'Inicio' };
  };

  const pageInfo = getPageTitle();

  return (
    <LayoutContainer>
      {/* Mobile backdrop */}
      <SidebarBackdrop $isOpen={isMobile && sidebarOpen} onClick={handleBackdropClick} />
      
      <Sidebar $isOpen={sidebarOpen}>
        <SidebarHeader>
          <LogoContainer>
            <LogoIcon>
              <RoundBottomFlask />
            </LogoIcon>
            <LogoText>
              <Logo>COMINTEC</Logo>
              <LogoSubtitle>Inventario</LogoSubtitle>
            </LogoText>
          </LogoContainer>
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
          <MenuButton onClick={handleMenuClick}>
            {sidebarOpen ? <X /> : <Menu />}
          </MenuButton>
          <PageTitleContainer>
            <PageBreadcrumb>{pageInfo.breadcrumb}</PageBreadcrumb>
            <PageTitle>{pageInfo.title}</PageTitle>
          </PageTitleContainer>
        </Header>
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
}
