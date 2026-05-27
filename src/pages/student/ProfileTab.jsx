import React from 'react';
import styled from 'styled-components';

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

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  padding-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const BiometricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const Card = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0,0,0,0.01);
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const BlockedButton = styled.button`
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
  border: none;
  background: var(--accent);
  color: #fff;
  margin-top: 10px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
  handleSaveProfile
}) => {
  const imc = profileHeight > 0 ? (profileWeight / (profileHeight * profileHeight)).toFixed(1) : 0;
  
  const getImcCategory = (val) => {
    const num = Number(val);
    if (num < 18.5) return { label: 'Abaixo do Peso', color: '#3b82f6', desc: 'Abaixo do peso ideal. Procure orientação profissional.' };
    if (num >= 18.5 && num < 25) return { label: 'Peso Saudável', color: '#10b981', desc: 'Excelente! Seu peso está na faixa ideal.' };
    if (num >= 25 && num < 30) return { label: 'Sobrepeso', color: '#f59e0b', desc: 'Atenção! Seu peso está um pouco acima do ideal.' };
    return { label: 'Obesidade', color: '#ef4444', desc: 'Cuidado! Procure orientação de saúde e exercícios constantes.' };
  };

  const imcCat = getImcCategory(imc);

  return (
    <>
      <SectionHeader>
        <h1>Meu Perfil</h1>
        <p>Seus dados corporais, anamnese e calculadora de IMC em tempo real.</p>
      </SectionHeader>

      <ProfileGrid>
        {/* Coluna 1: Dados Pessoais & Anamnese */}
        <Card>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', margin: 0 }}>Dados do Perfil</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Nome Completo</label>
            <input 
              value={user?.name || ''} 
              disabled 
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>CPF de Acesso</label>
            <input 
              value={user?.cpf || ''} 
              disabled 
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Anamnese (Observações de Saúde)</label>
            <textarea 
              value={profileAnamnesis} 
              onChange={(e) => setProfileAnamnesis(e.target.value)}
              placeholder="Insira lesões, cirurgias, medicamentos de uso contínuo, restrições ou observações físicas importantes..."
              rows={5}
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

        {/* Coluna 2: Biometria & Calculadora de IMC */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Card>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', margin: 0 }}>Medidas Corporais</h3>
            
            <BiometricsGrid>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Peso (kg)</label>
                <input 
                  type="number"
                  step="0.1"
                  value={profileWeight} 
                  onChange={(e) => setProfileWeight(e.target.value)}
                  style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 600, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Altura (m)</label>
                <input 
                  type="number"
                  step="0.01"
                  value={profileHeight} 
                  onChange={(e) => setProfileHeight(e.target.value)}
                  style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 600, outline: 'none' }}
                />
              </div>
            </BiometricsGrid>
          </Card>

          <Card style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', margin: 0, width: '100%' }}>Seu IMC</h3>
            
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: `6px solid ${imcCat.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              margin: '10px 0'
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>{imc}</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Índice</span>
            </div>

            <div>
              <span style={{
                padding: '4px 12px',
                background: imcCat.color,
                color: '#fff',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {imcCat.label}
              </span>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '12px', lineHeight: '1.5', marginHorizontal: '20px' }}>
                {imcCat.desc}
              </p>
            </div>
          </Card>
        </div>
      </ProfileGrid>
    </>
  );
};

export default ProfileTab;
