import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarItem } from './SidebarItem';
import { useAuth } from '../contexts/AuthContext';
import pb from '../services/pocketbase';
import { useTheme } from '../comintec-design-system/emotion/ThemeProvider';
import { useIsMobile, useViewport, useKeyboardHeight } from '../hooks';
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
  height: 100dvh; /* Dynamic viewport height for mobile browsers */
  left: 0;
  top: 0;
  z-index: 1000;
  transition: all var(--transition-normal);
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(16px)) {
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-color-strong);
  }

  /* Mobile styles with safe area support */
  @media (max-width: 767px) {
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${props => props.$isOpen ? 'var(--glass-shadow-elevated)' : 'none'};
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    
    /* Landscape optimization: reduce width to save horizontal space */
    @media (orientation: landscape) {
      width: 200px;
    }
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
  
  /* Mobile: Adjust padding for better spacing */
  @media (max-width: 767px) {
    padding: var(--space-4) var(--space-4);
    padding-top: calc(var(--space-4) + env(safe-area-inset-top, 0px));
  }
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
  
  /* Mobile: Add safe area support */
  @media (max-width: 767px) {
    padding-bottom: calc(var(--space-4) + env(safe-area-inset-bottom, 0px));
  }
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
  
  /* Mobile styles with safe area support */
  @media (max-width: 767px) {
    padding: var(--space-3) var(--space-4);
    padding-top: calc(var(--space-3) + env(safe-area-inset-top, 0px));
    gap: var(--space-3);
    min-height: 60px;
    
    /* Landscape optimization: reduce height to save vertical space */
    @media (orientation: landscape) {
      min-height: 48px;
      padding: var(--space-2) var(--space-4);
      padding-top: calc(var(--space-2) + env(safe-area-inset-top, 0px));
    }
    
    /* Short viewport optimization */
    @media (max-height: 599px) {
      min-height: 44px;
      padding: var(--space-2) var(--space-3);
      padding-top: calc(var(--space-2) + env(safe-area-inset-top, 0px));
    }
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
  
  /* Accessibility: Enhanced focus indicators */
  &:focus-visible {
    outline: 3px solid var(--accent-blue);
    outline-offset: 2px;
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.15);
  }
  
  /* Remove default focus outline for mouse users */
  &:focus:not(:focus-visible) {
    outline: none;
  }
  
  &:hover {
    background: var(--glass-bg-medium);
  }
  
  /* Only show on mobile */
  @media (max-width: 767px) {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    padding: var(--space-3);
    
    /* Enhanced focus for mobile */
    &:focus-visible {
      outline: 4px solid var(--accent-blue);
      outline-offset: 3px;
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    border: 2px solid currentColor;
    
    &:focus-visible {
      outline: 4px solid currentColor;
    }
  }
  
  svg {
    width: 20px;
    height: 20px;
    
    /* Mobile: Slightly larger icon for better visibility */
    @media (max-width: 767px) {
      width: 22px;
      height: 22px;
    }
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
  
  /* Mobile: More compact breadcrumbs */
  @media (max-width: 767px) {
    font-size: 0.6875rem;
    letter-spacing: 0.01em;
    opacity: 0.8;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: var(--space-6);
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
  
  /* Enhanced page transitions */
  & > * {
    animation: pageEnter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation-fill-mode: both;
  }
  
  /* Staggered animation for child elements */
  & > *:nth-child(1) { animation-delay: 0ms; }
  & > *:nth-child(2) { animation-delay: 50ms; }
  & > *:nth-child(3) { animation-delay: 100ms; }
  & > *:nth-child(4) { animation-delay: 150ms; }
  
  /* Mobile optimizations */
  @media (max-width: 767px) {
    /* Portrait: optimize for vertical space */
    @media (orientation: portrait) {
      padding: var(--space-4) var(--space-3);
    }
    
    /* Landscape: more compact padding */
    @media (orientation: landscape) {
      padding: var(--space-3);
    }
    
    /* Short viewport: minimal padding */
    @media (max-height: 599px) {
      padding: var(--space-2) var(--space-3);
    }
    
    /* Faster animations on mobile for better performance */
    & > * {
      animation-duration: 0.2s;
    }
  }
  
  /* Keyboard visibility handling */
  ${props => props.$keyboardVisible && `
    padding-bottom: calc(var(--space-6) + ${props.$keyboardHeight}px);
    
    @media (max-width: 767px) {
      padding-bottom: calc(var(--space-3) + ${props.$keyboardHeight}px);
    }
  `}
  
  /* Smooth transitions for layout changes */
  transition: padding-bottom var(--transition-normal) ease-out;
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
  const viewport = useViewport();
  const keyboardState = useKeyboardHeight();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageTransition, setPageTransition] = useState('pageEnter');
  const [previousPath, setPreviousPath] = useState(location.pathname);

  const avatarUrl = user?.avatar ? pb.files.getUrl(user, user.avatar) : null;
  const displayName = user?.name || user?.username || user?.email || 'Usuario';

  // Handle page transitions based on route changes
  useEffect(() => {
    if (previousPath !== location.pathname) {
      // Determine transition type based on navigation pattern
      const getTransitionType = (from, to) => {
        // Dashboard to any page
        if (from === '/' && to !== '/') return 'slideInFromRight';
        // Any page back to dashboard
        if (from !== '/' && to === '/') return 'slideInFromLeft';
        // Between similar sections (almacen, salidas)
        if (from.includes('/almacen') && to.includes('/almacen')) return 'fadeInUp';
        if (from.includes('/salidas') && to.includes('/salidas')) return 'fadeInUp';
        // Default smooth transition
        return 'pageEnter';
      };

      const transitionType = getTransitionType(previousPath, location.pathname);
      setPageTransition(transitionType);
      setPreviousPath(location.pathname);

      // Reset transition after animation completes
      const timer = setTimeout(() => {
        setPageTransition('pageEnter');
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, previousPath]);

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

  // Handle keyboard visibility for focus management
  useEffect(() => {
    if (keyboardState.isVisible) {
      // Ensure focused element remains visible when keyboard appears
      const activeElement = document.activeElement;
      if (activeElement && activeElement.scrollIntoView) {
        setTimeout(() => {
          activeElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 100);
      }
    }
  }, [keyboardState.isVisible]);

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
      {/* Skip to main content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
        style={{
          position: 'absolute',
          left: '-9999px',
          zIndex: 9999,
          padding: 'var(--space-2) var(--space-3)',
          background: 'var(--accent-blue)',
          color: 'white',
          borderRadius: 'var(--radius-sm)',
          textDecoration: 'none',
          fontSize: 'var(--font-size-sm)',
          fontWeight: '500'
        }}
        onFocus={(e) => {
          e.target.style.left = 'var(--space-4)';
          e.target.style.top = 'var(--space-4)';
        }}
        onBlur={(e) => {
          e.target.style.left = '-9999px';
        }}
      >
        Saltar al contenido principal
      </a>

      {/* Mobile backdrop */}
      <SidebarBackdrop 
        $isOpen={isMobile && sidebarOpen} 
        onClick={handleBackdropClick}
        aria-hidden={!sidebarOpen}
      />
      
      <Sidebar 
        $isOpen={sidebarOpen}
        role="navigation"
        aria-label="Navegación principal"
        aria-hidden={isMobile && !sidebarOpen}
      >
        <SidebarHeader>
          <LogoContainer>
            <LogoIcon aria-hidden="true">
              <RoundBottomFlask />
            </LogoIcon>
            <LogoText>
              <Logo>COMINTEC</Logo>
              <LogoSubtitle>Inventario</LogoSubtitle>
            </LogoText>
          </LogoContainer>
        </SidebarHeader>
        <SidebarNav role="list" aria-label="Menú de navegación">
          {menuItems.map((item, index) => {
             if (!hasPermission(item.requiredLevel)) return null;
             
             if (item.submenu) {
                 const visibleSubitems = item.submenu.filter(sub => hasPermission(sub.requiredLevel));
                 if (visibleSubitems.length === 0) return null;
                 
                 return (
                     <div key={index} role="group" aria-labelledby={`section-${index}`}>
                         <div 
                           id={`section-${index}`}
                           style={{ 
                             padding: '12px 16px 4px', 
                             fontSize: '11px', 
                             fontWeight: 'bold', 
                             color: 'var(--font-color-secondary)', 
                             textTransform: 'uppercase', 
                             letterSpacing: '0.05em' 
                           }}
                           role="heading"
                           aria-level="3"
                         >
                             {item.label}
                         </div>
                         {visibleSubitems.map(sub => (
                             <SidebarItem
                                 key={sub.to}
                                 icon={item.icon}
                                 label={sub.label}
                                 to={sub.to}
                                 role="listitem"
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
                role="listitem"
              />
            );
          })}
        </SidebarNav>
        <SidebarFooter>
          <UserInfo role="region" aria-label="Información del usuario">
            <UserAvatar aria-hidden="true">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={`Avatar de ${displayName}`}
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
          
          <ActionButton 
            onClick={toggleTheme}
            aria-label={`Cambiar a ${mode === 'dark' ? 'modo claro' : 'modo oscuro'}`}
            type="button"
          >
            {mode === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
            {mode === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
          </ActionButton>

          <LogoutButton 
            onClick={handleLogout}
            aria-label="Cerrar sesión de la aplicación"
            type="button"
          >
            <LogOut size={16} aria-hidden="true" />
            Cerrar Sesión
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>

      <MainContent role="main">
        <Header role="banner">
          <MenuButton 
            onClick={handleMenuClick}
            aria-label={sidebarOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={sidebarOpen}
            aria-controls="sidebar-nav"
            type="button"
          >
            {sidebarOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </MenuButton>
          <PageTitleContainer>
            <PageBreadcrumb aria-label="Ruta de navegación">{pageInfo.breadcrumb}</PageBreadcrumb>
            <PageTitle id="page-title" role="heading" aria-level="1">{pageInfo.title}</PageTitle>
          </PageTitleContainer>
        </Header>
        <ContentArea 
          id="main-content"
          $keyboardVisible={keyboardState.isVisible}
          $keyboardHeight={keyboardState.height}
          className={`
            page-transition-${pageTransition}
            ${viewport.isLandscape && viewport.isMobile ? 'mobile-content-landscape' : ''}
            ${viewport.isPortrait && viewport.isMobile ? 'mobile-content-portrait' : ''}
            ${viewport.isShortViewport ? 'short-viewport-content' : ''}
            ${keyboardState.isVisible ? 'keyboard-visible' : ''}
            keyboard-focus-container
          `}
          role="main"
          aria-labelledby="page-title"
          tabIndex={-1}
        >
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
}
