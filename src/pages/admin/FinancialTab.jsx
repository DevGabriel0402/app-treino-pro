import React from 'react';
import styled from 'styled-components';
import { DollarSign, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

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

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
    if (props.$type === 'paid') return '#ecfdf5';
    if (props.$type === 'overdue') return '#fef2f2';
    return '#f8fafc';
  }};
  color: ${props => {
    if (props.$type === 'paid') return '#10b981';
    if (props.$type === 'overdue') return '#ef4444';
    return '#64748b';
  }};
`;

const FinancialTab = ({
  payments,
  students,
  setShowAddPayment,
  togglePaymentStatus,
  deletePayment,
  getPaymentStatus
}) => {
  const totalPending = payments.filter(p => p.status === 'pending').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalReceived = payments.filter(p => p.status === 'paid').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const overdueCount = payments.filter(p => getPaymentStatus(p).type === 'overdue').length;
  const totalCount = payments.length;

  return (
    <>
      <SectionHeader>
        <div>
          <h1>Financeiro</h1>
          <p>Controle de mensalidades e cobranças.</p>
        </div>
        <ActionButton onClick={() => setShowAddPayment(true)}>
          <DollarSign size={16} /> Nova Cobrança
        </ActionButton>
      </SectionHeader>
      
      <Grid style={{ marginBottom: '3rem' }}>
        <Card>
          <StatLabel>Total Recebido</StatLabel>
          <StatValue style={{ color: '#10b981' }}>R$ {totalReceived.toLocaleString()}</StatValue>
        </Card>
        <Card>
          <StatLabel>Pendente</StatLabel>
          <StatValue style={{ color: '#64748b' }}>R$ {totalPending.toLocaleString()}</StatValue>
        </Card>
        <Card>
          <StatLabel>Taxa de Inadimplência</StatLabel>
          <StatValue>{totalCount ? ((overdueCount / totalCount) * 100).toFixed(0) : 0}%</StatValue>
        </Card>
      </Grid>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <ModernTable>
          <table>
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Valor</th>
                <th>Vencimento</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => {
                const status = getPaymentStatus(p);
                return (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.studentName}</td>
                    <td>R$ {Number(p.amount).toLocaleString()}</td>
                    <td>{new Date(p.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                    <td><StatusBadge $type={status.type}>{status.label}</StatusBadge></td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <ActionButton 
                          $outline 
                          style={{ padding: '6px 12px', fontSize: '0.7rem' }} 
                          onClick={() => togglePaymentStatus(p)}
                        >
                          {p.status === 'paid' ? 'Estornar' : 'Marcar como Pago'}
                        </ActionButton>

                        {p.status !== 'paid' && p.paymentUrl && (
                          <>
                            <ActionButton 
                              $outline 
                              style={{ padding: '6px 12px', fontSize: '0.7rem', borderColor: '#10b981', color: '#10b981' }} 
                              onClick={() => {
                                navigator.clipboard.writeText(p.paymentUrl);
                                toast.success("Link de pagamento copiado! 📋");
                              }}
                            >
                              Copiar Link
                            </ActionButton>
                            <ActionButton 
                              $outline 
                              style={{ padding: '6px 12px', fontSize: '0.7rem', borderColor: '#25d366', color: '#25d366' }} 
                              onClick={() => {
                                const text = encodeURIComponent(
                                  `Olá! Segue o link para o pagamento da sua mensalidade no valor de R$ ${Number(p.amount).toFixed(2)}: ${p.paymentUrl}`
                                );
                                const student = students?.find(s => s.id === p.studentId);
                                const cleanedPhone = student?.phone ? student.phone.replace(/\D/g, '') : '';
                                const targetPhone = (cleanedPhone.length === 10 || cleanedPhone.length === 11) ? '55' + cleanedPhone : cleanedPhone;
                                window.open(`https://api.whatsapp.com/send?phone=${targetPhone}&text=${text}`, '_blank');
                              }}
                            >
                              Enviar Whats
                            </ActionButton>
                          </>
                        )}

                        <Trash2 
                          size={16} 
                          color="#94a3b8" 
                          cursor="pointer" 
                          onClick={() => deletePayment(p.id)} 
                          style={{ display: 'flex', alignSelf: 'center' }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ModernTable>
        {payments.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
            Nenhuma cobrança registrada.
          </div>
        )}
      </Card>
    </>
  );
};

export default FinancialTab;
