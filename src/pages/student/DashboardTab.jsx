import React from 'react';
import styled from 'styled-components';
import { format, isSameDay, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

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

const CalendarScroll = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  justify-content: space-between;
  width: 100%;
`;

const DayBubble = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  max-width: 80px;
  padding: 16px 0;
  border-radius: 20px;
  background: ${props => props.$isToday ? 'var(--accent)' : '#fcfcfd'};
  color: ${props => props.$isToday ? '#fff' : '#64748b'};
  border: 1px solid ${props => props.$isToday ? 'var(--accent)' : '#f1f5f9'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  .day-name { font-size: 0.65rem; text-transform: uppercase; font-weight: 600; margin-bottom: 6px; }
  .day-number { font-size: 1.25rem; font-weight: 700; color: ${props => props.$isToday ? '#fff' : '#1a1a1a'}; }
`;

const TrainingBanner = styled.div`
  background: ${props => props.$completed ? '#f0fdf4' : 'var(--accent)'};
  color: ${props => props.$completed ? '#166534' : '#fff'};
  padding: 2.5rem 3rem;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  border: ${props => props.$completed ? '1px solid #bbf7d0' : 'none'};
  
  @media (max-width: 768px) { 
    flex-direction: column; 
    align-items: center; 
    text-align: center;
    gap: 20px; 
    padding: 2rem;
    margin-bottom: 2rem;
  }
  
  .info {
    p { 
      font-size: 0.7rem; 
      font-weight: 600; 
      letter-spacing: 2px; 
      color: ${props => props.$completed ? '#15803d' : 'rgba(255,255,255,0.7)'}; 
      margin-bottom: 8px; 
      text-transform: uppercase; 
    }
    h2 { 
      font-size: 1.75rem; 
      font-weight: 600; 
      color: ${props => props.$completed ? '#14532d' : '#fff'};
    }
    
    .info-meta {
      display: flex;
      gap: 16px;
      margin-top: 12px;
      justify-content: flex-start;
      
      @media (max-width: 768px) {
        justify-content: center;
      }
    }
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

const DashboardTab = ({
  user,
  selectedDate,
  setSelectedDate,
  activeTraining,
  activeExercises,
  weeklyLogs,
  handleSelectTraining,
  setShowTrainingList,
  navigate
}) => {
  const today = new Date();
  const calendarDays = Array.from({ length: 5 }).map((_, i) => subDays(addDays(today, i), 2));

  const formatDayName = (date) => {
    return format(date, 'eee', { locale: ptBR }).substring(0, 3).toUpperCase();
  };

  const completedLogToday = weeklyLogs.find(log => {
    const logDate = log.completedAt?.toDate ? log.completedAt.toDate() : new Date(log.completedAt);
    return isSameDay(logDate, selectedDate);
  });
  const isCompletedToday = !!completedLogToday;

  return (
    <>
      <SectionHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '4px' }}>
          <h1 style={{ margin: 0 }}>Olá, {user?.name?.split(' ')[0] || 'Atleta'}</h1>
          <span style={{
            padding: '4px 10px',
            background: 'var(--accent)',
            color: '#fff',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Plano Ativo: {user?.goal || 'Hipertrofia'}
          </span>
        </div>
        <p>Pronto para superar seus limites hoje?</p>
      </SectionHeader>

      <CalendarScroll>
        {calendarDays.map((date, idx) => {
          const isSelected = isSameDay(date, selectedDate);
          return (
            <DayBubble 
              key={idx} 
              $isToday={isSelected}
              onClick={() => setSelectedDate(date)}
            >
              <span className="day-name">{formatDayName(date)}</span>
              <span className="day-number">{format(date, 'd')}</span>
            </DayBubble>
          );
        })}
      </CalendarScroll>

      <TrainingBanner $completed={isCompletedToday}>
        <div className="info">
          <p>
            {isCompletedToday ? 'Treino Concluído! 🎉' : `TREINO DO DIA (${format(selectedDate, "dd/MM")})`}
          </p>
          <h2>
            {isCompletedToday 
              ? (completedLogToday.trainingName || 'Treino Concluído') 
              : (activeTraining ? (activeTraining.name || 'Treino Especial') : 'Aguardando Treino')
            }
          </h2>
          <div className="info-meta">
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isCompletedToday ? '#166534' : 'rgba(255,255,255,0.9)' }}>
              {isCompletedToday ? 'Tudo pago por hoje!' : `${activeExercises.length} Exercícios`}
            </span>
          </div>
        </div>
        {isCompletedToday ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#16a34a', color: '#fff', padding: '12px 24px', borderRadius: 12, fontWeight: 700, fontSize: '0.9rem' }}>
            CONCLUÍDO <CheckCircle2 size={20} color="#fff" />
          </div>
        ) : (
          <StartButton 
            onClick={async () => { 
              if (activeTraining) {
                await handleSelectTraining(activeTraining);
                setShowTrainingList(false); 
                navigate('/aluno/my-training'); 
              } else {
                toast.error('Nenhum treino disponível para esta data.');
              }
            }}
          >
            INICIAR <ArrowRight size={18} />
          </StartButton>
        )}
      </TrainingBanner>

      <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 700 }}>Histórico de Treinos (Esta Semana)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem' }}>
        {weeklyLogs.map(log => {
          const completedDate = log.completedAt?.toDate ? log.completedAt.toDate() : new Date();
          const weekday = format(completedDate, "eeee", { locale: ptBR });
          const weekdayCap = weekday.charAt(0).toUpperCase() + weekday.slice(1);
          const dayMonth = format(completedDate, "dd/MM");
          
          return (
            <Card 
              key={log.id} 
              style={{ 
                padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                border: '1px solid #f1f5f9'
              }}
            >
               <div>
                  <p style={{ fontWeight: 600, fontSize: '1.05rem', color: '#1e293b' }}>
                    {weekdayCap} ({dayMonth})
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, marginTop: 2 }}>
                    {log.trainingName || 'Treino Concluído'}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 4 }}>
                    {log.exercises?.length || 0} exercícios • Concluído às {format(completedDate, "HH:mm")}
                  </p>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)' }}>
                 <CheckCircle2 size={20} color="#10b981" />
               </div>
            </Card>
          );
        })}
        {weeklyLogs.length === 0 && (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8', border: '1px dashed #e2e8f0', borderRadius: 16 }}>
            Nenhum treino concluído esta semana. Vamos focar! 💪
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardTab;
