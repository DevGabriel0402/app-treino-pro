import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Plus, 
  Search, 
  User, 
  Dumbbell, 
  CheckCircle2, 
  X, 
  UserPlus, 
  Loader2,
  ArrowRight,
  Phone,
  Edit2,
  ArrowLeft,
  DollarSign,
  AlertCircle,
  Download,
  Send,
  ChevronRight
} from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import TrainingPDF from '../components/TrainingPDF';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, updateDoc, limit, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { toast } from 'react-hot-toast';
import { maskCPF, maskPhone } from '../utils/masks';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Import Modular Tabs
import DashboardTab from './admin/DashboardTab';
import StudentsTab from './admin/StudentsTab';
import LibraryTab from './admin/LibraryTab';
import TrainingsTab from './admin/TrainingsTab';
import FinancialTab from './admin/FinancialTab';
import SettingsTab from './admin/SettingsTab';

const PanelContainer = styled.div`
  color: #1a1a1a;
  max-width: 1400px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0,0,0,0.01);
  transition: all 0.2s ease;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.$outline ? 'transparent' : 'var(--accent)'};
  color: ${props => props.$outline ? 'var(--accent)' : '#fff'};
  border: ${props => props.$outline ? '1px solid var(--accent)' : 'none'};
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  @media (max-width: 768px) {
    width: 100%;
    padding: 14px;
  }

  &:hover {
    opacity: 0.9;
    background: ${props => props.$outline ? 'rgba(0, 0, 0, 0.02)' : 'var(--accent)'};
  }
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 0;
    align-items: flex-end;
  }
`;

const ModalContent = styled.div`
  background: #fff;
  width: 100%;
  max-width: ${props => props.$wide ? '850px' : '500px'};
  padding: 2.5rem;
  border-radius: 24px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 20px 50px rgba(0,0,0,0.05);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    border-radius: 24px 24px 0 0;
    padding: 2rem 1.5rem;
    max-height: 95vh;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 1.5rem;
  label { font-size: 0.75rem; font-weight: 600; color: #64748b; }
  input, select, textarea {
    padding: 12px 14px;
    border: 1px solid #e2e8f0;
    background: #fff;
    border-radius: 10px;
    font-size: 0.9rem;
    outline: none;
    transition: all 0.2s;
    &:focus { border-color: #000; }
  }
`;

const AdminPanel = () => {
  const navigate = useNavigate();
  const { settings } = useSelector(state => state.auth);
  const [settingsForm, setSettingsForm] = useState({ systemName: '', pixCode: '', contactPhone: '', themeColor: '#000000', infinitePayHandle: '', infinitePayWebhookUrl: '' });

  const [exercises, setExercises] = useState([]);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [trainingCount, setTrainingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  
  const [studentTraining, setStudentTraining] = useState(null);
  const [studentLogs, setStudentLogs] = useState([]);

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        systemName: settings.systemName || '',
        pixCode: settings.pixCode || '',
        contactPhone: settings.contactPhone || '',
        themeColor: settings.themeColor || '#000000',
        infinitePayHandle: settings.infinitePayHandle || '',
        infinitePayWebhookUrl: settings.infinitePayWebhookUrl || ''
      });
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    try {
      await setDoc(doc(db, "settings", "system"), settingsForm);
      toast.success("Configurações salvas com sucesso!");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao salvar configurações.");
    }
  };
  
  const [studentForm, setStudentForm] = useState({ name: '', email: '', cpf: '', phone: '', goal: 'Hipertrofia' });
  const [newExercise, setNewExercise] = useState({ title: '', category: 'Peitoral', description: '' });
  const [paymentForm, setPaymentForm] = useState({ studentId: '', amount: '', dueDate: '', status: 'pending', infinitePayHandle: '' });
  const [exerciseGif, setExerciseGif] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [removingDuplicates, setRemovingDuplicates] = useState(false);

  // Multi-step Training State
  const [trainingStep, setTrainingStep] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [trainingExercises, setTrainingExercises] = useState([]);
  const [trainingName, setTrainingName] = useState('');
  const [editingTrainingId, setEditingTrainingId] = useState(null);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryCategoryFilter, setLibraryCategoryFilter] = useState('Todos');
  const [savedTrainingInfo, setSavedTrainingInfo] = useState(null);
  const [studentTrainings, setStudentTrainings] = useState([]);
  const [selectedTrainingForView, setSelectedTrainingForView] = useState(null);

  const muscleGroups = [
    'Antebraços', 'Bíceps', 'Cardio Academia', 'Costas', 'Eretores da espinha', 
    'Glúteos', 'Ombros', 'Panturrilhas', 'Peitoral', 'Pernas', 'Trapézio', 
    'Tríceps', 'Calistenia', 'Crossfit', 'Mobilidade e alongamento', 'Treino Funcional e HIIT'
  ];

  const filteredExercises = exercises.filter(ex => 
    (categoryFilter === 'Todos' || ex.category === categoryFilter) &&
    (ex.title.toLowerCase().includes(exerciseSearch.toLowerCase()))
  );

  const filteredLibraryExercises = exercises.filter(ex => 
    (libraryCategoryFilter === 'Todos' || ex.category === libraryCategoryFilter) &&
    (ex.title.toLowerCase().includes(librarySearch.toLowerCase()))
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Exercises
      try {
        const exSnap = await getDocs(collection(db, "exercises"));
        setExercises(exSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Erro ao carregar exercícios:", err);
      }
      
      // Fetch Users (Students)
      try {
        const stuSnap = await getDocs(collection(db, "users"));
        const studentList = stuSnap.docs
          .filter(d => d.data().role === 'student')
          .map(d => ({ id: d.id, ...d.data() }));
        setStudents(studentList);
      } catch (err) {
        console.error("Erro ao carregar alunos:", err);
      }

      // Fetch Trainings count
      try {
        const trainSnap = await getDocs(collection(db, "trainings"));
        setTrainingCount(trainSnap.size);
      } catch (err) {
        console.error("Erro ao carregar treinos:", err);
      }

      // Fetch Payments
      try {
        const paySnap = await getDocs(collection(db, "payments"));
        setPayments(paySnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Erro ao carregar pagamentos:", err);
      }
    } catch (e) { 
      console.error("Erro geral no dashboard:", e); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProfile) {
      const q = query(collection(db, "trainings"), where("userId", "==", selectedProfile.id));
      getDocs(q).then(snap => {
        if (!snap.empty) {
          const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          docs.sort((a, b) => {
            const timeA = a.createdAt?.seconds || (a.createdAt ? new Date(a.createdAt).getTime() / 1000 : 0);
            const timeB = b.createdAt?.seconds || (b.createdAt ? new Date(b.createdAt).getTime() / 1000 : 0);
            return timeB - timeA;
          });
          setStudentTrainings(docs);
        } else {
          setStudentTrainings([]);
        }
      }).catch(err => console.error(err));

      setSelectedTrainingForView(null);
    } else {
      setStudentTrainings([]);
      setSelectedTrainingForView(null);
    }
  }, [selectedProfile]);

  const handleCreateStudent = async () => {
    if (!studentForm.name || !studentForm.cpf) return toast.error('Nome e CPF obrigatórios.');
    const formattedForm = { ...studentForm, cpf: studentForm.cpf.trim() };
    try {
      if (editingStudent) {
        await updateDoc(doc(db, "users", editingStudent.id), { ...formattedForm, updatedAt: new Date() });
        toast.success('Dados atualizados!');
      } else {
        await addDoc(collection(db, "users"), { ...formattedForm, role: 'student', status: 'Ativo', createdAt: new Date() });
        toast.success('Aluno cadastrado!');
      }
      setShowAddStudent(false);
      setEditingStudent(null);
      fetchData();
    } catch (e) { toast.error('Erro ao salvar.'); }
  };

  const handleCreatePayment = async () => {
    if (!paymentForm.studentId || !paymentForm.amount || !paymentForm.dueDate) return toast.error('Preencha todos os campos.');
    try {
      const student = students.find(s => s.id === paymentForm.studentId);
      const priceInCents = Math.round(Number(paymentForm.amount) * 100);
      let paymentUrl = '';

      const activeHandle = paymentForm.infinitePayHandle || settingsForm.infinitePayHandle;

      if (activeHandle) {
        const toastId = toast.loading('Gerando link de pagamento no InfinitePay...');
        try {
          let res;
          try {
            // First try calling our Vite local proxy to bypass CORS
            res = await fetch('/api/create-infinitepay-link', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                handle: activeHandle,
                items: [{ quantity: 1, price: priceInCents, description: `Mensalidade - ${student.name}` }],
                ...(settingsForm.infinitePayWebhookUrl ? { webhook_url: settingsForm.infinitePayWebhookUrl } : {})
              })
            });
          } catch (localErr) {
            console.warn("Proxy local indisponível, tentando chamada direta...", localErr);
          }

          // If proxy returned 404 or failed, try direct browser call
          if (!res || res.status === 404) {
            res = await fetch('https://api.checkout.infinitepay.io/links', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                handle: activeHandle,
                items: [{ quantity: 1, price: priceInCents, description: `Mensalidade - ${student.name}` }],
                ...(settingsForm.infinitePayWebhookUrl ? { webhook_url: settingsForm.infinitePayWebhookUrl } : {})
              })
            });
          }

          if (res.ok) {
            const data = await res.json();
            paymentUrl = data.url || data.payment_url || data.checkout_url || '';
            toast.success('Link de pagamento gerado com sucesso!', { id: toastId });
          } else {
            console.error('Retorno inválido da API InfinitePay:', res.status);
            toast.error('Erro ao gerar link de pagamento no InfinitePay.', { id: toastId });
          }
        } catch (apiErr) {
          console.error('Erro na API InfinitePay:', apiErr);
          toast.error('Falha na comunicação com o InfinitePay.', { id: toastId });
        }
      }

      await addDoc(collection(db, "payments"), { 
        ...paymentForm, 
        studentName: student.name,
        paymentUrl: paymentUrl,
        infinitePayHandle: activeHandle || '',
        createdAt: new Date() 
      });
      toast.success(paymentUrl ? 'Cobrança gerada com link InfinitePay!' : 'Cobrança gerada!');
      setShowAddPayment(false);
      setPaymentForm({ studentId: '', amount: '', dueDate: '', status: 'pending', infinitePayHandle: '' });
      fetchData();
    } catch (e) { toast.error('Erro ao salvar cobrança.'); }
  };

  const togglePaymentStatus = async (payment) => {
    const newStatus = payment.status === 'paid' ? 'pending' : 'paid';
    try {
      await updateDoc(doc(db, "payments", payment.id), { status: newStatus });
      toast.success(newStatus === 'paid' ? 'Marcado como pago!' : 'Pagamento pendente.');
      fetchData();
    } catch (e) { toast.error('Erro ao atualizar.'); }
  };

  const deletePayment = async (id) => {
    if (!window.confirm('Excluir esta cobrança?')) return;
    try {
      await deleteDoc(doc(db, "payments", id));
      setPayments(payments.filter(p => p.id !== id));
      toast.success('Cobrança excluída.');
    } catch (e) { toast.error('Erro ao excluir.'); }
  };

  const getPaymentStatus = (payment) => {
    if (payment.status === 'paid') return { label: 'Pago', type: 'paid' };
    const today = new Date();
    const dueDate = new Date(payment.dueDate);
    if (dueDate < today.setHours(0,0,0,0)) return { label: 'Vencido', type: 'overdue' };
    return { label: 'Dentro do Prazo', type: 'pending' };
  };

  const handleEditTraining = (training) => {
    setSelectedStudent(selectedProfile || students.find(s => s.id === training.userId));
    setTrainingName(training.name || '');
    setTrainingExercises(training.exercises || []);
    setEditingTrainingId(training.id || null);
    setTrainingStep(3);
    navigate('/admin/trainings');
    setSelectedProfile(null);
  };

  const handleCreateNewTrainingForStudent = () => {
    setSelectedStudent(selectedProfile);
    setTrainingName('');
    setTrainingExercises([]);
    setEditingTrainingId(null);
    setTrainingStep(2);
    navigate('/admin/trainings');
    setSelectedProfile(null);
  };

  const updateExerciseDetail = (idx, field, value) => {
    const updated = [...trainingExercises];
    updated[idx][field] = value;
    setTrainingExercises(updated);
  };

  const handleDownloadPDF = async (info) => {
    const toastId = toast.loading('Gerando PDF...');
    try {
      const doc = (
        <TrainingPDF 
          student={info.student} 
          name={info.name} 
          exercises={info.exercises} 
          systemName={settingsForm.systemName || 'TREINO PRO'} 
          themeColor={settingsForm.themeColor || '#000000'} 
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const cleanStudentName = info.student.name.replace(/\s+/g, '_');
      const cleanTrainingName = info.name.replace(/\s+/g, '_');
      link.download = `Treino_${cleanStudentName}_${cleanTrainingName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('PDF baixado com sucesso!', { id: toastId });
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      toast.error("Erro ao gerar PDF.", { id: toastId });
    }
  };

  const handleShareWhatsApp = (info) => {
    const student = info.student;
    if (!student.phone) {
      toast.error("Aluno não possui telefone cadastrado.");
      return;
    }
    const cleanPhone = student.phone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("55") ? cleanPhone : "55" + cleanPhone;
    const systemName = settingsForm.systemName || "TREINO PRO";
    const message = `Olá, ${student.name}! Montei o seu treino "${info.name}" no ${systemName}. Você já pode acessá-lo na plataforma! Bons treinos! 💪`;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleSaveTraining = async () => {
    if (!selectedStudent || trainingExercises.length === 0 || !trainingName) return toast.error('Dados incompletos.');
    try {
      const trainingData = { 
        userId: selectedStudent.id, 
        name: trainingName,
        exercises: trainingExercises.map(ex => ({
          id: ex.id || '', title: ex.title || '', category: ex.category || '', gifUrl: ex.gifUrl || '',
          series: ex.series || '', reps: ex.reps || '', rest: ex.rest || '', isDuration: ex.isDuration || false,
          substitutes: ex.substitutes ? ex.substitutes.map(sub => ({
            id: sub.id || '', title: sub.title || '', category: sub.category || '', gifUrl: sub.gifUrl || '',
            description: sub.description || ''
          })) : []
        })), 
        updatedAt: new Date() 
      };
      if (editingTrainingId) await updateDoc(doc(db, "trainings", editingTrainingId), trainingData);
      else await addDoc(collection(db, "trainings"), { ...trainingData, createdAt: new Date() });
      toast.success(editingTrainingId ? 'Treino atualizado!' : 'Novo treino enviado!');
      
      const savedInfo = {
        student: selectedStudent,
        name: trainingName,
        exercises: [...trainingExercises]
      };

      setTrainingExercises([]); setSelectedStudent(null); setTrainingName(''); setEditingTrainingId(null); setTrainingStep(1);
      setSavedTrainingInfo(savedInfo);
      fetchData();
    } catch (e) { toast.error('Erro ao salvar.'); }
  };

  const handleFileUpload = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    try {
      setUploading(true);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      return data.secure_url;
    } catch (e) { toast.error('Erro no upload.'); return null; } finally { setUploading(false); }
  };

  const handleSaveExercise = async () => {
    if (!newExercise.title) return toast.error('Dados incompletos.');
    if (!editingExercise && !exerciseGif) return toast.error('Selecione um GIF.');
    
    let gifUrl = newExercise.gifUrl;
    if (exerciseGif) {
      const uploadedUrl = await handleFileUpload(exerciseGif);
      if (!uploadedUrl) return;
      gifUrl = uploadedUrl;
    }

    try {
      if (editingExercise) {
        await updateDoc(doc(db, "exercises", editingExercise.id), { ...newExercise, gifUrl, updatedAt: new Date() });
        toast.success('Exercício atualizado!');
      } else {
        await addDoc(collection(db, "exercises"), { ...newExercise, gifUrl, createdAt: new Date() });
        toast.success('Exercício criado!');
      }
      setShowAddExercise(false);
      setEditingExercise(null);
      setNewExercise({ title: '', category: 'Peitoral', description: '' });
      setExerciseGif(null);
      fetchData();
    } catch (e) { toast.error('Erro ao salvar.'); }
  };

  const [syncing, setSyncing] = useState(false);

  const handleSyncGifsFolder = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    console.log(`Total de arquivos selecionados: ${files.length}`);

    const cleanString = (str) => {
      return str
        ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
        : "";
    };

    const CATEGORY_RULES = [
      { category: 'Antebraços', keywords: ['antebraco', 'ante-braco'] },
      { category: 'Bíceps', keywords: ['biceps'] },
      { category: 'Cardio Academia', keywords: ['cardio', 'esteira', 'bicicleta', 'aerobico', 'corrida'] },
      { category: 'Costas', keywords: ['costas', 'dorsal', 'dorsais'] },
      { category: 'Eretores da espinha', keywords: ['eretor', 'eretores', 'espinha', 'lombar'] },
      { category: 'Glúteos', keywords: ['gluteo', 'gluteos', 'bumbum'] },
      { category: 'Ombros', keywords: ['ombro', 'ombros', 'deltoide', 'deltoides'] },
      { category: 'Panturrilhas', keywords: ['panturrilha', 'panturrilhas'] },
      { category: 'Peitoral', keywords: ['peitoral', 'peito'] },
      { category: 'Pernas', keywords: ['perna', 'pernas', 'coxa', 'quadriceps', 'posterior', 'adutor', 'abdutor', 'isquio'] },
      { category: 'Trapézio', keywords: ['trapezio'] },
      { category: 'Tríceps', keywords: ['triceps'] },
      { category: 'Calistenia', keywords: ['calistenia', 'calisthenics', 'flexao', 'barra fixa', 'paralela'] },
      { category: 'Crossfit', keywords: ['crossfit', 'wod', 'kettlebell', 'lpo'] },
      { category: 'Mobilidade e alongamento', keywords: ['mobilidade', 'alongamento', 'alongamentos', 'flexibilidade', 'espreguiçar'] },
      { category: 'Treino Funcional e HIIT', keywords: ['funcional', 'hiit', 'circuito', 'agilidade'] }
    ];

    // Filter target files and map their categories dynamically
    const targetFiles = [];
    for (const file of files) {
      if (!file.name.toLowerCase().endsWith('.gif')) continue;
      
      // Normalize Windows backslashes to standard forward slashes
      const normalizedPath = file.webkitRelativePath.replace(/\\/g, '/');
      const parts = normalizedPath.split('/').slice(0, -1); // Exclude the filename
      
      let matchedCategory = null;
      
      // 1. Try matching by directory names first
      for (const part of parts) {
        const cleanPart = cleanString(part);
        for (const rule of CATEGORY_RULES) {
          if (rule.keywords.some(kw => cleanPart.includes(kw))) {
            matchedCategory = rule.category;
            break;
          }
        }
        if (matchedCategory) break;
      }

      // 2. Fallback to matching by file name if no directory matched
      if (!matchedCategory) {
        const cleanFileName = cleanString(file.name);
        for (const rule of CATEGORY_RULES) {
          if (rule.keywords.some(kw => cleanFileName.includes(kw))) {
            matchedCategory = rule.category;
            break;
          }
        }
      }

      if (matchedCategory) {
        targetFiles.push({
          file,
          category: matchedCategory,
          title: file.name.substring(0, file.name.lastIndexOf('.')) || file.name
        });
      }
    }

    console.log(`GIFs válidos encontrados para sincronização: ${targetFiles.length}`);

    if (targetFiles.length === 0) {
      const pathsSample = files.slice(0, 3).map(f => f.webkitRelativePath || f.name).join(', ');
      toast.error(
        `Nenhum GIF correspondente foi encontrado de ${files.length} arquivos selecionados.\n` +
        `Exemplos de caminhos: [${pathsSample || 'nenhum'}].\n` +
        `Certifique-se de selecionar a pasta correta (como "Academias" ou as subpastas).`,
        { duration: 8000 }
      );
      return;
    }

    setSyncing(true);
    const toastId = toast.loading('Limpando duplicados e verificando arquivos na nuvem...');

    try {
      // 1. First remove any duplicates in Firestore
      await removeDuplicateExercises();

      // 2. Fetch fresh list of exercises
      const exSnap = await getDocs(collection(db, "exercises"));
      const currentExercises = exSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // 3. Filter targetFiles to only keep those that are NOT already in the database with a Cloudinary URL
      const filesToSync = [];
      for (const item of targetFiles) {
        const existingEx = currentExercises.find(ex => 
          ex.title.trim().toLowerCase() === item.title.trim().toLowerCase() && 
          ex.category.trim().toLowerCase() === item.category.trim().toLowerCase()
        );

        if (existingEx && existingEx.gifUrl && existingEx.gifUrl.startsWith('http')) {
          continue; // Already has a Cloudinary URL, skip it!
        }

        filesToSync.push({
          ...item,
          existingId: existingEx ? existingEx.id : null
        });
      }

      console.log(`GIFs que precisam ser sincronizados: ${filesToSync.length}`);

      if (filesToSync.length === 0) {
        toast.success('Todos os GIFs selecionados já estão sincronizados no Cloudinary! ✨', { id: toastId });
        return;
      }

      // 4. Upload only the remaining files
      let count = 0;
      for (const item of filesToSync) {
        count++;
        const { file, category, title, existingId } = item;

        toast.loading(`Sincronizando ${count}/${filesToSync.length}: "${title}" (${category})...`, { id: toastId });

        // Upload to Cloudinary using existing function
        const secureUrl = await handleFileUpload(file);
        if (!secureUrl) {
          console.error(`Erro no upload do arquivo ${file.name}`);
          continue;
        }

        const exerciseData = {
          title,
          category,
          gifUrl: secureUrl,
          description: '',
          updatedAt: new Date()
        };

        if (existingId) {
          await updateDoc(doc(db, "exercises", existingId), exerciseData);
        } else {
          await addDoc(collection(db, "exercises"), {
            ...exerciseData,
            createdAt: new Date()
          });
        }
      }

      // Automatically remove any duplicates after sync just in case
      await removeDuplicateExercises();

      toast.success(`Sincronização concluída! ${filesToSync.length} GIFs processados com sucesso. 🎉`, { id: toastId });
      fetchData(); // Refresh UI
    } catch (err) {
      console.error(err);
      toast.error('Ocorreu um erro durante a sincronização.', { id: toastId });
    } finally {
      setSyncing(false);
      e.target.value = '';
    }
  };

  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  const handleDeleteLocalGifs = async () => {
    // 1. Check database exercises pointing to local files
    const localExercises = exercises.filter(ex => 
      ex.gifUrl && (ex.gifUrl.startsWith('/exercises/') || ex.gifUrl.startsWith('exercises/'))
    );

    if (localExercises.length > 0) {
      const confirmWarning = window.confirm(
        `Atenção: existem ${localExercises.length} exercícios cadastrados que ainda apontam para arquivos locais (ex: /exercises/Academias/...).\n\n` +
        `Se você apagar os arquivos locais agora, esses exercícios ficarão com as imagens quebradas!\n` +
        `Certifique-se de clicar em "Sincronizar agora" primeiro para enviar todas as imagens ao Cloudinary.\n\n` +
        `Deseja prosseguir com a exclusão mesmo assim?`
      );
      if (!confirmWarning) return;
    }

    const confirmDelete = window.confirm(
      "Tem certeza que deseja apagar todos os GIFs locais da pasta public/exercises/Academias no seu computador?\n\n" +
      "Esta ação irá excluir os arquivos do seu disco local para economizar espaço no seu projeto. Os exercícios já sincronizados continuarão funcionando puxando direto do Cloudinary.\n\n" +
      "Esta ação não pode ser desfeita!"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch('/api/delete-local-gifs', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        // Automatically remove any duplicates after deletion
        await removeDuplicateExercises();
        toast.success("Arquivos locais excluídos com sucesso! 🚀");
        fetchData(); // Refresh UI
      } else {
        toast.error(`Erro ao excluir: ${data.message || data.error || 'Erro desconhecido'}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocorreu um erro ao tentar excluir os arquivos locais.");
    }
  };

  const removeDuplicateExercises = async () => {
    try {
      const exSnap = await getDocs(collection(db, "exercises"));
      const allExercises = exSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const groups = {};
      for (const ex of allExercises) {
        if (!ex.title || !ex.category) continue;
        const key = `${ex.title.trim().toLowerCase()}_${ex.category.trim().toLowerCase()}`;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(ex);
      }

      let deletedCount = 0;
      for (const key in groups) {
        const list = groups[key];
        if (list.length > 1) {
          list.sort((a, b) => {
            const aIsCloudinary = a.gifUrl && a.gifUrl.startsWith('http');
            const bIsCloudinary = b.gifUrl && b.gifUrl.startsWith('http');
            if (aIsCloudinary && !bIsCloudinary) return -1;
            if (!aIsCloudinary && bIsCloudinary) return 1;

            const aTime = (a.updatedAt?.seconds || a.createdAt?.seconds || 0);
            const bTime = (b.updatedAt?.seconds || b.createdAt?.seconds || 0);
            return bTime - aTime;
          });

          const toDelete = list.slice(1);
          for (const ex of toDelete) {
            await deleteDoc(doc(db, "exercises", ex.id));
            deletedCount++;
          }
        }
      }
      return deletedCount;
    } catch (err) {
      console.error("Erro ao remover duplicados:", err);
      return 0;
    }
  };

  const handleRemoveDuplicates = async () => {
    setRemovingDuplicates(true);
    const toastId = toast.loading("Buscando e removendo exercícios duplicados...");
    try {
      const deletedCount = await removeDuplicateExercises();
      if (deletedCount > 0) {
        toast.success(`Limpeza concluída! ${deletedCount} exercícios duplicados foram removidos da biblioteca. 🧹`, { id: toastId });
      } else {
        toast.success("Nenhum exercício duplicado encontrado! Sua biblioteca está limpa. ✨", { id: toastId });
      }
      fetchData();
    } catch (e) {
      console.error(e);
      toast.error("Ocorreu um erro ao tentar remover as duplicatas.", { id: toastId });
    } finally {
      setRemovingDuplicates(false);
    }
  };

  const handleAddExerciseToTraining = (ex) => {
    const isMobility = ex.category?.toLowerCase().trim() === 'mobilidade e alongamento';
    const currentIds = trainingExercises.map(item => item.id);
    
    // Find similar exercises from the same category as suggestions for substitutes
    const similar = exercises
      .filter(item => 
        item.category?.toLowerCase().trim() === ex.category?.toLowerCase().trim() && 
        item.id !== ex.id &&
        !currentIds.includes(item.id)
      )
      .slice(0, 3)
      .map(item => ({
        id: item.id || '',
        title: item.title || '',
        category: item.category || '',
        gifUrl: item.gifUrl || ''
      }));

    setTrainingExercises([...trainingExercises, { 
      ...ex, 
      series: isMobility ? '' : '3', 
      reps: isMobility ? '' : '12', 
      rest: isMobility ? '' : '60', 
      isDuration: false,
      substitutes: similar
    }]);
  };

  return (
    <PanelContainer>
      {selectedProfile && (
        <Modal>
          <ModalContent style={{ maxWidth: '650px', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a' }}>
                  {selectedTrainingForView ? `Detalhes: ${selectedTrainingForView.name}` : `Treinos de ${selectedProfile.name}`}
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 4 }}>
                  Objetivo: {selectedProfile.goal}
                </p>
              </div>
              <X onClick={() => setSelectedProfile(null)} style={{ cursor: 'pointer', color: '#94a3b8' }} size={24} />
            </div>

            {selectedTrainingForView ? (
              /* FASE 2: Visualizar Ficha Selecionada */
              <div>
                {/* Botões de ação rápidos */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: '2rem' }}>
                  <ActionButton 
                    style={{ flex: 1, gap: 8, minWidth: '140px' }} 
                    onClick={() => handleDownloadPDF({ student: selectedProfile, name: selectedTrainingForView.name, exercises: selectedTrainingForView.exercises })}
                  >
                    <Download size={16} /> Baixar PDF
                  </ActionButton>
                  
                  {selectedProfile.phone && (
                    <ActionButton 
                      $outline 
                      style={{ flex: 1, gap: 8, minWidth: '140px' }} 
                      onClick={() => handleShareWhatsApp({ student: selectedProfile, name: selectedTrainingForView.name, exercises: selectedTrainingForView.exercises })}
                    >
                      <Send size={16} /> WhatsApp
                    </ActionButton>
                  )}

                  <ActionButton 
                    $outline 
                    style={{ gap: 8 }} 
                    onClick={() => handleEditTraining(selectedTrainingForView)}
                  >
                    <Edit2 size={16} /> Editar
                  </ActionButton>

                  <ActionButton 
                    $outline 
                    style={{ borderColor: '#cbd5e1', color: '#64748b' }} 
                    onClick={() => setSelectedTrainingForView(null)}
                  >
                    Voltar
                  </ActionButton>
                </div>

                {/* Lista de exercícios do treino selecionado */}
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: '1rem' }}>
                  Exercícios ({selectedTrainingForView.exercises?.length || 0})
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '350px', overflowY: 'auto', paddingRight: 4 }}>
                  {selectedTrainingForView.exercises?.map((ex, idx) => {
                    const isMobility = ex.category?.toLowerCase().trim() === 'mobilidade e alongamento';
                    return (
                      <div 
                        key={idx} 
                        style={{ padding: 14, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                            {idx + 1}. {ex.title}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                            {ex.category}
                          </span>
                        </div>
                        
                        {isMobility ? (
                          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                            🧘 Mobilidade e Alongamento Livre
                          </span>
                        ) : (
                          <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                            {!ex.isDuration && (
                              <>
                                <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                                  Séries: <strong>{ex.series || '-'}</strong>
                                </span>
                                <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                                  Repetições: <strong>{ex.reps || '-'}</strong>
                                </span>
                              </>
                            )}
                            <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                              {ex.isDuration ? 'Duração' : 'Descanso'}: <strong>{ex.rest ? (ex.isDuration ? `${ex.rest} min` : `${ex.rest}s`) : '-'}</strong>
                            </span>
                          </div>
                        )}

                        {ex.substitutes?.length > 0 && (
                          <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid #f1f5f9' }}>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Substitutos:</span>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic', marginTop: 2 }}>
                              {ex.substitutes.map(sub => sub.title).join(', ')}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* FASE 1: Listagem de Fichas do Aluno */
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Fichas Cadastradas ({studentTrainings.length})
                  </h3>
                  <button
                    onClick={handleCreateNewTrainingForStudent}
                    style={{
                      background: 'var(--accent)',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                  >
                    + Novo Treino
                  </button>
                </div>

                {studentTrainings.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '380px', overflowY: 'auto', paddingRight: 4 }}>
                    {studentTrainings.map(t => {
                      const dateObj = t.createdAt?.toDate ? t.createdAt.toDate() : (t.createdAt ? new Date(t.createdAt) : null);
                      const formattedDate = dateObj ? dateObj.toLocaleDateString('pt-BR') : 'Sem data';
                      return (
                        <div 
                          key={t.id} 
                          onClick={() => setSelectedTrainingForView(t)}
                          style={{ 
                            padding: '1.25rem', 
                            background: '#ffffff', 
                            border: '1px solid #e2e8f0', 
                            borderRadius: '14px', 
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0f172a'; e.currentTarget.style.background = '#f8fafc'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#ffffff'; }}
                        >
                          <div>
                            <h4 style={{ fontWeight: 600, fontSize: '1rem', color: '#0f172a' }}>{t.name}</h4>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
                              {t.exercises?.length || 0} exercícios • Cadastrado em {formattedDate}
                            </p>
                          </div>
                          <ChevronRight size={18} color="#94a3b8" />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ padding: '3rem 2rem', background: '#f8fafc', borderRadius: 16, border: '1px dashed #cbd5e1', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <Dumbbell size={32} color="#94a3b8" />
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                      Este aluno ainda não possui nenhuma ficha de treino ativa.
                    </span>
                    <button
                      onClick={handleCreateNewTrainingForStudent}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--accent)',
                        color: 'var(--accent)',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginTop: 4
                      }}
                    >
                      Cadastrar Primeira Ficha
                    </button>
                  </div>
                )}
              </div>
            )}
          </ModalContent>
        </Modal>
      )}

      {showAddPayment && (
        <Modal>
          <ModalContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h2>Nova Cobrança</h2>
              <X onClick={() => setShowAddPayment(false)} cursor="pointer" color="#94a3b8" />
            </div>
            <InputGroup>
              <label>Selecionar Aluno</label>
              <select value={paymentForm.studentId} onChange={e => setPaymentForm({...paymentForm, studentId: e.target.value})}>
                <option value="">Selecione...</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </InputGroup>
            <InputGroup>
              <label>Valor (R$)</label>
              <input type="number" placeholder="Ex: 150" value={paymentForm.amount} onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})} />
            </InputGroup>
            <InputGroup>
              <label>Data de Vencimento</label>
              <input type="date" value={paymentForm.dueDate} onChange={e => setPaymentForm({...paymentForm, dueDate: e.target.value})} />
            </InputGroup>
            <InputGroup>
              <label>Handle do InfinitePay (Opcional - Sobrescreve o padrão)</label>
              <input type="text" placeholder="Ex: teampro" value={paymentForm.infinitePayHandle} onChange={e => setPaymentForm({...paymentForm, infinitePayHandle: e.target.value.trim()})} />
            </InputGroup>
            <ActionButton style={{ width: '100%', padding: '16px' }} onClick={handleCreatePayment}>Gerar Cobrança</ActionButton>
          </ModalContent>
        </Modal>
      )}

      <Routes>
        <Route 
          path="dashboard" 
          element={
            <DashboardTab 
              students={students}
              trainingCount={trainingCount}
              payments={payments}
              setShowAddStudent={setShowAddStudent}
            />
          } 
        />
        <Route 
          path="students" 
          element={
            <StudentsTab 
              students={students}
              setEditingStudent={setEditingStudent}
              setStudentForm={setStudentForm}
              setShowAddStudent={setShowAddStudent}
              setSelectedProfile={setSelectedProfile}
            />
          } 
        />
        <Route 
          path="financial" 
          element={
            <FinancialTab 
              payments={payments}
              students={students}
              setShowAddPayment={setShowAddPayment}
              togglePaymentStatus={togglePaymentStatus}
              deletePayment={deletePayment}
              getPaymentStatus={getPaymentStatus}
            />
          } 
        />
        <Route 
          path="exercises" 
          element={
            <LibraryTab 
              filteredLibraryExercises={filteredLibraryExercises}
              librarySearch={librarySearch}
              setLibrarySearch={setLibrarySearch}
              libraryCategoryFilter={libraryCategoryFilter}
              setLibraryCategoryFilter={setLibraryCategoryFilter}
              muscleGroups={muscleGroups}
              setShowAddExercise={setShowAddExercise}
              setEditingExercise={setEditingExercise}
              setNewExercise={setNewExercise}
              syncing={syncing}
              handleSyncGifsFolder={handleSyncGifsFolder}
              isLocalhost={isLocalhost}
              handleDeleteLocalGifs={handleDeleteLocalGifs}
              removingDuplicates={removingDuplicates}
              handleRemoveDuplicates={handleRemoveDuplicates}
            />
          } 
        />
        <Route 
          path="trainings" 
          element={
            <TrainingsTab 
              trainingStep={trainingStep}
              setTrainingStep={setTrainingStep}
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
              students={students}
              trainingExercises={trainingExercises}
              setTrainingExercises={setTrainingExercises}
              exerciseSearch={exerciseSearch}
              setExerciseSearch={setExerciseSearch}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              filteredExercises={filteredExercises}
              muscleGroups={muscleGroups}
              handleAddExerciseToTraining={handleAddExerciseToTraining}
              trainingName={trainingName}
              setTrainingName={setTrainingName}
              editingTrainingId={editingTrainingId}
              handleSaveTraining={handleSaveTraining}
              updateExerciseDetail={updateExerciseDetail}
              toast={toast}
              exercises={exercises}
            />
          } 
        />
        <Route 
          path="settings" 
          element={
            <SettingsTab 
              settingsForm={settingsForm}
              setSettingsForm={setSettingsForm}
              handleSaveSettings={handleSaveSettings}
            />
          } 
        />
        <Route path="/" element={<Navigate to="dashboard" replace />} />
      </Routes>

      {showAddStudent && (
        <Modal>
          <ModalContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h2>{editingStudent ? 'Editar' : 'Novo Aluno'}</h2>
              <X onClick={() => { setShowAddStudent(false); setEditingStudent(null); }} cursor="pointer" color="#94a3b8" />
            </div>
            <InputGroup>
              <label>Nome Completo</label>
              <input value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})} />
            </InputGroup>
            <InputGroup>
              <label>CPF</label>
              <input value={studentForm.cpf} onChange={e => setStudentForm({...studentForm, cpf: maskCPF(e.target.value)})} />
            </InputGroup>
            <InputGroup>
              <label>WhatsApp</label>
              <input value={studentForm.phone} onChange={e => setStudentForm({...studentForm, phone: maskPhone(e.target.value)})} />
            </InputGroup>
            <InputGroup>
              <label>Objetivo</label>
              <select value={studentForm.goal} onChange={e => setStudentForm({...studentForm, goal: e.target.value})}>
                <option>Hipertrofia</option>
                <option>Emagrecimento</option>
                <option>Definição</option>
              </select>
            </InputGroup>
            <ActionButton style={{ width: '100%', padding: '16px' }} onClick={handleCreateStudent}>
              {editingStudent ? 'Atualizar' : 'Cadastrar'}
            </ActionButton>
          </ModalContent>
        </Modal>
      )}

      {showAddExercise && (
        <Modal>
          <ModalContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h2>{editingExercise ? 'Editar Exercício' : 'Novo Exercício'}</h2>
              <X onClick={() => { setShowAddExercise(false); setEditingExercise(null); setNewExercise({ title: '', category: 'Peitoral', description: '' }); setExerciseGif(null); }} cursor="pointer" color="#94a3b8" />
            </div>
            <InputGroup>
              <label>Título</label>
              <input value={newExercise.title} onChange={e => setNewExercise({...newExercise, title: e.target.value})} />
            </InputGroup>
            <InputGroup>
              <label>Categoria</label>
              <select value={newExercise.category} onChange={e => setNewExercise({...newExercise, category: e.target.value})}>
                {muscleGroups.map(g => <option key={g}>{g}</option>)}
              </select>
            </InputGroup>
            <InputGroup>
              <label>GIF {editingExercise && '(Opcional)'}</label>
              <input type="file" accept="image/gif" onChange={e => setExerciseGif(e.target.files[0])} />
            </InputGroup>
            <ActionButton style={{ width: '100%', padding: '16px' }} onClick={handleSaveExercise} disabled={uploading}>
              {uploading ? 'Enviando...' : (editingExercise ? 'Atualizar' : 'Criar')}
            </ActionButton>
          </ModalContent>
        </Modal>
      )}
      {savedTrainingInfo && (
        <Modal>
          <ModalContent style={{ maxWidth: '420px', padding: '3rem 2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={36} color="#10b981" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Treino Montado!</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '2rem' }}>
                O treino <strong>{savedTrainingInfo.name}</strong> para o aluno <strong>{savedTrainingInfo.student.name}</strong> foi salvo e já está disponível no aplicativo!
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
                <ActionButton style={{ width: '100%', gap: 8 }} onClick={() => handleDownloadPDF(savedTrainingInfo)}>
                  <Download size={16} /> Baixar Ficha em PDF
                </ActionButton>
                
                {savedTrainingInfo.student.phone ? (
                  <ActionButton $outline style={{ width: '100%', gap: 8 }} onClick={() => handleShareWhatsApp(savedTrainingInfo)}>
                    <Send size={16} /> Enviar via WhatsApp
                  </ActionButton>
                ) : (
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', margin: '4px 0' }}>
                    Aluno sem WhatsApp cadastrado.
                  </p>
                )}
                
                <ActionButton 
                  $outline 
                  style={{ width: '100%', borderColor: '#cbd5e1', color: '#64748b', marginTop: 8 }} 
                  onClick={() => setSavedTrainingInfo(null)}
                >
                  Fechar
                </ActionButton>
              </div>
            </div>
          </ModalContent>
        </Modal>
      )}
    </PanelContainer>
  );
};

export default AdminPanel;
