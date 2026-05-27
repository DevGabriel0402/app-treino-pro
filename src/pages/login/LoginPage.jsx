import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { setUser, setRole } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import { Dumbbell, ArrowRight, Loader2, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { maskCPF } from '../../utils/masks';
import { Link, useNavigate } from 'react-router-dom';

const LoginContainer = styled.div`
  height: 100vh;
  display: flex;
  background: ${props => props.$isAdmin ? '#09090b' : '#fff'};
  color: ${props => props.$isAdmin ? '#fff' : '#0f172a'};
  transition: background 0.3s ease, color 0.3s ease;
  font-family: 'Outfit', 'Inter', sans-serif;
`;

const ImageSection = styled.div`
  flex: 1;
  background: ${props => props.$isAdmin 
    ? 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 40%), #09090b' 
    : '#1a1a1a'};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 5rem;
  color: #fff;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  @media (max-width: 900px) { display: none; }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: ${props => props.$isAdmin ? 0.04 : 0.05};
    background-image: linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(circle at 50% 50%, black 60%, transparent 100%);
    pointer-events: none;
  }

  h1 { 
    font-size: 3.5rem; 
    font-weight: 800; 
    letter-spacing: -2px; 
    line-height: 1.05; 
    z-index: 1; 
    text-transform: uppercase;
    margin-top: auto;
    margin-bottom: 0;
    
    span {
      background: ${props => props.$isAdmin 
        ? 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)' 
        : 'linear-gradient(135deg, var(--accent) 0%, #1a1a1a 100%)'};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 900;
    }
  }
  
  p { 
    font-size: 1.1rem; 
    color: #a1a1aa; 
    margin-top: 1.5rem; 
    max-width: 440px; 
    font-weight: 400; 
    line-height: 1.6;
    z-index: 1;
    margin-bottom: auto;
  }
`;

const FormSection = styled.div`
  width: 550px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 5rem;
  background: ${props => props.$isAdmin ? '#09090b' : '#fff'};
  border-left: 1px solid ${props => props.$isAdmin ? '#18181b' : '#f1f5f9'};
  position: relative;
  transition: background 0.3s ease, border-color 0.3s ease;

  @media (max-width: 900px) { width: 100%; padding: 2rem; }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 1.5rem;
  position: relative;
  
  label { 
    font-size: 0.75rem; 
    font-weight: 700; 
    color: ${props => props.$isAdmin ? '#a1a1aa' : '#64748b'}; 
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  color: ${props => props.$isAdmin ? '#52525b' : '#94a3b8'};
  display: flex;
  align-items: center;
  pointer-events: none;
  transition: color 0.2s ease;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px 14px ${props => props.$hasIcon ? '46px' : '16px'};
  border: 1px solid ${props => props.$isAdmin ? '#27272a' : '#e2e8f0'};
  background: ${props => props.$isAdmin ? '#18181b' : '#fff'};
  color: ${props => props.$isAdmin ? '#fff' : '#0f172a'};
  border-radius: 12px;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:focus { 
    border-color: ${props => props.$isAdmin ? '#6366f1' : '#0f172a'};
    box-shadow: ${props => props.$isAdmin ? '0 0 0 2px rgba(99, 102, 241, 0.15)' : '0 0 0 2px rgba(15, 23, 42, 0.05)'};
    background: ${props => props.$isAdmin ? '#18181b' : '#fff'};
  }
  
  &:focus + ${InputIcon} {
    color: ${props => props.$isAdmin ? '#6366f1' : '#0f172a'};
  }
`;

const PasswordToggle = styled.div`
  position: absolute;
  right: 16px;
  cursor: pointer;
  color: #71717a;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;
  &:hover { color: ${props => props.$isAdmin ? '#fff' : '#0f172a'}; }
`;

const LoginButton = styled.button`
  background: ${props => props.$isAdmin 
    ? 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)' 
    : 'var(--accent)'};
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  margin-top: 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.5px;
  box-shadow: ${props => props.$isAdmin 
    ? '0 4px 20px rgba(99, 102, 241, 0.2)' 
    : 'none'};

  &:hover { 
    transform: translateY(-2px); 
    box-shadow: ${props => props.$isAdmin 
      ? '0 8px 30px rgba(99, 102, 241, 0.35)' 
      : '0 4px 12px rgba(0, 0, 0, 0.05)'};
    filter: brightness(1.05);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled { 
    opacity: 0.6; 
    cursor: not-allowed; 
    transform: none; 
    box-shadow: none;
  }
`;

const SwitchLink = styled.div`
  margin-top: 3rem;
  text-align: center;
  font-size: 0.85rem;
  color: #71717a;
  
  @media (max-width: 900px) {
    display: ${props => props.$isAdmin ? 'block' : 'none'};
  }
  
  a {
    color: ${props => props.$isAdmin ? '#a855f7' : 'var(--accent)'};
    text-decoration: none;
    font-weight: 700;
    margin-left: 6px;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      text-decoration: underline;
      filter: brightness(1.2);
    }
  }
`;

const LoginPage = ({ type = 'student' }) => {
  const { settings } = useSelector(state => state.auth);
  const isAdmin = type === 'admin';
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user doc immediately for faster redirect
      const userDoc = await getDocs(query(collection(db, "users"), where("__name__", "==", firebaseUser.uid)));
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        const serializableUser = { ...userData };
        Object.keys(serializableUser).forEach(key => {
          if (serializableUser[key] && typeof serializableUser[key].toDate === 'function') {
            serializableUser[key] = serializableUser[key].toDate().toISOString();
          }
        });
        dispatch(setUser({ id: firebaseUser.uid, ...serializableUser }));
        dispatch(setRole(userData.role || 'admin'));
        toast.success('Bem-vindo, Treinador');
        navigate('/admin');
      } else {
        toast.error('Conta não encontrada.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Email ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    if (!cpf) return toast.error('Digite seu CPF');
    setLoading(true);
    try {
      const maskedCpf = cpf;
      const rawCpf = cpf.replace(/\D/g, '');

      // Try masked first
      let q = query(collection(db, "users"), where("cpf", "==", maskedCpf), where("role", "==", "student"));
      let querySnapshot = await getDocs(q);

      // If not found, try unmasked
      if (querySnapshot.empty) {
        q = query(collection(db, "users"), where("cpf", "==", rawCpf), where("role", "==", "student"));
        querySnapshot = await getDocs(q);
      }
      
      if (!querySnapshot.empty) {
        const studentData = querySnapshot.docs[0].data();
        
        // Convert Timestamps to serializable strings
        const serializableStudent = { ...studentData };
        Object.keys(serializableStudent).forEach(key => {
          if (serializableStudent[key] && typeof serializableStudent[key].toDate === 'function') {
            serializableStudent[key] = serializableStudent[key].toDate().toISOString();
          }
        });

        const studentSession = { id: querySnapshot.docs[0].id, ...serializableStudent };
        localStorage.setItem('student_session', JSON.stringify(studentSession));

        dispatch(setUser(studentSession));
        dispatch(setRole('student'));
        toast.success(`Bem-vindo, ${studentData.name}`);
        navigate('/aluno');
      } else {
        toast.error('CPF não encontrado ou acesso negado.');
      }
    } catch (error) {
      console.error(error);
      if (error.code === 'permission-denied') {
        toast.error('Acesso negado: Verifique as regras do Firestore.');
      } else {
        toast.error(`Erro de conexão: ${error.message || 'Falha na conexão'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer $isAdmin={isAdmin}>
      <ImageSection $isAdmin={isAdmin}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'absolute', top: '5rem', left: '5rem', zIndex: 1 }}>
          <div style={{ background: '#fff', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Dumbbell size={20} color="black" />
          </div>
          <span style={{ fontWeight: 800, letterSpacing: '3px', fontSize: '1.1rem', color: '#fff' }}>{settings?.systemName || 'TREINO PRO'}</span>
        </div>
        <h1>
          {isAdmin ? (
            <>PAINEL DO<br/><span>TREINADOR</span>.<br/>CONTROLE<br/>TOTAL.</>
          ) : (
            <>VALORES<br/>CENTRAIS.<br/><span>RESULTADOS</span><br/>ELITE.</>
          )}
        </h1>
        <p>
          {isAdmin 
            ? "Gerencie treinos, alunos, finanças e acompanhe o progresso da sua consultoria em tempo real."
            : "O ecossistema premium para gestão fitness de alta performance e atletas de elite."
          }
        </p>
      </ImageSection>

      <FormSection $isAdmin={isAdmin}>
        <FormContainer>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3rem', color: isAdmin ? '#fff' : '#0f172a' }}>
            <div style={{ 
              background: isAdmin ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', 
              padding: '10px', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: isAdmin ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9'
            }}>
              <Dumbbell size={22} color={isAdmin ? '#a855f7' : 'var(--accent)'} />
            </div>
            <span style={{ fontWeight: 800, letterSpacing: '2px', fontSize: '1rem', textTransform: 'uppercase' }}>
              {settings?.systemName || 'TREINO PRO'}
            </span>
          </div>

          <div style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-1px', color: isAdmin ? '#fff' : '#0f172a' }}>
              {isAdmin ? 'Portal do Treinador' : 'Portal do Aluno'}
            </h2>
            <p style={{ color: isAdmin ? '#a1a1aa' : '#64748b', fontSize: '0.95rem', marginTop: '8px', lineHeight: 1.5 }}>
              {isAdmin ? 'Identifique-se para gerenciar a plataforma' : 'Informe seu CPF para acessar seus treinos'}
            </p>
          </div>

          <form onSubmit={isAdmin ? handleAdminLogin : handleStudentLogin}>
            {isAdmin ? (
              <>
                <InputGroup $isAdmin={isAdmin}>
                  <label>E-mail</label>
                  <InputWrapper>
                    <InputIcon $isAdmin={isAdmin}>
                      <Mail size={18} />
                    </InputIcon>
                    <Input 
                      type="email" 
                      placeholder="coach@treinopro.com" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                      $isAdmin={isAdmin} 
                      $hasIcon={true}
                    />
                  </InputWrapper>
                </InputGroup>
                <InputGroup $isAdmin={isAdmin}>
                  <label>Senha</label>
                  <InputWrapper>
                    <InputIcon $isAdmin={isAdmin}>
                      <Lock size={18} />
                    </InputIcon>
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required 
                      $isAdmin={isAdmin}
                      $hasIcon={true}
                    />
                    <PasswordToggle onClick={() => setShowPassword(!showPassword)} $isAdmin={isAdmin}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </PasswordToggle>
                  </InputWrapper>
                </InputGroup>
              </>
            ) : (
              <InputGroup $isAdmin={isAdmin}>
                <label>Seu CPF</label>
                <InputWrapper>
                  <InputIcon $isAdmin={isAdmin}>
                    <User size={18} />
                  </InputIcon>
                  <Input 
                    placeholder="000.000.000-00" 
                    value={cpf} 
                    onChange={e => setCpf(maskCPF(e.target.value))} 
                    required 
                    $isAdmin={isAdmin}
                    $hasIcon={true}
                  />
                </InputWrapper>
              </InputGroup>
            )}

            <LoginButton type="submit" disabled={loading} $isAdmin={isAdmin}>
              {loading ? <Loader2 className="animate-spin" /> : <>{isAdmin ? 'ACESSAR PAINEL' : 'ACESSAR TREINOS'} <ArrowRight size={18} /></>}
            </LoginButton>
          </form>

          <SwitchLink $isAdmin={isAdmin}>
            {isAdmin ? (
              <>
                É aluno? <Link to="/login">Acessar treinos</Link>
              </>
            ) : (
              <>
                É treinador? <Link to="/admin/login">Acessar painel</Link>
              </>
            )}
          </SwitchLink>
          
          <p style={{ marginTop: '3.5rem', fontSize: '0.75rem', color: '#52525b', textAlign: 'center', fontWeight: 600, letterSpacing: '0.5px' }}>
            PROTEGIDO POR PROTOCOLO TREINO SECURITY
          </p>
        </FormContainer>
      </FormSection>
    </LoginContainer>
  );
};

export default LoginPage;
