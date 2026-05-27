import React, { useRef } from 'react';
import styled from 'styled-components';
import { Plus, Search, Edit2, RefreshCw, Trash2 } from 'lucide-react';

const AnimatedRefreshCw = styled(RefreshCw)`
  animation: ${props => props.$spin ? 'spin 1.5s linear infinite' : 'none'};
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LibraryTab = ({
  filteredLibraryExercises,
  librarySearch,
  setLibrarySearch,
  libraryCategoryFilter,
  setLibraryCategoryFilter,
  muscleGroups,
  setShowAddExercise,
  setEditingExercise,
  setNewExercise,
  syncing,
  handleSyncGifsFolder,
  isLocalhost,
  handleDeleteLocalGifs,
  removingDuplicates,
  handleRemoveDuplicates
}) => {
  const fileInputRef = useRef(null);

  return (
    <>
      <SectionHeader>
        <div>
          <h1>Biblioteca ({filteredLibraryExercises.length})</h1>
          <p>Exercícios cadastrados.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', width: window.innerWidth < 768 ? '100%' : 'auto' }}>
          <input 
            type="file"
            ref={fileInputRef}
            webkitdirectory="true"
            directory="true"
            multiple
            style={{ display: 'none' }}
            onChange={handleSyncGifsFolder}
          />
          <ActionButton 
            $outline
            onClick={() => fileInputRef.current?.click()}
            disabled={syncing}
          >
            <AnimatedRefreshCw size={16} $spin={syncing} />
            {syncing ? 'Sincronizando...' : 'Sincronizar agora'}
          </ActionButton>

          {isLocalhost && (
            <ActionButton 
              $outline
              style={{ borderColor: '#ef4444', color: '#ef4444' }}
              onClick={handleDeleteLocalGifs}
              disabled={syncing}
              title="Apagar todos os GIFs locais da pasta public/exercises/Academias"
            >
              <Trash2 size={16} />
              Limpar Arquivos Locais
            </ActionButton>
          )}

          <ActionButton 
            $outline
            style={{ borderColor: '#e2e8f0', color: '#64748b' }}
            onClick={handleRemoveDuplicates}
            disabled={syncing || removingDuplicates}
            title="Procura e remove exercícios que tenham o mesmo nome e categoria na biblioteca"
          >
            <Trash2 size={16} color="#94a3b8" />
            {removingDuplicates ? 'Limpando...' : 'Remover Duplicados'}
          </ActionButton>
          
          <ActionButton onClick={() => setShowAddExercise(true)}>
            <Plus size={16} /> Novo Exercício
          </ActionButton>
        </div>
      </SectionHeader>

      <Card style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: 12, flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
            <input 
              placeholder="Buscar exercício..." 
              value={librarySearch}
              onChange={e => setLibrarySearch(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 36px', border: '1px solid #e2e8f0', borderRadius: 10, outline: 'none' }}
            />
          </div>
          <select 
            value={libraryCategoryFilter} 
            onChange={e => setLibraryCategoryFilter(e.target.value)}
            style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: 10, minWidth: '150px', outline: 'none' }}
          >
            <option>Todos</option>
            {muscleGroups.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
        {filteredLibraryExercises.map(ex => (
          <Card key={ex.id} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ width: '100%', aspectRatio: '1/1', background: '#fcfcfd', overflow: 'hidden' }}>
              <img src={ex.gifUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={ex.title} />
            </div>
            <div style={{ padding: '0.75rem', position: 'relative' }}>
              <h4 style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: 2, paddingRight: '20px' }}>{ex.title}</h4>
              <p style={{ fontSize: '0.6rem', color: '#64748b' }}>{ex.category}</p>
              <button 
                onClick={() => { setEditingExercise(ex); setNewExercise(ex); setShowAddExercise(true); }}
                style={{ position: 'absolute', right: '0.5rem', bottom: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <Edit2 size={14} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default LibraryTab;
