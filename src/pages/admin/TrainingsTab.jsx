import React from 'react';
import styled from 'styled-components';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Clock, 
  Timer,
  X
} from 'lucide-react';

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 2rem;
  }
  
  h1 { font-size: 2.25rem; font-weight: 600; letter-spacing: -0.5px; @media (max-width: 768px) { font-size: 1.75rem; } }
  p { color: #64748b; margin-top: 6px; font-size: 0.95rem; }
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
  
  &:disabled { opacity: 0.5; cursor: not-allowed; }
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

const TemplateContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 2rem;
  padding: 1.25rem 1.5rem;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  align-items: center;
  width: 100%;
  
  .title {
    font-size: 0.85rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-right: 12px;
    @media (max-width: 768px) {
      width: 100%;
      margin-bottom: 8px;
    }
  }
`;

const TemplateButton = styled.button`
  background: #fff;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  
  &:hover {
    background: #0f172a;
    color: #fff;
    border-color: #0f172a;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const TrainingsTab = ({
  trainingStep,
  setTrainingStep,
  selectedStudent,
  setSelectedStudent,
  students,
  trainingExercises,
  setTrainingExercises,
  exerciseSearch,
  setExerciseSearch,
  categoryFilter,
  setCategoryFilter,
  filteredExercises,
  muscleGroups,
  handleAddExerciseToTraining,
  trainingName,
  setTrainingName,
  editingTrainingId,
  handleSaveTraining,
  updateExerciseDetail,
  toast,
  exercises = []
}) => {
  const handleGenerateTemplate = (type) => {
    let selected = [];
    let name = '';

    const getRand = (category, count) => {
      const filtered = exercises.filter(ex => 
        (ex.category || '').trim().toLowerCase() === category.toLowerCase()
      );
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    if (type === 'upper') {
      name = 'Treino Upper (Superiores) - Modelo';
      const peitoral = getRand('Peitoral', 2);
      const costas = getRand('Costas', 2);
      const ombros = getRand('Ombros', 2);
      const biceps = getRand('Bíceps', 2);
      const triceps = getRand('Tríceps', 2);
      selected = [...peitoral, ...costas, ...ombros, ...biceps, ...triceps];
    } else if (type === 'low') {
      name = 'Treino Low (Inferiores) - Modelo';
      const pernas = getRand('Pernas', 4);
      const panturrilhas = getRand('Panturrilhas', 2);
      const gluteos = getRand('Glúteos', 2);
      selected = [...pernas, ...panturrilhas, ...gluteos];
    } else if (type === 'fullbody') {
      name = 'Treino Fullbody (Corpo Todo) - Modelo';
      const peitoral = getRand('Peitoral', 2);
      const costas = getRand('Costas', 2);
      const pernas = getRand('Pernas', 4);
      const ombros = getRand('Ombros', 2);
      const biceps = getRand('Bíceps', 2);
      const triceps = getRand('Tríceps', 2);
      const panturrilhas = getRand('Panturrilhas', 2);
      selected = [...peitoral, ...costas, ...pernas, ...ombros, ...biceps, ...triceps, ...panturrilhas];
    } else if (type === 'isolado') {
      name = 'Treino Isolado (Foco) - Modelo';
      const biceps = getRand('Bíceps', 2);
      const triceps = getRand('Tríceps', 2);
      const antebracos = getRand('Antebraços', 2);
      const panturrilhas = getRand('Panturrilhas', 2);
      selected = [...biceps, ...triceps, ...antebracos, ...panturrilhas];
    } else if (type === 'mobilidade') {
      name = 'Treino Mobilidade & Flexibilidade - Modelo';
      const mobilidade = getRand('Mobilidade e alongamento', 6);
      selected = [...mobilidade];
    }

    if (selected.length === 0) {
      toast.error('Nenhum exercício encontrado na biblioteca para gerar este modelo.');
      return;
    }

    const selectedIds = selected.map(item => item.id);
    const formatted = selected.map(ex => {
      const isMobility = ex.category?.toLowerCase().trim() === 'mobilidade e alongamento';
      const similar = exercises
        .filter(item => 
          item.category?.toLowerCase().trim() === ex.category?.toLowerCase().trim() && 
          item.id !== ex.id &&
          !selectedIds.includes(item.id)
        )
        .slice(0, 3)
        .map(item => ({
          id: item.id || '',
          title: item.title || '',
          category: item.category || '',
          gifUrl: item.gifUrl || '',
          description: item.description || ''
        }));

      return {
        ...ex,
        series: isMobility ? '' : '3',
        reps: isMobility ? '' : '12',
        rest: isMobility ? '' : '60',
        isDuration: false,
        substitutes: (ex.substitutes && ex.substitutes.length > 0) ? ex.substitutes : similar
      };
    });

    setTrainingExercises(formatted);
    setTrainingName(name);
    toast.success(`Modelo "${type.toUpperCase()}" gerado com sucesso! 🎉`);
  };
  return (
    <>
      <SectionHeader>
        <div>
          <h1>Montar Treino</h1>
          <p>Passo {trainingStep}: {trainingStep === 1 ? 'Selecionar Aluno' : trainingStep === 2 ? 'Selecionar Exercícios' : 'Finalizar'}</p>
        </div>
        <div style={{ display: 'flex', gap: 12, width: window.innerWidth < 768 ? '100%' : 'auto' }}>
          {trainingStep > 1 && (
            <ActionButton $outline onClick={() => setTrainingStep(trainingStep - 1)}>
              <ArrowLeft size={16} /> Voltar
            </ActionButton>
          )}
          {trainingStep === 1 && (
            <ActionButton 
              onClick={() => selectedStudent ? setTrainingStep(2) : toast.error('Selecione um aluno')} 
              disabled={!selectedStudent}
            >
              Próximo <ArrowRight size={16} />
            </ActionButton>
          )}
          {trainingStep === 2 && (
            <ActionButton 
              onClick={() => trainingExercises.length > 0 ? setTrainingStep(3) : toast.error('Selecione um exercício')} 
              disabled={trainingExercises.length === 0}
            >
              Revisar <ArrowRight size={16} />
            </ActionButton>
          )}
          {trainingStep === 3 && (
            <ActionButton onClick={handleSaveTraining} disabled={!trainingName}>
              {editingTrainingId ? 'Atualizar' : 'Salvar'} <CheckCircle2 size={16} />
            </ActionButton>
          )}
        </div>
      </SectionHeader>
      
      {trainingStep === 1 && (
        <Card>
          <h3 style={{ marginBottom: '1.5rem' }}>Selecione o Aluno</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {students.map(s => (
              <div 
                key={s.id} 
                onClick={() => setSelectedStudent(s)} 
                style={{ 
                  padding: 16, 
                  borderRadius: 16, 
                  border: '1px solid', 
                  borderColor: selectedStudent?.id === s.id ? '#000' : '#f1f5f9', 
                  background: selectedStudent?.id === s.id ? '#f8fafc' : '#fff', 
                  cursor: 'pointer' 
                }}
              >
                <p style={{ fontWeight: 600 }}>{s.name}</p>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.goal}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {trainingStep === 2 && (
        <>
          <TemplateContainer>
            <span className="title">Modelos Rápidos:</span>
            <TemplateButton onClick={() => handleGenerateTemplate('upper')}>💪 Upper</TemplateButton>
            <TemplateButton onClick={() => handleGenerateTemplate('low')}>🦵 Low</TemplateButton>
            <TemplateButton onClick={() => handleGenerateTemplate('fullbody')}>🏋️‍♂️ Fullbody</TemplateButton>
            <TemplateButton onClick={() => handleGenerateTemplate('isolado')}>🎯 Isolado</TemplateButton>
            <TemplateButton onClick={() => handleGenerateTemplate('mobilidade')}>🧘 Mobilidade</TemplateButton>
          </TemplateContainer>
          
          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1.2fr', gap: '2rem' }}>
          <Card>
            <div style={{ display: 'flex', gap: 12, marginBottom: '1rem', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
              <input 
                style={{ flex: 1, padding: 12, border: '1px solid #e2e8f0', borderRadius: 10, outline: 'none' }} 
                placeholder="Pesquisar..." 
                value={exerciseSearch} 
                onChange={e => setExerciseSearch(e.target.value)} 
              />
              <select 
                style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 10, outline: 'none' }} 
                value={categoryFilter} 
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option>Todos</option>
                {muscleGroups.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div style={{ height: 400, overflowY: 'auto' }}>
              {filteredExercises.map(ex => (
                <div 
                  key={ex.id} 
                  style={{ padding: 12, background: '#fcfcfd', borderRadius: 10, border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}
                >
                  <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{ex.title}</p>
                  <ActionButton $outline style={{ padding: 6, width: 'auto' }} onClick={() => handleAddExerciseToTraining(ex)}>
                    <Plus size={14} />
                  </ActionButton>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3>Rotina ({trainingExercises.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: '1rem' }}>
              {trainingExercises.map((ex, idx) => (
                <div key={idx} style={{ padding: 12, background: '#1a1a1a', color: '#fff', borderRadius: 10, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem' }}>{ex.title}</span>
                  <Trash2 size={14} onClick={() => setTrainingExercises(trainingExercises.filter((_, i) => i !== idx))} cursor="pointer" />
                </div>
              ))}
            </div>
          </Card>
        </div>
        </>
      )}
      
      {trainingStep === 3 && (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Card style={{ marginBottom: '2rem' }}>
            <InputGroup>
              <label>Nome do Treino</label>
              <input value={trainingName} onChange={e => setTrainingName(e.target.value)} />
            </InputGroup>
          </Card>
          {trainingExercises.map((ex, idx) => (
            <Card key={idx} style={{ padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h4>{ex.title}</h4>
                <Trash2 size={18} color="#ef4444" cursor="pointer" onClick={() => setTrainingExercises(trainingExercises.filter((_, i) => i !== idx))} />
              </div>
              {ex.category?.toLowerCase().trim() === 'mobilidade e alongamento' ? (
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px dashed #cbd5e1', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
                  🧘 <strong>Mobilidade e Alongamento:</strong> Este exercício é livre e não necessita de séries, repetições ou descanso.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : (ex.isDuration ? '1fr 1fr' : 'repeat(4, 1fr)'), gap: '1rem' }}>
                  {!ex.isDuration && (
                    <>
                      <InputGroup>
                        <label>Séries</label>
                        <input value={ex.series} onChange={e => updateExerciseDetail(idx, 'series', e.target.value)} />
                      </InputGroup>
                      <InputGroup>
                        <label>Reps/Peso</label>
                        <input value={ex.reps} onChange={e => updateExerciseDetail(idx, 'reps', e.target.value)} />
                      </InputGroup>
                    </>
                  )}
                  <InputGroup>
                    <label>{ex.isDuration ? 'Duração' : 'Descanso'}</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input value={ex.rest} onChange={e => updateExerciseDetail(idx, 'rest', e.target.value)} />
                      <ActionButton 
                        $outline 
                        style={{ width: 'auto' }} 
                        onClick={() => updateExerciseDetail(idx, 'isDuration', !ex.isDuration)}
                      >
                        {ex.isDuration ? <Clock size={16} /> : <Timer size={16} />}
                      </ActionButton>
                    </div>
                  </InputGroup>
                </div>
              )}

              {/* Seção de Substitutos */}
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '10px' }}>
                  Exercícios Substitutos (Opcionais)
                </label>
                
                {/* Lista de substitutos já adicionados */}
                {ex.substitutes?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                    {ex.substitutes.map((sub, sIdx) => (
                      <div 
                        key={sIdx} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 6, 
                          background: '#f8fafc', 
                          border: '1px solid #cbd5e1',
                          padding: '6px 12px', 
                          borderRadius: '12px', 
                          fontSize: '0.75rem', 
                          fontWeight: 600,
                          color: '#334155' 
                        }}
                      >
                        <span>{sub.title}</span>
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>({sub.category})</span>
                        <button 
                          type="button"
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                          onClick={() => {
                            const updatedSubs = ex.substitutes.filter((_, i) => i !== sIdx);
                            updateExerciseDetail(idx, 'substitutes', updatedSubs);
                          }}
                        >
                          <X size={12} color="#ef4444" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Dropdown de adição de substituto com busca robusta */}
                {(() => {
                  const resolvedCategory = ex.category || exercises.find(item => item.id === ex.id)?.category || '';
                  const normalizedExCategory = resolvedCategory.trim().toLowerCase();
                  
                  return (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <select 
                        style={{ flex: 1, padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: '0.9rem', outline: 'none', background: '#fff' }}
                        value=""
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          if (!selectedId) return;
                          const selectedEx = exercises.find(item => item.id === selectedId);
                          if (selectedEx) {
                            const currentSubs = ex.substitutes || [];
                            if (currentSubs.some(s => s.id === selectedId)) {
                              toast.error('Este exercício já está na lista de substitutos.');
                              return;
                            }
                            if (ex.id === selectedId) {
                              toast.error('O exercício principal não pode ser seu próprio substituto.');
                              return;
                            }
                            const updatedSubs = [...currentSubs, {
                              id: selectedEx.id,
                              title: selectedEx.title,
                              category: selectedEx.category,
                              gifUrl: selectedEx.gifUrl,
                              description: selectedEx.description || ''
                            }];
                            updateExerciseDetail(idx, 'substitutes', updatedSubs);
                            toast.success(`Substituto "${selectedEx.title}" adicionado!`);
                          }
                        }}
                      >
                        <option value="">
                          {resolvedCategory 
                            ? `+ Adicionar exercício substituto (${resolvedCategory})...` 
                            : '+ Adicionar exercício substituto...'
                          }
                        </option>
                        {exercises
                          .filter(item => {
                            const normalizedItemCategory = (item.category || '').trim().toLowerCase();
                            return item.id !== ex.id && 
                                   normalizedItemCategory === normalizedExCategory && 
                                   !trainingExercises.some(te => te.id === item.id) &&
                                   !(ex.substitutes || []).some(s => s.id === item.id);
                          })
                          .sort((a, b) => a.title.localeCompare(b.title))
                          .map(item => (
                            <option key={item.id} value={item.id}>
                              {item.title}
                            </option>
                          ))
                        }
                      </select>
                    </div>
                  );
                })()}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default TrainingsTab;
