import React from 'react';
import styled from 'styled-components';
import { 
  Play, 
  ChevronRight, 
  CheckCircle2, 
  ArrowLeft, 
  X, 
  Timer,
  RefreshCw,
  Dumbbell,
  TrendingUp
} from 'lucide-react';
import { collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

const SectionHeader = styled.div`
  margin-bottom: 3rem;
  h1 { font-size: 2rem; font-weight: 600; letter-spacing: -0.5px; }
  p { color: #64748b; margin-top: 6px; font-size: 0.95rem; }

  @media (max-width: 768px) {
    margin-bottom: 2rem;
    h1 { font-size: 1.5rem; }
    p { font-size: 0.85rem; }
  }
`;

const Card = styled.div`
  background: #fff;
  padding: 1.75rem;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0,0,0,0.01);
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const StartButton = styled.button`
  background: #fff;
  color: var(--accent);
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  
  &:hover { background: #f8fafc; transform: translateY(-2px); }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: #fff;
  z-index: 3000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  padding-bottom: 120px;
`;

const ModalContent = styled.div`
  max-width: 800px;
  width: 100%;
  background: #fff;
  padding: 2rem;
  position: relative;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1.5rem 1.25rem;
  }
`;

const FixedBottomTimer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #1a1a1a;
  color: #fff;
  padding: 16px 24px;
  z-index: 3100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
`;

const SpinDumbbell = styled(Dumbbell)`
  color: var(--accent);
  animation: pump 1.5s ease-in-out infinite;

  @keyframes pump {
    0%, 100% {
      transform: scale(1) rotate(0deg);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.25) rotate(180deg);
      opacity: 1;
    }
  }
`;

const MyTrainingTab = ({
  allTrainings,
  currentTraining,
  exercises,
  loading,
  selectedEx,
  setSelectedEx,
  completedSeries,
  setCompletedSeries,
  restTimer,
  setRestTimer,
  handleSelectTraining,
  showTrainingList,
  setShowTrainingList,
  db,
  user,
  toast
}) => {
  const [activeExercises, setActiveExercises] = React.useState([]);
  const [showSubstitutesList, setShowSubstitutesList] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const [lastLoads, setLastLoads] = React.useState(null);

  React.useEffect(() => {
    if (exercises) {
      setActiveExercises(exercises);
    }
  }, [exercises]);

  React.useEffect(() => {
    setShowSubstitutesList(false);
    setImageLoaded(false);
    setImageError(false);
    setLastLoads(null);

    if (!selectedEx || !user?.id) {
      return;
    }

    const fetchLastLoads = async () => {
      try {
        const q = query(
          collection(db, "trainingLogs"),
          where("userId", "==", user.id),
          orderBy("completedAt", "desc"),
          limit(15)
        );
        const snapshot = await getDocs(q);
        for (const doc of snapshot.docs) {
          const log = doc.data();
          if (log.exercisesData) {
            const exData = log.exercisesData.find(e => e.id === selectedEx.id);
            if (exData && exData.series && exData.series.length > 0) {
              setLastLoads(exData.series);
              break;
            }
          }
        }
      } catch (err) {
        console.error("Error fetching last loads:", err);
      }
    };

    fetchLastLoads();
  }, [selectedEx, user, db]);
  if (showTrainingList) {
    return (
      <>
        <SectionHeader>
          <h1>Planos de Treino</h1>
          <p>Escolha sua rotina.</p>
        </SectionHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {allTrainings.map(t => (
            <Card 
              key={t.id} 
              onClick={() => {
                handleSelectTraining(t);
                setShowTrainingList(false);
              }}
              style={{ 
                padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                border: currentTraining?.id === t.id ? '2px solid #1a1a1a' : '1px solid #f1f5f9'
              }}
            >
               <div>
                  <h3 style={{ fontWeight: 600, fontSize: '1.25rem', marginBottom: 4 }}>{t.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.exercises?.length || 0} exercícios</p>
               </div>
               <div style={{ background: '#f8fafc', padding: 12, borderRadius: 12 }}>
                 <Play size={20} color="#1a1a1a" />
               </div>
            </Card>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <SectionHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button 
            onClick={() => setShowTrainingList(true)} 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
          >
            <ArrowLeft size={24} color="#1a1a1a" />
          </button>
          <div>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{currentTraining?.name || 'Meu Plano'}</h1>
            <p style={{ margin: 0, marginTop: 4 }}>Rotina personalizada.</p>
          </div>
        </div>
      </SectionHeader>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {activeExercises.map((ex, idx) => (
          <Card 
            key={ex.id} 
            onClick={() => setSelectedEx(ex)} 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontWeight: 600, opacity: 0.2, fontSize: '1.1rem' }}>{idx+1}</span>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {ex.title}
                  {ex.category?.toLowerCase().trim() === 'mobilidade e alongamento' ? (
                    (completedSeries[ex.id]?.[0]?.checked || completedSeries[ex.id]?.[0]) && <CheckCircle2 size={16} color="#10b981" />
                  ) : ex.isDuration ? (
                    completedSeries[ex.id]?.[0] && <CheckCircle2 size={16} color="#10b981" />
                  ) : (
                    (completedSeries[ex.id]?.filter(s => s && (typeof s === 'object' ? s.checked : s)).length || 0) === parseInt(ex.series || 0) && parseInt(ex.series || 0) > 0 && (
                      <CheckCircle2 size={16} color="#10b981" />
                    )
                  )}
                </h4>
                <p style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>{ex.category}</p>
                {ex.category?.toLowerCase().trim() === 'mobilidade e alongamento' ? (
                  <p style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700, marginTop: 4 }}>
                    🧘 Alongamento & Mobilidade (Livre)
                  </p>
                ) : ex.isDuration ? (
                  <p style={{ fontSize: '0.65rem', color: '#1a1a1a', fontWeight: 700, marginTop: 4 }}>
                    Duração: {ex.rest} min
                  </p>
                ) : (
                  ex.series && (
                    <p style={{ fontSize: '0.65rem', color: '#1a1a1a', fontWeight: 700, marginTop: 4 }}>
                      {ex.series} Séries • {ex.reps} • {ex.rest}s
                    </p>
                  )
                )}
              </div>
            </div>
            <ChevronRight size={18} color="#e2e8f0" />
          </Card>
        ))}
      </div>

      {selectedEx && (
        <Modal>
          <ModalContent>
            <X 
              onClick={() => setSelectedEx(null)} 
              style={{ position: 'absolute', top: 20, right: 20, cursor: 'pointer', color: '#1a1a1a', zIndex: 10, background: 'rgba(255,255,255,0.8)', borderRadius: '50%', padding: '4px' }} 
              size={32} 
            />
            <div style={{ width: '100%', aspectRatio: '1/1', background: '#f8fafc', borderRadius: 20, overflow: 'hidden', marginBottom: 24, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}>
              {!imageLoaded && !imageError && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: '#f8fafc' }}>
                  <SpinDumbbell size={36} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', letterSpacing: 0.5 }}>CARREGANDO...</span>
                </div>
              )}
              
              {imageError && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: '#f8fafc', padding: 20, textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: '#fee2e2', color: '#ef4444', marginBottom: 8 }}>
                    <Dumbbell size={32} />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>Visualização indisponível</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: 240 }}>O GIF deste exercício não pôde ser carregado.</span>
                </div>
              )}

              {!imageError && (
                <img 
                  src={selectedEx.gifUrl} 
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    display: imageLoaded ? 'block' : 'none'
                  }} 
                  alt={selectedEx.title} 
                />
              )}
            </div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.5rem' }}>{selectedEx.title}</h2>
              <p style={{ color: '#64748b', marginTop: 4, textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600, marginBottom: 12 }}>{selectedEx.category}</p>

              {/* Botão de Substituição */}
              {selectedEx.substitutes?.length > 0 ? (
                <div style={{ marginBottom: 20 }}>
                  <button 
                    onClick={() => setShowSubstitutesList(!showSubstitutesList)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: 8, 
                      width: '100%',
                      padding: '12px', 
                      background: '#f8fafc', 
                      border: '1px solid #cbd5e1', 
                      borderRadius: '12px', 
                      color: '#1a1a1a', 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <RefreshCw size={16} /> Substituir por Exercício Alternativo
                  </button>

                  {showSubstitutesList && (
                    <div style={{ marginTop: 12, background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Alternativas configuradas:</p>
                      {(() => {
                        const availableSubs = selectedEx.substitutes.filter(sub => !activeExercises.some(ae => ae.id === sub.id));
                        if (availableSubs.length === 0) {
                          return (
                            <p style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', margin: '4px 0' }}>
                              Nenhuma alternativa de substituição disponível que já não faça parte do seu treino de hoje.
                            </p>
                          );
                        }
                        return availableSubs.map((sub, sIdx) => (
                          <div 
                            key={sIdx} 
                            onClick={() => {
                              const exIndex = activeExercises.findIndex(item => item.id === selectedEx.id);
                              if (exIndex !== -1) {
                                const updatedList = [...activeExercises];
                                updatedList[exIndex] = {
                                  ...selectedEx,
                                  id: sub.id,
                                  title: sub.title,
                                  category: sub.category,
                                  gifUrl: sub.gifUrl,
                                  description: sub.description || ''
                                };
                                setActiveExercises(updatedList);
                                setSelectedEx(updatedList[exIndex]);
                                setShowSubstitutesList(false);
                                toast.success(`Exercício substituído por "${sub.title}"! 💪`);
                              }
                            }}
                            style={{ 
                              padding: 12, 
                              background: '#fff', 
                              border: '1px solid #e2e8f0', 
                              borderRadius: 10, 
                              cursor: 'pointer', 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div>
                              <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a1a1a' }}>{sub.title}</p>
                              <p style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', marginTop: 2 }}>{sub.category}</p>
                            </div>
                            <RefreshCw size={14} color="#94a3b8" />
                          </div>
                        ));
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ marginBottom: 20 }}>
                  <button 
                    disabled
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: 8, 
                      width: '100%',
                      padding: '12px', 
                      background: '#f8fafc', 
                      border: '1px dashed #cbd5e1', 
                      borderRadius: '12px', 
                      color: '#94a3b8', 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      cursor: 'not-allowed',
                      opacity: 0.7
                    }}
                  >
                    Sem exercícios substitutos cadastrados
                  </button>
                </div>
              )}
            </div>
            
            {selectedEx.category?.toLowerCase().trim() === 'mobilidade e alongamento' ? (
              <div style={{ textAlign: 'center', padding: '14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, color: '#166534', fontSize: '0.85rem', fontWeight: 600, marginBottom: 20 }}>
                🧘 Exercício de Mobilidade / Alongamento (Livre)
              </div>
            ) : selectedEx.isDuration ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, marginBottom: 20 }}>
                <div style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: 12 }}>
                  <p style={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 700 }}>DURAÇÃO</p>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedEx.rest} min</p>
                </div>
              </div>
            ) : (
              selectedEx.series && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
                  <div style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: 12 }}>
                    <p style={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 700 }}>SÉRIES</p>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedEx.series}</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: 12 }}>
                    <p style={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 700 }}>META</p>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedEx.reps}</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: 12 }}>
                    <p style={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 700 }}>DESCANSO</p>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedEx.rest}s</p>
                  </div>
                </div>
              )
            )}

            <p style={{ color: '#64748b', lineHeight: 1.5, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {selectedEx.description || 'Foque na cadência e na amplitude total do movimento conforme o vídeo.'}
            </p>

            {/* Histórico de Cargas do Treino Anterior */}
            {lastLoads && lastLoads.length > 0 && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: 16 }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent, #2563eb)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  <TrendingUp size={14} /> Histórico de Cargas do Treino Anterior
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px 16px' }}>
                  {lastLoads.map((load, lIdx) => (
                    <div key={lIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#1e293b', fontWeight: 500 }}>
                      <span>Série {lIdx + 1}:</span>
                      <strong>{load.weight ? `${load.weight} kg` : '-'} × {load.reps ? `${load.reps} reps` : '-'}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedEx.category?.toLowerCase().trim() === 'mobilidade e alongamento' ? (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '12px', fontWeight: 600 }}>Concluir Atividade</h3>
                {(() => {
                  const entry = completedSeries[selectedEx.id]?.[0] || { checked: false, weight: '0', reps: '1' };
                  const isCompleted = entry.checked || false;
                  return (
                    <button
                      onClick={() => {
                        const newChecked = !isCompleted;
                        setCompletedSeries(prev => ({
                          ...prev,
                          [selectedEx.id]: [{ checked: newChecked, weight: '0', reps: '1' }]
                        }));
                        if (newChecked) {
                          toast.success('Exercício concluído! Muito bem! 🎉');
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '12px',
                        border: 'none',
                        background: isCompleted ? '#10b981' : '#1a1a1a',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 size={18} />
                          CONCLUÍDO ✓
                        </>
                      ) : (
                        'MARCAR COMO REALIZADO'
                      )}
                    </button>
                  );
                })()}
              </div>
            ) : !selectedEx.isDuration && selectedEx.series ? (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '12px', fontWeight: 600 }}>Controle de Séries</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Array.from({ length: parseInt(selectedEx.series) || 0 }).map((_, idx) => {
                    const seriesData = completedSeries[selectedEx.id]?.[idx] || { checked: false, weight: '', reps: '' };
                    const isCompleted = seriesData.checked || false;
                    return (
                      <div 
                        key={idx} 
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between', 
                          padding: '10px 14px', background: isCompleted ? '#f8fafc' : '#fff', 
                          border: '1px solid', borderColor: isCompleted ? '#e2e8f0' : '#cbd5e1',
                          borderRadius: '12px', transition: 'all 0.2s'
                        }}
                      >
                        <span style={{ fontWeight: 600, color: isCompleted ? '#94a3b8' : '#0f172a', fontSize: '0.85rem', minWidth: '60px' }}>
                          Série {idx + 1}
                        </span>
                        
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <input 
                            type="number"
                            placeholder="Carga (kg)"
                            value={seriesData.weight || ''}
                            disabled={isCompleted || restTimer > 0}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCompletedSeries(prev => {
                                const current = prev[selectedEx.id] || [];
                                const updated = [...current];
                                updated[idx] = { ...seriesData, weight: val };
                                return { ...prev, [selectedEx.id]: updated };
                              });
                            }}
                            style={{ 
                              width: '85px', padding: '6px 8px', border: '1px solid #cbd5e1', 
                              borderRadius: '8px', fontSize: '0.8rem', textAlign: 'center', 
                              background: isCompleted ? '#f1f5f9' : '#fff', color: '#0f172a', fontWeight: 600 
                            }}
                          />
                          <input 
                            type="number"
                            placeholder="Reps"
                            value={seriesData.reps || ''}
                            disabled={isCompleted || restTimer > 0}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCompletedSeries(prev => {
                                const current = prev[selectedEx.id] || [];
                                const updated = [...current];
                                updated[idx] = { ...seriesData, reps: val };
                                return { ...prev, [selectedEx.id]: updated };
                              });
                            }}
                            style={{ 
                              width: '70px', padding: '6px 8px', border: '1px solid #cbd5e1', 
                              borderRadius: '8px', fontSize: '0.8rem', textAlign: 'center', 
                              background: isCompleted ? '#f1f5f9' : '#fff', color: '#0f172a', fontWeight: 600 
                            }}
                          />
                        </div>

                        <input 
                          type="checkbox" 
                          checked={isCompleted}
                          disabled={isCompleted || restTimer > 0}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setCompletedSeries(prev => {
                              const current = prev[selectedEx.id] || [];
                              const updated = [...current];
                              updated[idx] = { ...seriesData, checked: checked };
                              return { ...prev, [selectedEx.id]: updated };
                            });
                            if (checked) {
                              const timeInSeconds = selectedEx.isDuration ? parseInt(selectedEx.rest) * 60 : parseInt(selectedEx.rest);
                              if (timeInSeconds) {
                                setRestTimer(timeInSeconds);
                              }
                            } else {
                              setRestTimer(0);
                            }
                          }}
                          style={{ 
                            width: '20px', 
                            height: '20px', 
                            accentColor: 'var(--accent, #000000)', 
                            cursor: (isCompleted || restTimer > 0) ? 'not-allowed' : 'pointer', 
                            opacity: (isCompleted || restTimer > 0) ? 0.5 : 1 
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {selectedEx.isDuration && selectedEx.category?.toLowerCase().trim() !== 'mobilidade e alongamento' && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '12px', fontWeight: 600 }}>Status do Exercício</h3>
                <div 
                  style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    padding: '16px 20px', background: (completedSeries[selectedEx.id]?.[0]) ? '#f8fafc' : '#fff', 
                    border: '1px solid', borderColor: (completedSeries[selectedEx.id]?.[0]) ? '#e2e8f0' : '#f1f5f9',
                    borderRadius: '12px', transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontWeight: 600, color: (completedSeries[selectedEx.id]?.[0]) ? '#94a3b8' : '#1a1a1a', fontSize: '1rem' }}>
                    Concluído
                  </span>
                  <input 
                    type="checkbox" 
                    checked={completedSeries[selectedEx.id]?.[0] || false}
                    disabled={completedSeries[selectedEx.id]?.[0] || false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setCompletedSeries(prev => ({
                        ...prev,
                        [selectedEx.id]: [checked]
                      }));
                    }}
                    style={{ 
                      width: '24px', 
                      height: '24px', 
                      accentColor: '#1a1a1a', 
                      cursor: (completedSeries[selectedEx.id]?.[0]) ? 'not-allowed' : 'pointer',
                      opacity: (completedSeries[selectedEx.id]?.[0]) ? 0.5 : 1
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{ marginTop: '2.5rem' }}>
              <StartButton 
                onClick={async () => {
                  const currentIndex = activeExercises.findIndex(e => e.id === selectedEx.id);
                  if (currentIndex < activeExercises.length - 1) {
                    setSelectedEx(activeExercises[currentIndex + 1]);
                    window.scrollTo(0, 0);
                  } else {
                    // Check if all exercises are fully completed
                    const allExercisesCompleted = activeExercises.every(ex => {
                      if (ex.category?.toLowerCase().trim() === 'mobilidade e alongamento') {
                        const entry = completedSeries[ex.id]?.[0];
                        return entry && (typeof entry === 'object' ? entry.checked : entry);
                      } else if (ex.isDuration) {
                        const entry = completedSeries[ex.id]?.[0];
                        return entry && (typeof entry === 'object' ? entry.checked : entry);
                      } else {
                        const seriesCount = parseInt(ex.series || 0);
                        if (seriesCount <= 0) return true;
                        const doneCount = completedSeries[ex.id]?.filter(s => s && (typeof s === 'object' ? s.checked : s)).length || 0;
                        return doneCount === seriesCount;
                      }
                    });

                    if (!allExercisesCompleted) {
                      toast.error('Para finalizar o treino, você precisa concluir todas as séries de todos os exercícios! 💪');
                      return;
                    }

                    const logData = {
                      userId: user.id,
                      trainingId: currentTraining.id,
                      trainingName: currentTraining.name,
                      completedAt: new Date(),
                      exercisesData: activeExercises.map(ex => {
                        const seriesList = completedSeries[ex.id] || [];
                        return {
                          id: ex.id,
                          title: ex.title,
                          series: seriesList.map(s => {
                            if (typeof s === 'object') {
                              return { checked: s.checked || false, weight: s.weight || '', reps: s.reps || '' };
                            }
                            return { checked: !!s, weight: '', reps: '' };
                          })
                        };
                      })
                    };

                    if (!navigator.onLine) {
                      // Offline: fire-and-forget log write to IndexedDB cache
                      addDoc(collection(db, "trainingLogs"), logData).catch(err => {
                        console.error("Erro ao salvar log de treino em cache offline:", err);
                      });
                      setSelectedEx(null);
                      setCompletedSeries({});
                      setShowTrainingList(true);
                      toast.success('Treino Finalizado! Gravado offline e será enviado quando houver internet. Parabéns! 🎉💪');
                      return;
                    }

                    try {
                      await addDoc(collection(db, "trainingLogs"), logData);
                      setSelectedEx(null);
                      setCompletedSeries({});
                      setShowTrainingList(true);
                      toast.success('Treino Finalizado! Parabéns! 🎉');
                    } catch (e) {
                      toast.error('Erro ao registrar treino finalizado.');
                      setSelectedEx(null);
                      setCompletedSeries({});
                      setShowTrainingList(true);
                    }
                  }
                }} 
                style={{ width: '100%', padding: '20px', background: '#1a1a1a', color: '#fff', fontSize: '1rem', display: 'flex', justifyContent: 'center' }}
              >
                {activeExercises.findIndex(e => e.id === selectedEx.id) < activeExercises.length - 1 ? 'PRÓXIMO EXERCÍCIO' : 'FINALIZAR TREINO'}
              </StartButton>
            </div>

            {restTimer > 0 && (
              <FixedBottomTimer>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Timer size={28} color="#10b981" />
                  <div>
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '1px', marginBottom: '2px' }}>DESCANSO OBRIGATÓRIO</p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '1px' }}>
                      {Math.floor(restTimer / 60).toString().padStart(2, '0')}:{(restTimer % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setRestTimer(0)} 
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={20} />
                </button>
              </FixedBottomTimer>
            )}

          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default MyTrainingTab;
