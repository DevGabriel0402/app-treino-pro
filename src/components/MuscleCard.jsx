import styled from 'styled-components';

const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 1.5rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(10px);
  overflow: hidden;

  &:hover {
    transform: translateY(-10px);
    border-color: #3b82f6;
    background: rgba(30, 41, 59, 0.8);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(59, 130, 246, 0.2);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: radial-gradient(circle at center, #1e293b 0%, #020617 100%);
  border-radius: 1rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.03);
  position: relative;
  
  img {
    width: 85%;
    height: 85%;
    object-fit: contain;
    filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.2));
    transition: all 0.5s ease;
  }

  ${Card}:hover & img {
    transform: scale(1.1) rotate(2deg);
    filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.4));
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 60%, rgba(2, 6, 23, 0.8));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  ${Card}:hover &::after {
    opacity: 1;
  }
`;

const Content = styled.div`
  .category {
    font-size: 0.6rem;
    font-weight: 900;
    color: #3b82f6;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 0.25rem;
    display: block;
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 900;
    color: white;
    letter-spacing: -0.02em;
  }
`;

const Action = styled.div`
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.5) translate(20px, 20px);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.4);

  ${Card}:hover & {
    opacity: 1;
    transform: scale(1) translate(0, 0);
  }
`;

const MuscleCard = ({ muscle, onClick }) => {
  return (
    <Card onClick={onClick}>
      <ImageContainer>
        <img src={muscle.image} alt={muscle.name} />
      </ImageContainer>
      <Content>
        <span className="category">{muscle.category}</span>
        <h3>{muscle.name}</h3>
      </Content>
      <Action>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </Action>
    </Card>
  );
};

export default MuscleCard;
