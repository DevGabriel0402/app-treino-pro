import styled from 'styled-components';

const Container = styled.div`
  background: rgba(59, 130, 246, 0.05);
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(59, 130, 246, 0.3);
    background: rgba(59, 130, 246, 0.08);
  }
`;

const Title = styled.h4`
  font-size: 0.85rem;
  font-weight: 800;
  color: #60a5fa;
  margin-bottom: 0.25rem;
`;

const Tip = styled.p`
  font-size: 0.65rem;
  color: #94a3b8;
  font-style: italic;
  line-height: 1.2;
`;

const GifContainer = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ExerciseCard = ({ exercise }) => {
  return (
    <Container style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      {exercise.gif && (
        <GifContainer>
          <img src={exercise.gif} alt={exercise.name} />
        </GifContainer>
      )}
      <div style={{ flexGrow: 1 }}>
        <Title>{exercise.name}</Title>
        <Tip>{exercise.tip}</Tip>
      </div>
    </Container>
  );
};

export default ExerciseCard;
