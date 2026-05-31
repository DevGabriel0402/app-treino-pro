import React, { useState } from 'react';
import styled from 'styled-components';
import { UserPlus, Edit2, Search, Eye, EyeOff } from 'lucide-react';

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
`;

const ModernTable = styled.div`
  width: 100%;
  overflow-x: auto;
  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
  }
  th { text-align: left; padding: 16px 20px; font-size: 0.7rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; letter-spacing: 0.5px; }
  td { padding: 20px; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; font-weight: 400; color: #334155; }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  
  input {
    width: 100%;
    padding: 12px 14px 12px 42px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.9rem;
    outline: none;
    transition: all 0.2s;
    &:focus { border-color: #000; }
  }

  .icon {
    position: absolute;
    left: 14px;
    top: 14px;
    color: #94a3b8;
  }
`;

const StudentsTab = ({
  students,
  setEditingStudent,
  setStudentForm,
  setShowAddStudent,
  setSelectedProfile,
  onToggleStatus
}) => {
  const [search, setSearch] = useState('');
  const [visibleCpfs, setVisibleCpfs] = useState({});

  const toggleCpfVisibility = (id) => {
    setVisibleCpfs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const maskSensitiveCpf = (cpf) => {
    if (!cpf) return '';
    const clean = cpf.replace(/\D/g, '');
    if (clean.length === 11) {
      return `${clean.substring(0, 3)}.***.***-${clean.substring(9, 11)}`;
    }
    return '***.***.***-**';
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.cpf.includes(search)
  );

  return (
    <>
      <SectionHeader>
        <div>
          <h1>Alunos</h1>
          <p>Gestão da sua base de atletas.</p>
        </div>
        <ActionButton onClick={() => setShowAddStudent(true)}>
          <UserPlus size={16} /> Novo Aluno
        </ActionButton>
      </SectionHeader>

      <SearchContainer>
        <Search size={18} className="icon" />
        <input 
          placeholder="Buscar aluno por nome ou CPF..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchContainer>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <ModernTable>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th className="hide-mobile">WhatsApp</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{visibleCpfs[s.id] ? s.cpf : maskSensitiveCpf(s.cpf)}</span>
                      <button 
                        onClick={() => toggleCpfVisibility(s.id)}
                        style={{ 
                          background: 'transparent', 
                          border: 'none', 
                          cursor: 'pointer', 
                          display: 'flex', 
                          alignItems: 'center', 
                          padding: 2, 
                          color: '#94a3b8' 
                        }}
                      >
                        {visibleCpfs[s.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </td>
                  <td className="hide-mobile">{s.phone || '-'}</td>
                  <td>
                    <span 
                      onClick={() => onToggleStatus && onToggleStatus(s)}
                      style={{ 
                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600,
                        background: s.status === 'Inativo' ? '#fef2f2' : '#ecfdf5',
                        color: s.status === 'Inativo' ? '#ef4444' : '#10b981',
                        textTransform: 'uppercase', letterSpacing: 0.5,
                        cursor: 'pointer'
                      }}
                      title="Clique para alterar o status do aluno"
                    >
                      {s.status || 'Ativo'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <ActionButton 
                        $outline 
                        style={{ padding: '6px', width: 'auto' }} 
                        onClick={() => { setEditingStudent(s); setStudentForm(s); setShowAddStudent(true); }}
                      >
                        <Edit2 size={14} />
                      </ActionButton>
                      <ActionButton 
                        $outline 
                        style={{ padding: '6px 12px', fontSize: '0.7rem', width: 'auto' }} 
                        onClick={() => setSelectedProfile(s)}
                      >
                        Ver
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ModernTable>
        {filteredStudents.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
            Nenhum aluno encontrado.
          </div>
        )}
      </Card>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none; }
        }
      `}</style>
    </>
  );
};

export default StudentsTab;
