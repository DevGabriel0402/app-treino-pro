import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import { Search, Menu, LayoutDashboard, ClipboardList, Dumbbell, CreditCard, User, Scale, Users, Settings, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { auth } from '../services/firebase';

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--bg-main);
  position: relative;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: ${props => props.$isCollapsed ? '80px' : '280px'};
  padding: 3rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding-bottom: 100px; /* Space for mobile nav */

  @media (max-width: 1024px) {
    margin-left: 80px;
    padding: 2rem;
  }
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1.5rem;
    padding-top: 1rem;
    padding-bottom: 100px;
  }
`;

const TopBar = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    height: 60px;
  }
`;

const IconButton = styled.button`
  background: #fff;
  border: 1px solid #f1f5f9;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
  
  &:hover {
    border-color: #000;
    color: #000;
    transform: translateY(-1px);
  }
`;

const MobileLogOutButton = styled.button`
  background: transparent;
  border: none;
  padding: 8px;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ef4444;
  transition: all 0.2s;
  border-radius: 8px;

  &:hover {
    background: #fef2f2;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const BottomNav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 75px;
  background: #fff;
  border-top: 1px solid #f1f5f9;
  display: none;
  justify-content: space-around;
  align-items: center;
  padding: 0 5px;
  z-index: 1000;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.03);

  @media (max-width: 768px) {
    display: flex;
  }
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: ${props => props.$active ? 'var(--accent)' : '#94a3b8'};
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  height: 100%;
  
  span {
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2px;
    text-align: center;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { role, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (role === 'admin') {
      auth.signOut();
      navigate('/admin/login');
    } else {
      localStorage.removeItem('student_session');
      dispatch(logout());
      navigate('/login');
    }
  };

  const adminItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'students', label: 'Alunos', icon: Users, path: '/admin/students' },
    { id: 'exercises', label: 'Biblioteca', icon: Dumbbell, path: '/admin/exercises' },
    { id: 'trainings', label: 'Treino', icon: ClipboardList, path: '/admin/trainings' },
    { id: 'financial', label: 'Financeiro', icon: CreditCard, path: '/admin/financial' },
    { id: 'settings', label: 'Ajustes', icon: Settings, path: '/admin/settings' },
  ];

  const studentItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard, path: '/aluno/dashboard' },
    { id: 'my-training', label: 'Treino', icon: ClipboardList, path: '/aluno/my-training' },
    { id: 'progress', label: 'Perfil', icon: User, path: '/aluno/progress' },
  ];

  const items = role === 'admin' ? adminItems : studentItems;

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <LayoutWrapper>
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />
      <MainContent $isCollapsed={isCollapsed}>
        <TopBar>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'var(--accent)', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Dumbbell size={16} color="white" />
            </div>
            <span style={{ fontWeight: 800, letterSpacing: 1, fontSize: '0.8rem', display: 'block' }}>
              {role === 'admin' ? 'PORTAL DO TREINADOR' : 'PORTAL DO ALUNO'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div 
              onClick={() => {
                if (role === 'student') {
                  navigate('/aluno/progress');
                }
              }}
              onMouseEnter={(e) => {
                if (role === 'student') {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.background = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (role === 'student') {
                  e.currentTarget.style.borderColor = '#f1f5f9';
                  e.currentTarget.style.background = '#f8fafc';
                }
              }}
              style={{ 
                width: 36, 
                height: 36, 
                borderRadius: '10px', 
                background: '#f8fafc', 
                border: '1px solid #f1f5f9', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '0.75rem', 
                fontWeight: 600,
                cursor: role === 'student' ? 'pointer' : 'default',
                transition: 'all 0.2s ease'
              }}
              title={role === 'student' ? "Ir para o Perfil" : ""}
            >
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <MobileLogOutButton onClick={handleLogout} title="Sair da Conta">
              <LogOut size={18} />
            </MobileLogOutButton>
          </div>
        </TopBar>
        {children}
      </MainContent>

      <BottomNav>
        {items.map(item => (
          <NavItem 
            key={item.id} 
            $active={isActive(item.path)} 
            onClick={() => navigate(item.path)}
          >
            <item.icon />
            <span>{item.label}</span>
          </NavItem>
        ))}
      </BottomNav>
    </LayoutWrapper>
  );
};

export default DashboardLayout;
