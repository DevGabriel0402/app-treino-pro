import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, query, where, getDocs, orderBy, limit, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { AlertCircle, ArrowRight, Check, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
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

const WizardOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(20px);
  z-index: 6000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow-y: auto;
  animation: fadeIn 0.4s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @media (max-width: 768px) {
    padding: 12px;
    align-items: center;
  }
`;

const WizardCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
  border-radius: 24px;
  width: 100%;
  max-width: 650px;
  padding: 2.5rem;
  max-height: 92vh;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @media (max-width: 768px) {
    padding: 1.75rem 1.25rem;
    border-radius: 20px;
    max-height: 95vh;
  }

  h2 {
    font-size: 1.75rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 0.5rem;
    letter-spacing: -0.75px;
    display: flex;
    align-items: center;
    gap: 10px;
    
    @media (max-width: 768px) {
      font-size: 1.4rem;
    }
  }

  p {
    font-size: 0.95rem;
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 1.75rem;
    
    @media (max-width: 768px) {
      font-size: 0.85rem;
      margin-bottom: 1.25rem;
    }
  }
`;

const StepTrackerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 0 10px;
  position: relative;
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  position: relative;
  cursor: ${props => props.$completed ? 'pointer' : 'default'};
`;

const StepCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${props => props.$active && `
    background: var(--accent, #000);
    color: #fff;
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.15);
    transform: scale(1.1);
  `}

  ${props => props.$completed && `
    background: #10b981;
    color: #fff;
    box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2);
  `}

  ${props => !props.$active && !props.$completed && `
    background: #f1f5f9;
    color: #94a3b8;
    border: 2px solid #e2e8f0;
  `}
`;

const StepLabel = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
  color: ${props => props.$active ? 'var(--accent, #000)' : props.$completed ? '#10b981' : '#94a3b8'};
  margin-top: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const StepLine = styled.div`
  position: absolute;
  top: 18px;
  left: 36px;
  right: 36px;
  height: 3px;
  background: #f1f5f9;
  z-index: 1;
  
  .progress {
    height: 100%;
    background: #10b981;
    width: ${props => props.$width}%;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const WizardInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 1.5rem;
  
  label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .unit {
    position: absolute;
    right: 14px;
    font-size: 0.85rem;
    font-weight: 700;
    color: #94a3b8;
    pointer-events: none;
  }

  input, select, textarea {
    width: 100%;
    padding: 14px;
    padding-right: 40px;
    border: 1.5px solid #e2e8f0;
    background: #f8fafc;
    border-radius: 12px;
    font-size: 0.95rem;
    color: #0f172a;
    outline: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:focus {
      border-color: var(--accent, #000);
      background: #fff;
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
    }
  }

  textarea {
    padding-right: 14px;
    resize: none;
  }
`;

const ImcDisplayCard = styled.div`
  background: ${props => props.$color === 'green' ? '#f0fdf4' : props.$color === 'yellow' ? '#fef3c7' : '#fef2f2'};
  border: 1px solid ${props => props.$color === 'green' ? '#bbf7d0' : props.$color === 'yellow' ? '#fde68a' : '#fca5a5'};
  border-radius: 16px;
  padding: 1.25rem;
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 16px;
  animation: fadeIn 0.3s ease-out;

  .icon-box {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: ${props => props.$color === 'green' ? '#dcfce7' : props.$color === 'yellow' ? '#fef3c7' : '#fee2e2'};
    color: ${props => props.$color === 'green' ? '#16a34a' : props.$color === 'yellow' ? '#d97706' : '#dc2626'};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .text-box {
    flex: 1;
    
    h4 {
      font-size: 0.8rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 2px 0;
    }
    
    p {
      font-size: 0.95rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      line-height: 1.2;
      
      span {
        font-weight: 800;
        color: ${props => props.$color === 'green' ? '#16a34a' : props.$color === 'yellow' ? '#d97706' : '#dc2626'};
      }
    }
  }
`;

const OptionCardGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const OptionCard = styled.button`
  flex: 1;
  padding: 1.25rem;
  border-radius: 16px;
  border: 2px solid ${props => props.$active ? 'var(--accent, #000)' : '#e2e8f0'};
  background: ${props => props.$active ? '#fafafa' : '#ffffff'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.$active ? '0 10px 15px -3px rgba(0, 0, 0, 0.05)' : 'none'};
  
  &:hover {
    transform: translateY(-2px);
    border-color: ${props => props.$active ? 'var(--accent, #000)' : '#cbd5e1'};
    background: #f8fafc;
  }

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${props => props.$active 
      ? (props.$type === 'yes' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)') 
      : '#f1f5f9'};
    color: ${props => props.$active 
      ? (props.$type === 'yes' ? '#ef4444' : '#10b981') 
      : '#64748b'};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  span {
    font-size: 1rem;
    font-weight: 700;
    color: ${props => props.$active ? '#0f172a' : '#475569'};
  }
`;

const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 2rem;
`;

const SummaryCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    transform: translateX(4px);
  }

  .info {
    h4 {
      font-size: 0.75rem;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 4px 0;
    }
    p {
      font-size: 0.9rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
      line-height: 1.4;
    }
  }

  .edit-tag {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--accent, #000);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: #cbd5e1;
    padding: 4px 8px;
    border-radius: 6px;
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
  const [globalExercises, setGlobalExercises] = useState([]);
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
  const [showAnamnesisWizard, setShowAnamnesisWizard] = useState(false);
  const [anamnesisForm, setAnamnesisForm] = useState({
    weight: '',
    height: '',
    hasInjuries: 'Não',
    injuriesDetails: '',
    hasSurgeries: 'Não',
    surgeriesDetails: '',
    hasMeds: 'Não',
    medsDetails: '',
    hasRestrictions: 'Não',
    restrictionsDetails: '',
    notes: ''
  });
  const [anamnesisStep, setAnamnesisStep] = useState(1);

  const calculateImc = () => {
    const w = parseFloat(anamnesisForm.weight);
    const h = parseFloat(anamnesisForm.height);
    if (!w || !h || h <= 0) return null;
    const imc = w / (h * h);
    
    let classification = '';
    let color = '';
    if (imc < 18.5) {
      classification = 'Abaixo do peso';
      color = 'yellow';
    } else if (imc >= 18.5 && imc < 25) {
      classification = 'Saudável (Peso Ideal)';
      color = 'green';
    } else if (imc >= 25 && imc < 30) {
      classification = 'Sobrepeso';
      color = 'yellow';
    } else {
      classification = 'Obesidade';
      color = 'red';
    }
    return { imc: imc.toFixed(2), classification, color };
  };
  const imcInfo = calculateImc();

  useEffect(() => {
    if (!user?.id) return;
    const userRef = doc(db, "users", user.id);
    const unsubscribeUser = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUserStatus(data.status || 'Ativo');
        if (data.weight !== undefined) {
          setProfileWeight(data.weight);
          setAnamnesisForm(prev => ({ ...prev, weight: data.weight }));
        }
        if (data.height !== undefined) {
          setProfileHeight(data.height);
          setAnamnesisForm(prev => ({ ...prev, height: data.height }));
        }
        if (data.anamnesis !== undefined) {
          setProfileAnamnesis(data.anamnesis);
          if (data.anamnesis && data.anamnesis.trim() !== '') {
            setShowAnamnesisWizard(false);
          } else {
            setShowAnamnesisWizard(true);
          }
        } else {
          setShowAnamnesisWizard(true);
        }
        
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

  // Fetch global exercises library to resolve latest Cloudinary URLs
  useEffect(() => {
    const unsubGlobalEx = onSnapshot(collection(db, "exercises"), (snapshot) => {
      setGlobalExercises(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      console.error("Error fetching global exercises:", error);
    });
    return () => unsubGlobalEx();
  }, []);

  // Resolve training exercises dynamically whenever currentTraining or globalExercises updates
  useEffect(() => {
    if (!currentTraining) {
      setExercises([]);
      setLoading(false);
      return;
    }
    if (!currentTraining.exercises || currentTraining.exercises.length === 0) {
      setExercises([]);
      setLoading(false);
      return;
    }

    const resolveAndSet = async () => {
      setLoading(true);
      let rawExercises = [];
      if (typeof currentTraining.exercises[0] === 'object') {
        rawExercises = currentTraining.exercises;
      } else {
        try {
          const exQ = query(collection(db, "exercises"), where("__name__", "in", currentTraining.exercises));
          const exSnapshot = await getDocs(exQ);
          rawExercises = exSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (err) {
          console.error("Error fetching referenced exercises:", err);
          rawExercises = [];
        }
      }

      const resolved = rawExercises.map(ex => {
        // Find match in globalExercises by id or case-insensitive title
        const match = globalExercises.find(g => 
          g.id === ex.id || 
          g.title.toLowerCase().trim() === ex.title.toLowerCase().trim()
        );

        // Resolve substitutes
        const resolvedSubstitutes = ex.substitutes ? ex.substitutes.map(sub => {
          const subMatch = globalExercises.find(g => 
            g.id === sub.id || 
            g.title.toLowerCase().trim() === sub.title.toLowerCase().trim()
          );
          return {
            ...sub,
            gifUrl: (subMatch?.gifUrl && subMatch.gifUrl.startsWith('http')) ? subMatch.gifUrl : sub.gifUrl
          };
        }) : [];

        return {
          ...ex,
          gifUrl: (match?.gifUrl && match.gifUrl.startsWith('http')) ? match.gifUrl : ex.gifUrl,
          substitutes: resolvedSubstitutes
        };
      });

      setExercises(resolved);
      setLoading(false);
    };

    resolveAndSet();
  }, [currentTraining, globalExercises]);

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
          setCurrentTraining(docs[0]);
        }
      } else {
        setAllTrainings([]);
        setCurrentTraining(null);
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

  const handleSaveInitialAnamnesis = async () => {
    if (!anamnesisForm.weight || !anamnesisForm.height) {
      toast.error('Por favor, preencha seu peso e altura.');
      return;
    }

    const compiledText = `Lesões/Dores Articulares: ${anamnesisForm.hasInjuries === 'Sim' ? anamnesisForm.injuriesDetails : 'Não possui'}\n` +
      `Cirurgias: ${anamnesisForm.hasSurgeries === 'Sim' ? anamnesisForm.surgeriesDetails : 'Não'}\n` +
      `Medicamentos Contínuos: ${anamnesisForm.hasMeds === 'Sim' ? anamnesisForm.medsDetails : 'Não'}\n` +
      `Restrições Físicas/Cardíacas: ${anamnesisForm.hasRestrictions === 'Sim' ? anamnesisForm.restrictionsDetails : 'Não possui'}\n` +
      `Observações: ${anamnesisForm.notes || 'Nenhuma'}`;

    try {
      setSavingProfile(true);
      const userRef = doc(db, "users", user.id);
      await setDoc(userRef, {
        weight: Number(anamnesisForm.weight),
        height: Number(anamnesisForm.height),
        anamnesis: compiledText,
        updatedAt: new Date()
      }, { merge: true });

      toast.success('Anamnese salva com sucesso! Seja bem-vindo(a) e bons treinos! 💪');
      setShowAnamnesisWizard(false);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar anamnese. Tente novamente.');
    } finally {
      setSavingProfile(false);
    }
  };

  if (userStatus === 'Inativo') {
    const pixCode = settings?.pixCode || "00020101021126580014br.gov.bcb.pix01369c3a382c-4cfc-43f1-a1e6-42bb53c65c695204000053039865406150.005802BR5913TreinoProSaaS6009BeloHoriz62070503***63041A2D";
    const contactPhone = settings?.contactPhone || "5531991660594";
    const systemName = settings?.systemName || "TREINO PRO";
    
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
              href={`https://wa.me/${settings?.contactPhone || '5531991660594'}?text=${encodeURIComponent(`Olá! Hoje vence minha mensalidade no ${settings?.systemName || 'TREINO PRO'} e gostaria de enviar o comprovante.`)}`}
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
              settings={settings}
              profileWeight={profileWeight}
              setProfileWeight={setProfileWeight}
              profileHeight={profileHeight}
              setProfileHeight={setProfileHeight}
              profileAnamnesis={profileAnamnesis}
              setProfileAnamnesis={setProfileAnamnesis}
              savingProfile={savingProfile}
              handleSaveProfile={handleSaveProfile}
              pendingPayment={pendingPayment}
              userStatus={userStatus}
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
              settings={settings}
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
      {showAnamnesisWizard && (
        <WizardOverlay>
          <WizardCard>
            <StepTrackerContainer>
              <StepLine $width={((anamnesisStep - 1) / 5) * 100} />
              {[1, 2, 3, 4, 5, 6].map((num) => {
                const isActive = anamnesisStep === num;
                const isCompleted = anamnesisStep > num;
                let label = '';
                if (num === 1) label = 'Medidas';
                else if (num === 2) label = 'Lesões';
                else if (num === 3) label = 'Cirurgias';
                else if (num === 4) label = 'Medicamentos';
                else if (num === 5) label = 'Restrições';
                else if (num === 6) label = 'Revisão';

                return (
                  <StepItem 
                    key={num} 
                    $completed={isCompleted} 
                    onClick={() => {
                      if (isCompleted || num < anamnesisStep) {
                        setAnamnesisStep(num);
                      }
                    }}
                  >
                    <StepCircle $active={isActive} $completed={isCompleted}>
                      {isCompleted ? <Check size={14} /> : num}
                    </StepCircle>
                    <StepLabel $active={isActive} $completed={isCompleted}>{label}</StepLabel>
                  </StepItem>
                );
              })}
            </StepTrackerContainer>

            {anamnesisStep === 1 && (
              <div>
                <h2>Medidas Corporais 📏</h2>
                <p>Insira seu peso e altura atuais. Esses dados são fundamentais para o cálculo de calorias e montagem do treino.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: '1.5rem' }}>
                  <WizardInputGroup style={{ marginBottom: 0 }}>
                    <label>Peso Corporal</label>
                    <div className="input-wrapper">
                      <input 
                        type="number" 
                        step="0.1" 
                        placeholder="Ex: 75.5" 
                        value={anamnesisForm.weight} 
                        onChange={e => setAnamnesisForm({...anamnesisForm, weight: e.target.value})} 
                      />
                      <span className="unit">kg</span>
                    </div>
                  </WizardInputGroup>
                  <WizardInputGroup style={{ marginBottom: 0 }}>
                    <label>Altura</label>
                    <div className="input-wrapper">
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder="Ex: 1.78" 
                        value={anamnesisForm.height} 
                        onChange={e => setAnamnesisForm({...anamnesisForm, height: e.target.value})} 
                      />
                      <span className="unit">m</span>
                    </div>
                  </WizardInputGroup>
                </div>

                {imcInfo && (
                  <ImcDisplayCard $color={imcInfo.color}>
                    <div className="icon-box">
                      <Activity size={24} />
                    </div>
                    <div className="text-box">
                      <h4>Seu IMC Estimado</h4>
                      <p>Resultado: <strong>{imcInfo.imc}</strong> • Classificação: <span>{imcInfo.classification}</span></p>
                    </div>
                  </ImcDisplayCard>
                )}
              </div>
            )}

            {anamnesisStep === 2 && (
              <div>
                <h2>Lesões & Dores Articulares 🤕</h2>
                <p>Você possui alguma lesão prévia ou sente dor articular frequente durante a prática de exercícios?</p>
                
                <OptionCardGroup>
                  <OptionCard 
                    type="button" 
                    $active={anamnesisForm.hasInjuries === 'Sim'} 
                    $type="yes"
                    onClick={() => setAnamnesisForm({...anamnesisForm, hasInjuries: 'Sim'})}
                  >
                    <div className="icon">
                      <AlertCircle size={20} />
                    </div>
                    <span>Sim, possuo</span>
                  </OptionCard>
                  
                  <OptionCard 
                    type="button" 
                    $active={anamnesisForm.hasInjuries === 'Não'} 
                    $type="no"
                    onClick={() => {
                      setAnamnesisForm({...anamnesisForm, hasInjuries: 'Não', injuriesDetails: ''});
                      setTimeout(() => setAnamnesisStep(3), 300);
                    }}
                  >
                    <div className="icon">
                      <Check size={20} />
                    </div>
                    <span>Não possuo</span>
                  </OptionCard>
                </OptionCardGroup>

                {anamnesisForm.hasInjuries === 'Sim' && (
                  <WizardInputGroup style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <label>Detalhes das lesões ou dores</label>
                    <textarea 
                      placeholder="Detalhe o local e tipo de dor (ex: dor no joelho esquerdo ao agachar, hérnia de disco na lombar...)" 
                      rows={3} 
                      value={anamnesisForm.injuriesDetails} 
                      onChange={e => setAnamnesisForm({...anamnesisForm, injuriesDetails: e.target.value})} 
                    />
                  </WizardInputGroup>
                )}
              </div>
            )}

            {anamnesisStep === 3 && (
              <div>
                <h2>Histórico de Cirurgias 🏥</h2>
                <p>Você passou por alguma cirurgia recente ou que impacte a sua mobilidade ou força física?</p>
                
                <OptionCardGroup>
                  <OptionCard 
                    type="button" 
                    $active={anamnesisForm.hasSurgeries === 'Sim'} 
                    $type="yes"
                    onClick={() => setAnamnesisForm({...anamnesisForm, hasSurgeries: 'Sim'})}
                  >
                    <div className="icon">
                      <AlertCircle size={20} />
                    </div>
                    <span>Sim, passei</span>
                  </OptionCard>
                  
                  <OptionCard 
                    type="button" 
                    $active={anamnesisForm.hasSurgeries === 'Não'} 
                    $type="no"
                    onClick={() => {
                      setAnamnesisForm({...anamnesisForm, hasSurgeries: 'Não', surgeriesDetails: ''});
                      setTimeout(() => setAnamnesisStep(4), 300);
                    }}
                  >
                    <div className="icon">
                      <Check size={20} />
                    </div>
                    <span>Não passei</span>
                  </OptionCard>
                </OptionCardGroup>

                {anamnesisForm.hasSurgeries === 'Sim' && (
                  <WizardInputGroup style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <label>Detalhes das cirurgias</label>
                    <textarea 
                      placeholder="Indique a cirurgia e há quanto tempo ocorreu (ex: artroscopia de joelho há 1 ano...)" 
                      rows={3} 
                      value={anamnesisForm.surgeriesDetails} 
                      onChange={e => setAnamnesisForm({...anamnesisForm, surgeriesDetails: e.target.value})} 
                    />
                  </WizardInputGroup>
                )}
              </div>
            )}

            {anamnesisStep === 4 && (
              <div>
                <h2>Medicamentos Contínuos 💊</h2>
                <p>Você faz uso de algum tipo de medicamento contínuo?</p>
                
                <OptionCardGroup>
                  <OptionCard 
                    type="button" 
                    $active={anamnesisForm.hasMeds === 'Sim'} 
                    $type="yes"
                    onClick={() => setAnamnesisForm({...anamnesisForm, hasMeds: 'Sim'})}
                  >
                    <div className="icon">
                      <AlertCircle size={20} />
                    </div>
                    <span>Sim, uso</span>
                  </OptionCard>
                  
                  <OptionCard 
                    type="button" 
                    $active={anamnesisForm.hasMeds === 'Não'} 
                    $type="no"
                    onClick={() => {
                      setAnamnesisForm({...anamnesisForm, hasMeds: 'Não', medsDetails: ''});
                      setTimeout(() => setAnamnesisStep(5), 300);
                    }}
                  >
                    <div className="icon">
                      <Check size={20} />
                    </div>
                    <span>Não uso</span>
                  </OptionCard>
                </OptionCardGroup>

                {anamnesisForm.hasMeds === 'Sim' && (
                  <WizardInputGroup style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <label>Medicamentos contínuos</label>
                    <textarea 
                      placeholder="Liste os medicamentos de uso frequente..." 
                      rows={3} 
                      value={anamnesisForm.medsDetails} 
                      onChange={e => setAnamnesisForm({...anamnesisForm, medsDetails: e.target.value})} 
                    />
                  </WizardInputGroup>
                )}
              </div>
            )}

            {anamnesisStep === 5 && (
              <div>
                <h2>Restrições & Observações 🏃‍♂️</h2>
                <p>Você possui alguma restrição física ou problema cardíaco (como hipertensão)? Insira também outras observações importantes.</p>
                
                <OptionCardGroup>
                  <OptionCard 
                    type="button" 
                    $active={anamnesisForm.hasRestrictions === 'Sim'} 
                    $type="yes"
                    onClick={() => setAnamnesisForm({...anamnesisForm, hasRestrictions: 'Sim'})}
                  >
                    <div className="icon">
                      <AlertCircle size={20} />
                    </div>
                    <span>Sim, possuo</span>
                  </OptionCard>
                  
                  <OptionCard 
                    type="button" 
                    $active={anamnesisForm.hasRestrictions === 'Não'} 
                    $type="no"
                    onClick={() => {
                      setAnamnesisForm({...anamnesisForm, hasRestrictions: 'Não', restrictionsDetails: ''});
                      setTimeout(() => setAnamnesisStep(6), 300);
                    }}
                  >
                    <div className="icon">
                      <Check size={20} />
                    </div>
                    <span>Não possuo</span>
                  </OptionCard>
                </OptionCardGroup>

                {anamnesisForm.hasRestrictions === 'Sim' && (
                  <WizardInputGroup style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <label>Detalhes das restrições ou problemas cardíacos</label>
                    <textarea 
                      placeholder="Ex: pressão alta controlada, labirintite recorrente, asma..." 
                      rows={2} 
                      value={anamnesisForm.restrictionsDetails} 
                      onChange={e => setAnamnesisForm({...anamnesisForm, restrictionsDetails: e.target.value})} 
                    />
                  </WizardInputGroup>
                )}

                <WizardInputGroup>
                  <label>Outras observações para o seu treinador (Opcional)</label>
                  <textarea 
                    placeholder="Insira qualquer detalhe extra sobre sua rotina, dobras ou objetivos que o treinador precise saber..." 
                    rows={2} 
                    value={anamnesisForm.notes} 
                    onChange={e => setAnamnesisForm({...anamnesisForm, notes: e.target.value})} 
                  />
                </WizardInputGroup>
              </div>
            )}

            {anamnesisStep === 6 && (
              <div>
                <h2>Revisão e Confirmação 📋</h2>
                <p>Verifique se os dados abaixo estão corretos antes de salvar sua anamnese inicial.</p>
                
                <SummaryContainer>
                  <SummaryCard onClick={() => setAnamnesisStep(1)}>
                    <div className="info">
                      <h4>Medidas & IMC</h4>
                      <p>Peso: {anamnesisForm.weight} kg • Altura: {anamnesisForm.height} m {imcInfo ? `• IMC: ${imcInfo.imc} (${imcInfo.classification})` : ''}</p>
                    </div>
                    <span className="edit-tag">Editar</span>
                  </SummaryCard>

                  <SummaryCard onClick={() => setAnamnesisStep(2)}>
                    <div className="info">
                      <h4>Lesões & Dores Articulares</h4>
                      <p>{anamnesisForm.hasInjuries === 'Sim' ? `Sim: ${anamnesisForm.injuriesDetails}` : 'Não possui nenhuma lesão'}</p>
                    </div>
                    <span className="edit-tag">Editar</span>
                  </SummaryCard>

                  <SummaryCard onClick={() => setAnamnesisStep(3)}>
                    <div className="info">
                      <h4>Histórico de Cirurgias</h4>
                      <p>{anamnesisForm.hasSurgeries === 'Sim' ? `Sim: ${anamnesisForm.surgeriesDetails}` : 'Nenhuma cirurgia relatada'}</p>
                    </div>
                    <span className="edit-tag">Editar</span>
                  </SummaryCard>

                  <SummaryCard onClick={() => setAnamnesisStep(4)}>
                    <div className="info">
                      <h4>Medicamentos Contínuos</h4>
                      <p>{anamnesisForm.hasMeds === 'Sim' ? `Sim: ${anamnesisForm.medsDetails}` : 'Não faz uso de remédios contínuos'}</p>
                    </div>
                    <span className="edit-tag">Editar</span>
                  </SummaryCard>

                  <SummaryCard onClick={() => setAnamnesisStep(5)}>
                    <div className="info">
                      <h4>Restrições & Observações</h4>
                      <p>Restrições: {anamnesisForm.hasRestrictions === 'Sim' ? anamnesisForm.restrictionsDetails : 'Nenhuma'}</p>
                      {anamnesisForm.notes && <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Obs: {anamnesisForm.notes}</p>}
                    </div>
                    <span className="edit-tag">Editar</span>
                  </SummaryCard>
                </SummaryContainer>
              </div>
            )}

            {/* Controle de navegação dos passos */}
            <div style={{ display: 'flex', gap: 12, marginTop: '1rem' }}>
              {anamnesisStep > 1 && (
                <button
                  type="button"
                  onClick={() => setAnamnesisStep(prev => prev - 1)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1.5px solid #e2e8f0',
                    background: 'transparent',
                    color: '#64748b',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#334155'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                >
                  <ChevronLeft size={16} /> Voltar
                </button>
              )}

              {anamnesisStep < 6 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (anamnesisStep === 1) {
                      if (!anamnesisForm.weight || !anamnesisForm.height) {
                        toast.error('Preencha peso e altura antes de avançar.');
                        return;
                      }
                    }
                    if (anamnesisStep === 2 && anamnesisForm.hasInjuries === 'Sim' && !anamnesisForm.injuriesDetails) {
                      toast.error('Descreva os detalhes da sua lesão ou dor.');
                      return;
                    }
                    if (anamnesisStep === 3 && anamnesisForm.hasSurgeries === 'Sim' && !anamnesisForm.surgeriesDetails) {
                      toast.error('Descreva os detalhes da sua cirurgia.');
                      return;
                    }
                    if (anamnesisStep === 4 && anamnesisForm.hasMeds === 'Sim' && !anamnesisForm.medsDetails) {
                      toast.error('Liste os seus medicamentos contínuos.');
                      return;
                    }
                    setAnamnesisStep(prev => prev + 1);
                  }}
                  style={{
                    flex: 2,
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'var(--accent, #000)',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  Avançar <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    if (anamnesisForm.hasRestrictions === 'Sim' && !anamnesisForm.restrictionsDetails) {
                      toast.error('Descreva as restrições físicas ou cardíacas.');
                      return;
                    }
                    await handleSaveInitialAnamnesis();
                  }}
                  disabled={savingProfile}
                  style={{
                    flex: 2,
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#10b981',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  {savingProfile ? 'Salvando...' : 'Salvar e Concluir'}
                </button>
              )}
            </div>
          </WizardCard>
        </WizardOverlay>
      )}
    </PanelContainer>
  );
};

export default StudentPanel;
