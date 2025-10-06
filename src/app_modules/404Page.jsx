import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components'; // <-- Added keyframes import

// Fade-in animation for the page
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(24px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
  animation: ${fadeIn} 1s ease-out forwards;
`;

const Content = styled.div`
  text-align: center;
  max-width: 620px;
  width: 100%;
  animation: ${fadeIn} 1s ease-out forwards;
  opacity: 0;
`;

const Title = styled.h1`
  font-size: clamp(3rem, 6vw, 4rem);
  font-weight: 600;
  letter-spacing: -1px;
  color: #fff;
  background: linear-gradient(120deg, #ffffff, #d4d4d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: clamp(1.2rem, 2.5vw, 1.4rem);
  color: #a0a0a5;
  line-height: 1.6;
  max-width: 90%;
  margin: 0 auto 42px auto;
`;

const Button = styled.button`
  padding: 15px 34px;
  font-size: 1.05rem;
  background: #1c1c21;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.15px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.3);

  &:hover {
    background: #27272d;
    transform: translateY(-1px);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45);
  }

  &:active {
    transform: scale(0.98);
    background: #141418;
  }
`;

const NotFoundPage = () => {
  const nav = useNavigate();

  return (
    <Wrapper>
      <Content>
        <Title>Oops, Page Not Found</Title>
        <Subtitle>
          Looks like you've wandered off the path.  
          Let's get you back to where you belong.
        </Subtitle>
        <Button onClick={() => nav('/')}>
          Go Back Home
        </Button>
      </Content>
    </Wrapper>
  );
};

export default NotFoundPage;
