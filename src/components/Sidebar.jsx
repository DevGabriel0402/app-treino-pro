import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  ClipboardList, 
  MessageSquare, 
  CreditCard,
  BrainCircuit,
  LogOut,
  User,
  Scale,
  ChevronLeft,
  ChevronRight,
  Menu,
  Settings
} from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import { auth } from '../services/firebase';

const SidebarContainer = styled.aside`
  width: ${props => props.$isCollapsed ? '80px' : '280px'};
  background: #000;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  @media (max-width: 768px) {
    display: none;
  }
`;

const LogoSection = styled.div`
  padding: 2.5rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 100px;
  
  .logo-box {
    background: #fff;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  h2 {
    font-size: 1.1rem;
    font-weight: 900;
    letter-spacing: 2px;
    color: #fff;
    white-space: nowrap;
    opacity: ${props => props.$isCollapsed ? 0 : 1};
    transition: opacity 0.2s;
  }
`;

const NavList = styled.nav`
  flex: 1;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 14px;
  border-radius: 12px;
  cursor: pointer;
  color: #94a3b8;
  background: transparent;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
  text-decoration: none;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.04);
  }

  &.active {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
    border-left-color: var(--accent);
  }

  span {
    font-weight: 600;
    font-size: 0.85rem;
    opacity: ${props => props.$isCollapsed ? 0 : 1};
    transition: opacity 0.2s;
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const ProfileSection = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  gap: 12px;
  
  .info {
    color: #fff;
    opacity: ${props => props.$isCollapsed ? 0 : 1};
    transition: opacity 0.2s;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #fff;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.8rem;
  flex-shrink: 0;
`;

const CollapseButton = styled.button`
  position: absolute;
  right: 12px;
  top: 35px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { role, user, settings } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const adminItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'students', label: 'ALUNOS', icon: Users, path: '/admin/students' },
    { id: 'exercises', label: 'BIBLIOTECA', icon: Dumbbell, path: '/admin/exercises' },
    { id: 'trainings', label: 'MONTAR TREINO', icon: ClipboardList, path: '/admin/trainings' },
    { id: 'financial', label: 'FINANCEIRO', icon: CreditCard, path: '/admin/financial' },
    { id: 'settings', label: 'CONFIGURAÇÕES', icon: Settings, path: '/admin/settings' },
  ];

  const studentItems = [
    { id: 'dashboard', label: 'INÍCIO', icon: LayoutDashboard, path: '/aluno/dashboard' },
    { id: 'my-training', label: 'MEU TREINO', icon: ClipboardList, path: '/aluno/my-training' },
    { id: 'progress', label: 'PERFIL', icon: User, path: '/aluno/progress' },
  ];

  const items = role === 'admin' ? adminItems : studentItems;

  return (
    <SidebarContainer $isCollapsed={isCollapsed}>
      <LogoSection $isCollapsed={isCollapsed}>
        <div className="logo-box">
          <Dumbbell size={18} color="black" />
        </div>
        <h2>{settings?.systemName || 'ATLAS PRO'}</h2>
      </LogoSection>

      <CollapseButton onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </CollapseButton>

      <NavList>
        {items.map(item => (
          <StyledNavLink 
            key={item.id} 
            to={item.path}
            $isCollapsed={isCollapsed}
            onClick={() => {
              if (isCollapsed) setIsCollapsed(false);
            }}
            title={isCollapsed ? item.label : ''}
          >
            <item.icon />
            <span>{item.label}</span>
          </StyledNavLink>
        ))}
      </NavList>

      <ProfileSection $isCollapsed={isCollapsed}>
        <Avatar>{user?.name?.charAt(0) || 'U'}</Avatar>
        <div className="info">
          <p style={{ fontSize: '0.8rem', fontWeight: 800 }}>{user?.name?.split(' ')[0] || 'Usuário'}</p>
          <p style={{ fontSize: '0.7rem', color: '#64748b' }}>{role === 'admin' ? 'TREINADOR' : 'ALUNO'}</p>
        </div>
        {!isCollapsed && (
          <LogOut 
            size={16} 
            color="#64748b" 
            style={{ marginLeft: 'auto', cursor: 'pointer' }}
            onClick={() => {
              if (role === 'admin') {
                auth.signOut();
                navigate('/admin/login');
              } else {
                localStorage.removeItem('student_session');
                dispatch(logout());
                navigate('/login');
              }
            }}
          />
        )}
      </ProfileSection>
    </SidebarContainer>
  );
};

export default Sidebar;
