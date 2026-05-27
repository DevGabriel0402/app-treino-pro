import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, query, where, getDocs, orderBy, limit, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

// Import Modular Tabs
import DashboardTab from './student/DashboardTab';
import MyTrainingTab from './student/MyTrainingTab';
import ProfileTab from './student/ProfileTab';

const PanelContainer = styled.div`
  color: #1a1a1a;
  max-width: 1100px;
  margin: 0 auto;
`;

const BlockedOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const BlockedCard = styled.div`
  background: #fff;
  border: 1px solid #f1f5f9;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  width: 100%;
  max-width: 480px;
  padding: 3rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1e293b;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 0.95rem;
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
`;

const AlertOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(12px);
  z-index: 4000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const AlertCard = styled.div`
  background: #fff;
  border: 1px solid #f1f5f9;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  width: 100%;
  max-width: 460px;
  padding: 2.5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: 1.6rem;
    font-weight: 700;
    color: #1e293b;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 0.9rem;
    color: #64748b;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }
`;

const PixBox = styled.div`
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  padding: 1.25rem;
  width: 100%;
  margin-bottom: 1.5rem;
  text-align: left;

  label {
    font-size: 0.7rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: block;
    margin-bottom: 8px;
  }

  .code-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .code {
    font-family: monospace;
    font-size: 0.75rem;
    color: #334155;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }
`;

const BlockedButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  margin-bottom: 10px;
  
  &.whatsapp {
    background: #25d366;
    color: #fff;
    &:hover {
      background: #20ba5a;
      transform: translateY(-1px);
    }
  }

  &.copy {
    background: #000;
    color: #fff;
    &:hover {
      background: #1a1a1a;
      transform: translateY(-1px);
    }
  }

  &.logout {
    background: transparent;
    border: 1px solid #e2e8f0;
    color: #64748b;
    &:hover {
      background: #f8fafc;
      color: #334155;
    }
  }
`;

const FloatingPaymentPill = styled.a`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  padding: 10px 16px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #334155;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  z-index: 3000;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.08);
    border-color: var(--accent);
  }

  .dot {
    width: 8px;
    height: 8px;
    background: #f59e0b;
    border-radius: 50%;
    animation: float-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes float-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .4; }
  }

  .arrow {
    transition: transform 0.2s;
  }
  
  &:hover .arrow {
    transform: translateX(2px);
  }
`;

const StudentPanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, settings } = useSelector(state => state.auth);
  
  const [userStatus, setUserStatus] = useState(user?.status || 'Ativo');
  const [allTrainings, setAllTrainings] = useState([]);
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [showTrainingList, setShowTrainingList] = useState(true);
  const [currentTraining, setCurrentTraining] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedEx, setSelectedEx] = useState(null);
  const [completedSeries, setCompletedSeries] = useState({});
  const [restTimer, setRestTimer] = useState(0);
  const [paymentsDueToday, setPaymentsDueToday] = useState([]);
  const [pendingPayment, setPendingPayment] = useState(null);
  const [showDueTodayModal, setShowDueTodayModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [profileWeight, setProfileWeight] = useState(80);
  const [profileHeight, setProfileHeight] = useState(1.75);
  const [profileAnamnesis, setProfileAnamnesis] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const userRef = doc(db, "users", user.id);
    const unsubscribeUser = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUserStatus(data.status || 'Ativo');
        if (data.weight !== undefined) setProfileWeight(data.weight);
        if (data.height !== undefined) setProfileHeight(data.height);
        if (data.anamnesis !== undefined) setProfileAnamnesis(data.anamnesis);
        
        const studentSession = localStorage.getItem('student_session');
        if (studentSession) {
          const parsed = JSON.parse(studentSession);
          const updated = { ...parsed, ...data };
          localStorage.setItem('student_session', JSON.stringify(updated));
        }
      }
    }, (error) => {
      console.error("Erro ao sincronizar status do usuário:", error);
    });

    return () => unsubscribeUser();
  }, [user]);

  useEffect(() => {
    let interval;
    if (restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev - 1);
      }, 1000);
    } else if (restTimer === 0 && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [restTimer]);

  useEffect(() => {
    if (!user?.id) return;
    
    const q = query(collection(db, "trainings"), where("userId", "==", user.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        docs.sort((a, b) => {
          const timeA = a.createdAt?.seconds || (a.createdAt ? new Date(a.createdAt).getTime() / 1000 : 0);
          const timeB = b.createdAt?.seconds || (b.createdAt ? new Date(b.createdAt).getTime() / 1000 : 0);
          return timeB - timeA;
        });
        setAllTrainings(docs);
        if (!currentTraining && docs.length > 0) {
          const trainingData = docs[0];
          setCurrentTraining(trainingData);
          if (trainingData.exercises?.length > 0) {
            if (typeof trainingData.exercises[0] === 'object') {
              setExercises(trainingData.exercises);
            } else {
              const exQ = query(collection(db, "exercises"), where("__name__", "in", trainingData.exercises));
              getDocs(exQ).then(exSnapshot => {
                setExercises(exSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
              });
            }
          }
        }
      } else {
        setAllTrainings([]);
        setCurrentTraining(null);
        setExercises([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching student training:", error);
      toast.error("Erro ao carregar o treino.");
      setLoading(false);
    });

    const qLogs = query(collection(db, "trainingLogs"), where("userId", "==", user.id), orderBy("completedAt", "desc"), limit(20));
    const unsubscribeLogs = onSnapshot(qLogs, (snapshot) => {
      setTrainingHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qPayments = query(collection(db, "payments"), where("studentId", "==", user.id), where("status", "==", "pending"));
    const unsubscribePayments = onSnapshot(qPayments, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort to get the most recent pending payment
      docs.sort((a, b) => b.dueDate.localeCompare(a.dueDate));
      setPendingPayment(docs[0] || null);

      const todayStr = new Date().toLocaleDateString('en-CA');
      const dueToday = docs.filter(p => p.dueDate === todayStr);
        
      setPaymentsDueToday(dueToday);
      
      const dismissedToday = sessionStorage.getItem('due_today_dismissed');
      if (dueToday.length > 0 && !dismissedToday) {
        setShowDueTodayModal(true);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeLogs();
      unsubscribePayments();
    };
  }, [user]);

  const handleSelectTraining = async (t) => {
    setCurrentTraining(t);
    setLoading(true);
    if (t.exercises?.length > 0) {
      if (typeof t.exercises[0] === 'object') {
        setExercises(t.exercises);
      } else {
        const exQ = query(collection(db, "exercises"), where("__name__", "in", t.exercises));
        const exSnapshot = await getDocs(exQ);
        setExercises(exSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } else {
      setExercises([]);
    }
    setLoading(false);
  };

  const getTrainingForDate = (date) => {
    if (!allTrainings || allTrainings.length === 0) return null;
    const baseDate = new Date(2026, 0, 1);
    const d1 = new Date(date); d1.setHours(0,0,0,0);
    const d2 = new Date(baseDate); d2.setHours(0,0,0,0);
    const diffTime = Math.abs(d1 - d2);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const index = diffDays % allTrainings.length;
    return allTrainings[index];
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    setSavingProfile(true);
    
    const userRef = doc(db, "users", user.id);
    const updateData = {
      weight: Number(profileWeight),
      height: Number(profileHeight),
      anamnesis: profileAnamnesis,
      updatedAt: new Date()
    };

    if (!navigator.onLine) {
      // Offline mode: save in local IndexedDB cache instantly
      setDoc(userRef, updateData, { merge: true }).catch(err => {
        console.error("Erro ao salvar perfil em cache offline:", err);
      });
      toast.success("Dados salvos localmente! Serão sincronizados quando você tiver internet. 📲");
      setSavingProfile(false);
      return;
    }

    try {
      await setDoc(userRef, updateData, { merge: true });
      toast.success("Perfil e dados de saúde atualizados!");
    } catch (e) {
      console.error("Erro ao salvar perfil:", e);
      toast.error("Erro ao salvar os dados.");
    } finally {
      setSavingProfile(false);
    }
  };

  if (userStatus === 'Inativo') {
    const pixCode = settings?.pixCode || "00020101021126580014br.gov.bcb.pix01369c3a382c-4cfc-43f1-a1e6-42bb53c65c695204000053039865406150.005802BR5913AtlasProSaaS6009BeloHoriz62070503***63041A2D";
    const contactPhone = settings?.contactPhone || "5531991660594";
    const systemName = settings?.systemName || "ATLAS PRO";
    
    const handleCopyPix = () => {
      navigator.clipboard.writeText(pixCode);
      toast.success("PIX Copia e Cola copiado!");
    };

    const handleLogout = () => {
      localStorage.removeItem('student_session');
      dispatch(logout());
      navigate('/login');
    };

    const pendingAmount = pendingPayment ? Number(pendingPayment.amount).toLocaleString('pt-BR') : "150,00";
    
    return (
      <BlockedOverlay>
        <BlockedCard>
          <div style={{ width: 64, height: 64, background: '#fef2f2', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle size={32} color="#ef4444" />
          </div>
          <h2>Acesso Suspenso</h2>
          <p>Sua mensalidade está pendente. Para continuar acessando os seus treinos e acompanhando o seu progresso, regularize o pagamento.</p>
          
          {pendingPayment?.paymentUrl && (
            <BlockedButton 
              className="whatsapp" 
              style={{ background: 'var(--accent)', color: '#fff', marginBottom: '15px' }}
              href={pendingPayment.paymentUrl}
              target="_blank" 
              rel="noopener noreferrer"
            >
              Pagar Online (Cartão/Pix)
            </BlockedButton>
          )}

          <PixBox>
            <label>PIX Copia e Cola (R$ {pendingAmount})</label>
            <div className="code-wrapper">
              <span className="code" style={{ marginRight: 10 }}>{pixCode}</span>
            </div>
          </PixBox>

          <BlockedButton className="copy" onClick={handleCopyPix} style={{ cursor: 'pointer' }}>
            Copiar Código PIX
          </BlockedButton>

          <BlockedButton 
            className="whatsapp" 
            href={`https://wa.me/${contactPhone}?text=${encodeURIComponent(`Olá! Gostaria de regularizar minha mensalidade no ${systemName}.`)}`}
            target="_blank" 
            rel="noopener noreferrer"
          >
            Falar no WhatsApp
          </BlockedButton>

          <BlockedButton className="logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            Sair da Conta
          </BlockedButton>
        </BlockedCard>
      </BlockedOverlay>
    );
  }

  // Monday to Sunday filter for active dashboard tab
  const now = new Date();
  const day = now.getDay();
  const weekStart = new Date(now);
  const diffToMonday = day === 0 ? -6 : 1 - day;
  weekStart.setDate(now.getDate() + diffToMonday);
  weekStart.setHours(0,0,0,0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23,59,59,999);

  const weeklyLogs = trainingHistory.filter(log => {
    const logDate = log.completedAt?.toDate ? log.completedAt.toDate() : new Date(log.completedAt);
    return logDate >= weekStart && logDate <= weekEnd;
  });

  const activeTraining = getTrainingForDate(selectedDate);
  const activeExercises = activeTraining?.exercises || [];

  return (
    <PanelContainer>
      {showDueTodayModal && paymentsDueToday.length > 0 && (
        <AlertOverlay>
          <AlertCard>
            <div style={{ width: 64, height: 64, background: '#fef3c7', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={32} color="#f59e0b" />
            </div>
            <h2>Mensalidade Vence Hoje! 📅</h2>
            <p>
              Olá, <strong>{user?.name || 'Aluno'}</strong>! Lembramos que hoje vence a sua mensalidade de <strong>R$ {Number(paymentsDueToday[0].amount).toLocaleString('pt-BR')}</strong>. 
              Para evitar interrupções no acesso, realize o pagamento via Pix copia e cola abaixo.
            </p>
            
            <PixBox>
              <label>PIX Copia e Cola</label>
              <div className="code-wrapper">
                <span className="code" style={{ marginRight: 10 }}>{settings?.pixCode || paymentsDueToday[0].pixCode}</span>
              </div>
            </PixBox>

            <BlockedButton className="copy" onClick={() => {
              navigator.clipboard.writeText(settings?.pixCode || paymentsDueToday[0].pixCode);
              toast.success("PIX Copia e Cola copiado!");
            }} style={{ cursor: 'pointer', background: 'var(--accent)' }}>
              Copiar Código PIX
            </BlockedButton>

            {paymentsDueToday[0]?.paymentUrl ? (
              <BlockedButton 
                className="whatsapp" 
                style={{ background: '#10b981', color: '#fff', marginBottom: '15px' }}
                href={paymentsDueToday[0].paymentUrl}
                target="_blank" 
                rel="noopener noreferrer"
              >
                Pagar Online (Cartão/Pix)
              </BlockedButton>
            ) : null}

            <BlockedButton 
              className="whatsapp" 
              href={`https://wa.me/${settings?.contactPhone || '5531991660594'}?text=${encodeURIComponent(`Olá! Hoje vence minha mensalidade no ${settings?.systemName || 'ATLAS PRO'} e gostaria de enviar o comprovante.`)}`}
              target="_blank" 
              rel="noopener noreferrer"
            >
              Falar no WhatsApp
            </BlockedButton>

            <BlockedButton className="logout" onClick={() => {
              sessionStorage.setItem('due_today_dismissed', 'true');
              setShowDueTodayModal(false);
            }} style={{ cursor: 'pointer', marginTop: 10 }}>
              Entrar no Sistema e Treinar
            </BlockedButton>
          </AlertCard>
        </AlertOverlay>
      )}

      <Routes>
        <Route 
          path="dashboard" 
          element={
            <DashboardTab 
              user={user}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              activeTraining={activeTraining}
              activeExercises={activeExercises}
              weeklyLogs={weeklyLogs}
              handleSelectTraining={handleSelectTraining}
              setShowTrainingList={setShowTrainingList}
              navigate={navigate}
            />
          } 
        />
        <Route 
          path="progress" 
          element={
            <ProfileTab 
              user={user}
              profileWeight={profileWeight}
              setProfileWeight={setProfileWeight}
              profileHeight={profileHeight}
              setProfileHeight={setProfileHeight}
              profileAnamnesis={profileAnamnesis}
              setProfileAnamnesis={setProfileAnamnesis}
              savingProfile={savingProfile}
              handleSaveProfile={handleSaveProfile}
            />
          } 
        />
        <Route 
          path="my-training" 
          element={
            <MyTrainingTab 
              allTrainings={allTrainings}
              currentTraining={currentTraining}
              exercises={exercises}
              loading={loading}
              selectedEx={selectedEx}
              setSelectedEx={setSelectedEx}
              completedSeries={completedSeries}
              setCompletedSeries={setCompletedSeries}
              restTimer={restTimer}
              setRestTimer={setRestTimer}
              handleSelectTraining={handleSelectTraining}
              showTrainingList={showTrainingList}
              setShowTrainingList={setShowTrainingList}
              db={db}
              user={user}
              toast={toast}
            />
          } 
        />

        <Route path="/" element={<Navigate to="dashboard" replace />} />
      </Routes>

      {userStatus === 'Ativo' && pendingPayment?.paymentUrl && (
        <FloatingPaymentPill 
          href={pendingPayment.paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="dot" />
          <span>Mensalidade em aberto: R$ {Number(pendingPayment.amount).toLocaleString('pt-BR')}</span>
          <ArrowRight className="arrow" size={14} color="var(--accent)" />
        </FloatingPaymentPill>
      )}
    </PanelContainer>
  );
};

export default StudentPanel;
