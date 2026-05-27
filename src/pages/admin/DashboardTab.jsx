import React from 'react';
import styled from 'styled-components';
import { UserPlus } from 'lucide-react';

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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0,0,0,0.01);
  transition: all 0.2s ease;
  &:hover { border-color: #e2e8f0; transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const StatLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.5px;
`;

const ActionButton = styled.button`
  background: var(--accent);
  color: #fff;
  border: none;
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
  }
`;

const DashboardTab = ({ students, trainingCount, payments, setShowAddStudent }) => {
  const mrr = payments
    .filter(p => p.status === 'paid')
    .reduce((a, c) => a + Number(c.amount), 0);

  const pendingCount = payments.filter(p => p.status === 'pending').length;

  return (
    <>
      <SectionHeader>
        <div>
          <h1>Visão Geral</h1>
          <p>Resumo atualizado da sua consultoria.</p>
        </div>
        <ActionButton onClick={() => setShowAddStudent(true)}>
          <UserPlus size={16} /> Novo Aluno
        </ActionButton>
      </SectionHeader>
      
      <Grid>
        <Card>
          <StatLabel>Alunos Ativos</StatLabel>
          <StatValue>{students.length}</StatValue>
        </Card>
        <Card>
          <StatLabel>Treinos Enviados</StatLabel>
          <StatValue>{trainingCount}</StatValue>
        </Card>
        <Card>
          <StatLabel>Faturamento (Mês)</StatLabel>
          <StatValue style={{ color: '#10b981' }}>R$ {mrr.toLocaleString()}</StatValue>
        </Card>
        <Card>
          <StatLabel>Pendentes</StatLabel>
          <StatValue>{pendingCount}</StatValue>
        </Card>
      </Grid>
    </>
  );
};

export default DashboardTab;
