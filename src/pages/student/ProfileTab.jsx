import React from 'react';
import styled from 'styled-components';

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 480px;
  margin: 0 auto;
  padding: 1rem 0;
  
  @media (min-width: 768px) {
    max-width: 1000px;
    display: grid;
    grid-template-columns: 1fr 1.1fr;
    gap: 2.5rem;
    align-items: start;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  width: 100%;
  
  .welcome {
    span { font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    h1 { font-size: 1.75rem; font-weight: 800; color: #0f172a; margin-top: 2px; letter-spacing: -0.5px; }
  }

  .avatar-mock {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--accent, #2563eb);
  }
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.01), 0 2px 4px -1px rgba(0, 0, 0, 0.005);
`;

const BiometricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  width: 100%;
`;

const BlockedButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: var(--accent, #2563eb);
  color: #fff;
  margin-top: 8px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background: var(--accent-hover, #1d4ed8);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  }
`;

const DesktopSpacer = styled.div`
  height: 52px;
  @media (max-width: 767px) {
    display: none;
  }
`;

const ProfileTab = ({
  user,
  profileWeight,
  setProfileWeight,
  profileHeight,
  setProfileHeight,
  profileAnamnesis,
  setProfileAnamnesis,
  savingProfile,
  handleSaveProfile,
  pendingPayment,
  userStatus
}) => {
  const imc = profileHeight > 0 ? (profileWeight / (profileHeight * profileHeight)).toFixed(1) : 0;
  
  const getImcCategory = (val) => {
    const num = Number(val);
    if (num < 18.5) return { label: 'Abaixo do Peso', color: '#3b82f6', desc: 'Abaixo do peso ideal. Procure orientação profissional.' };
    if (num >= 18.5 && num < 25) return { label: 'Peso Saudável', color: '#10b981', desc: 'Excelente! Seu peso está na faixa ideal recomendada.' };
    if (num >= 25 && num < 30) return { label: 'Sobrepeso', color: '#f59e0b', desc: 'Atenção! Seu peso está um pouco acima do ideal.' };
    return { label: 'Obesidade', color: '#ef4444', desc: 'Cuidado! Procure orientação de saúde e exercícios constantes.' };
  };

  const imcCat = getImcCategory(imc);

  const formatDueDate = (dateStr) => {
    if (!dateStr) return 'Em dia';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <ProfileWrapper>
      {/* Coluna da Esquerda (Mockup Visual do Perfil) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
        <ProfileHeader>
          <div className="welcome">
            <span>MEU PERFIL</span>
            <h1>{user?.name || 'Aluno'}</h1>
          </div>
          <div className="avatar-mock">
            {(user?.name || 'A').charAt(0).toUpperCase()}
          </div>
        </ProfileHeader>

        {/* Card 1: IMC */}
        <Card style={{ textAlign: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ÍNDICE DE MASSA CORPORAL (IMC)
          </span>
          <strong style={{ fontSize: '3rem', fontWeight: 800, color: imcCat.color, display: 'block', margin: '4px 0' }}>
            {imc}
          </strong>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: imcCat.color, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
            {imcCat.label}
          </span>
          <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, margin: '8px 0 0 0' }}>
            {imcCat.desc}
          </p>
        </Card>

        {/* Card 2: Peso e Altura */}
        <BiometricsGrid>
          <Card style={{ padding: '1.25rem', textAlign: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>PESO ATUAL</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <input 
                type="number"
                step="0.1"
                value={profileWeight} 
                onChange={(e) => setProfileWeight(e.target.value)}
                style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 800, 
                  color: '#0f172a', 
                  border: 'none', 
                  borderBottom: '1px dashed #cbd5e1',
                  width: '80px', 
                  textAlign: 'center',
                  outline: 'none',
                  padding: '2px 0'
                }}
              />
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>kg</span>
            </div>
          </Card>
          
          <Card style={{ padding: '1.25rem', textAlign: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>ALTURA</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <input 
                type="number"
                step="0.01"
                value={profileHeight} 
                onChange={(e) => setProfileHeight(e.target.value)}
                style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 800, 
                  color: '#0f172a', 
                  border: 'none', 
                  borderBottom: '1px dashed #cbd5e1',
                  width: '80px', 
                  textAlign: 'center',
                  outline: 'none',
                  padding: '2px 0'
                }}
              />
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>m</span>
            </div>
          </Card>
        </BiometricsGrid>

        {/* Card 3: Dados da Assinatura */}
        <Card style={{ padding: '1.5rem', gap: '12px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            DADOS DA ASSINATURA
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: '#64748b' }}>Plano:</span>
            <strong style={{ color: '#0f172a' }}>Mensal Premium</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: '#64748b' }}>Status de Acesso:</span>
            <strong style={{ color: userStatus === 'Ativo' ? '#10b981' : '#ef4444' }}>
              {userStatus === 'Ativo' ? 'Ativo ✓' : 'Inativo ✗'}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: '#64748b' }}>Vencimento:</span>
            <strong style={{ color: '#0f172a' }}>{formatDueDate(pendingPayment?.dueDate)}</strong>
          </div>
        </Card>
      </div>

      {/* Coluna da Direita (Dados Cadastrais, Anamnese & Botão Salvar) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
        <DesktopSpacer />
        
        <Card style={{ padding: '1.5rem', gap: '14px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Dados de Cadastro & Saúde
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>CPF de Acesso</label>
            <input 
              value={user?.cpf || ''} 
              disabled 
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Anamnese (Observações de Saúde)</label>
            <textarea 
              value={profileAnamnesis || ''} 
              onChange={(e) => setProfileAnamnesis(e.target.value)}
              placeholder="Insira lesões, cirurgias, medicamentos de uso contínuo, restrições ou observações físicas importantes..."
              rows={6}
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', resize: 'vertical', lineHeight: '1.5', fontFamily: 'inherit', outline: 'none' }}
            />
          </div>

          <BlockedButton 
            onClick={handleSaveProfile}
            disabled={savingProfile}
          >
            {savingProfile ? 'Salvando...' : 'Salvar Dados de Saúde'}
          </BlockedButton>
        </Card>
      </div>
    </ProfileWrapper>
  );
};

export default ProfileTab;
