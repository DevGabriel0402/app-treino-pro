import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Toaster, toast } from 'react-hot-toast';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { store } from './store';
import { setUser, setRole, setSettings } from './store/slices/authSlice';
import { auth, db } from './services/firebase';
import AdminPanel from './pages/AdminPanel';
import StudentPanel from './pages/StudentPanel';
import LoginPage from './pages/LoginPage';
import GlobalStyles from './styles/GlobalStyles';
import DashboardLayout from './components/DashboardLayout';

const RootContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-main);
  color: var(--text-main);
`;

const LoadingScreen = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-main);
  font-family: 'Outfit', 'Inter', sans-serif;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  max-width: 320px;
  width: 90%;
`;

const ModernLoaderWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GlowingOrb = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.$accent || '#3b82f6'};
  filter: blur(16px);
  opacity: 0.2;
  animation: breathe 2s ease-in-out infinite;

  @keyframes breathe {
    0%, 100% { transform: scale(0.85); opacity: 0.12; }
    50% { transform: scale(1.25); opacity: 0.32; }
  }
`;

const ModernSpinner = styled.div`
  position: absolute;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid rgba(0, 0, 0, 0.04);
  border-top-color: ${props => props.$accent || '#3b82f6'};
  
  @keyframes spinProgress {
    to { transform: rotate(360deg); }
  }
  animation: spinProgress 1s cubic-bezier(0.55, 0.2, 0.3, 0.8) infinite;
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const ProgressBarActive = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, transparent, ${props => props.$accent || '#3b82f6'}, transparent);
  width: 60%;
  border-radius: 10px;
  
  @keyframes progressMove {
    0% { left: -60%; }
    100% { left: 100%; }
  }
  animation: progressMove 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
`;

const LoadingText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  
  h3 {
    color: var(--text-main);
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    animation: pulseText 1.5s ease-in-out infinite;
  }
  
  p {
    color: #64748b;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  @keyframes pulseText {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
`;

function AppContent() {
  const { role, user, settings } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [initializing, setInitializing] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, "settings", "system"), async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        localStorage.setItem('system_settings', JSON.stringify(data));
        dispatch(setSettings(data));
      } else {
        const defaultSettings = {
          systemName: 'ATLAS PRO',
          pixCode: '00020101021126580014br.gov.bcb.pix01369c3a382c-4cfc-43f1-a1e6-42bb53c65c695204000053039865406150.005802BR5913AtlasProSaaS6009BeloHoriz62070503***63041A2D',
          contactPhone: '5531991660594',
          themeColor: '#000000'
        };
        try {
          await setDoc(doc(db, "settings", "system"), defaultSettings);
          localStorage.setItem('system_settings', JSON.stringify(defaultSettings));
          dispatch(setSettings(defaultSettings));
        } catch (e) {
          console.error("Erro ao criar configurações padrões:", e);
        }
      }
    }, (error) => {
      console.error("Erro ao carregar configurações do sistema:", error);
    });
    return () => unsubSettings();
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          localStorage.removeItem('student_session');
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const serializableUser = { ...userData };
            Object.keys(serializableUser).forEach(key => {
              if (serializableUser[key] && typeof serializableUser[key].toDate === 'function') {
                serializableUser[key] = serializableUser[key].toDate().toISOString();
              }
            });

            dispatch(setUser({ id: firebaseUser.uid, ...serializableUser }));
            dispatch(setRole(userData.role || 'admin'));
          }
        } else {
          const studentSession = localStorage.getItem('student_session');
          if (studentSession) {
            const parsed = JSON.parse(studentSession);
            try {
              const userDoc = await getDoc(doc(db, "users", parsed.id));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                const serializableUser = { ...userData };
                Object.keys(serializableUser).forEach(key => {
                  if (serializableUser[key] && typeof serializableUser[key].toDate === 'function') {
                    serializableUser[key] = serializableUser[key].toDate().toISOString();
                  }
                });
                const updatedSession = { id: parsed.id, ...serializableUser };
                localStorage.setItem('student_session', JSON.stringify(updatedSession));
                dispatch(setUser(updatedSession));
              } else {
                dispatch(setUser(parsed));
              }
            } catch (err) {
              console.error("Erro ao sincronizar dados do aluno:", err);
              dispatch(setUser(parsed));
            }
            dispatch(setRole('student'));
          } else {
            dispatch(setUser(null));
            dispatch(setRole(null));
          }
        }
      } catch (e) {
        console.error("Erro ao carregar usuário:", e);
      } finally {
        setInitializing(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (initializing) {
    const systemName = settings?.systemName || 'ATLAS PRO';
    const accent = settings?.themeColor || '#3b82f6';
    return (
      <LoadingScreen>
        <LoadingContainer>
          <ModernLoaderWrapper>
            <GlowingOrb $accent={accent} />
            <ModernSpinner $accent={accent} />
          </ModernLoaderWrapper>
          
          <LoadingText>
            <h3>{systemName}</h3>
            <p>Preparando seu treino...</p>
          </LoadingText>

          <ProgressBarWrapper>
            <ProgressBarActive $accent={accent} />
          </ProgressBarWrapper>
        </LoadingContainer>
      </LoadingScreen>
    );
  }

  if (!user) {
    return (
      <>
        <GlobalStyles $accentColor={settings?.themeColor || '#000000'} />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage type="student" />} />
          <Route path="/admin/login" element={<LoginPage type="admin" />} />
          <Route path="*" element={
            location.pathname.startsWith('/admin') ? (
              <Navigate to="/admin/login" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
        </Routes>
      </>
    );
  }

  return (
    <RootContainer>
      <GlobalStyles $accentColor={settings?.themeColor || '#000000'} />
      <Toaster position="top-right" />
      
      <Routes>
        <Route path="/admin/*" element={
          role === 'admin' ? (
            <DashboardLayout>
              <AdminPanel />
            </DashboardLayout>
          ) : <Navigate to="/aluno" replace />
        } />
        
        <Route path="/aluno/*" element={
          role === 'student' ? (
            <DashboardLayout>
              <StudentPanel />
            </DashboardLayout>
          ) : <Navigate to="/admin" replace />
        } />

        <Route path="/" element={
          role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/aluno" replace />
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </RootContainer>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
