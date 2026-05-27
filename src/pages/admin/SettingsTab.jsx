import React from 'react';
import styled from 'styled-components';

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

const SettingsTab = ({
  settingsForm,
  setSettingsForm,
  handleSaveSettings
}) => {
  return (
    <>
      <SectionHeader>
        <div>
          <h1>Configurações do Sistema</h1>
          <p>Personalize o nome da plataforma, dados de pagamento (PIX) e suporte.</p>
        </div>
      </SectionHeader>
      
      <Card style={{ maxWidth: '600px', padding: '2.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 600 }}>Identidade & Whitelabel</h3>
        <InputGroup>
          <label>Nome do Sistema</label>
          <input 
            value={settingsForm.systemName} 
            onChange={e => setSettingsForm({ ...settingsForm, systemName: e.target.value.toUpperCase() })} 
            placeholder="Ex: ATLAS PRO" 
          />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
            Este nome será exibido nos cabeçalhos, barra lateral e telas do portal de alunos e treinador.
          </span>
        </InputGroup>

        <h3 style={{ margin: '2rem 0 1.5rem 0', fontSize: '1.2rem', fontWeight: 600, borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>Mensalidades e Cobrança</h3>
        <InputGroup>
          <label>PIX Copia e Cola (Padrão para alunos bloqueados)</label>
          <textarea 
            value={settingsForm.pixCode} 
            onChange={e => setSettingsForm({ ...settingsForm, pixCode: e.target.value })} 
            placeholder="Cole o código do seu PIX copia e cola aqui"
            rows={4}
            style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
            Quando um aluno for desativado por atraso, ele receberá este código PIX para realizar o pagamento.
          </span>
        </InputGroup>

        <h3 style={{ margin: '2rem 0 1.5rem 0', fontSize: '1.2rem', fontWeight: 600, borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>Integração InfinitePay</h3>
        <InputGroup>
          <label>Handle da conta InfinitePay (Usuário/Slug)</label>
          <input 
            value={settingsForm.infinitePayHandle || ''} 
            onChange={e => setSettingsForm({ ...settingsForm, infinitePayHandle: e.target.value.trim() })} 
            placeholder="Ex: teampro" 
          />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
            Insira o nome de usuário (handle) que você usa no InfinitePay. Ele será usado para gerar links de cobrança automáticos.
          </span>
        </InputGroup>

        <h3 style={{ margin: '2rem 0 1.5rem 0', fontSize: '1.2rem', fontWeight: 600, borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>Contato & Suporte</h3>
        <InputGroup>
          <label>WhatsApp de Contato (Ex: 5531991660594)</label>
          <input 
            value={settingsForm.contactPhone} 
            onChange={e => setSettingsForm({ ...settingsForm, contactPhone: e.target.value.replace(/\D/g, '') })} 
            placeholder="Ex: 5531991660594"
          />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
            Insira o número completo com DDI (55) + DDD + Telefone, sem espaços ou parênteses. Será usado para o botão "Falar com o Treinador" na tela de bloqueio do aluno.
          </span>
        </InputGroup>

        <h3 style={{ margin: '2rem 0 1.5rem 0', fontSize: '1.2rem', fontWeight: 600, borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>Paleta de Cores (Tema do Sistema)</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {[
            { name: 'Preto', color: '#000000' },
            { name: 'Vermelho', color: '#ef4444' },
            { name: 'Azul', color: '#06b6d4' },
            { name: 'Verde', color: '#10b981' },
            { name: 'Ouro', color: '#f59e0b' },
            { name: 'Roxo', color: '#8b5cf6' }
          ].map(theme => (
            <button
              key={theme.color}
              type="button"
              onClick={() => setSettingsForm({ ...settingsForm, themeColor: theme.color })}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: theme.color,
                border: settingsForm.themeColor === theme.color ? '#fff 4px solid' : '1px solid #e2e8f0',
                boxShadow: settingsForm.themeColor === theme.color ? `0 0 0 3px ${theme.color}` : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              title={theme.name}
            />
          ))}
        </div>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '1.5rem' }}>
          Selecione uma cor para personalizar os botões, detalhes e destaques de toda a interface do portal do treinador e dos alunos.
        </span>

        <ActionButton 
          style={{ width: '100%', padding: '16px', marginTop: '2rem', background: 'var(--accent)', color: '#fff', fontSize: '0.95rem' }} 
          onClick={handleSaveSettings}
        >
          Salvar Alterações
        </ActionButton>
      </Card>
    </>
  );
};

export default SettingsTab;
