import React from "react";
import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

/* wrapper */
const Page = styled.main`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background: linear-gradient(180deg, var(--bg-900), var(--bg-800));
  overflow: hidden;
`;

/* glass card */
const Card = styled.section`
  width: 100%;
  max-width: 380px;
  padding: 36px 26px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px) saturate(1.05);
  -webkit-backdrop-filter: blur(14px) saturate(1.05);
  box-shadow: 0 8px 26px rgba(2, 6, 23, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
`;

/* logo */
const Logo = styled.div`
  display: grid;
  place-items: center;

  .mark {
    width: 54px;
    height: 54px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(var(--accent),0.2), rgba(255,255,255,0.03));
    border: 1px solid rgba(255,255,255,0.08);
    display: grid;
    place-items: center;
    font-weight: 700;
    font-size: 20px;
    color: #fff;
  }
`;

/* text */
const Title = styled.h1`
  margin: 0;
  font-size: clamp(1.6rem, 5vw, 2rem);
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 0;
  color: var(--muted);
  font-size: 0.95rem;
  max-width: 260px;
`;

/* CTA */
const CTA = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, rgba(var(--accent),0.25), rgba(var(--accent),0.15));
  color: #fff;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export default function WelcomePage() {
    const nav = useNavigate()
    const handleContinue = () =>{
        nav("/")
    }
  return (
    <>
      <Page>
        <Card>
          <Logo>
            <div className="mark">FAI</div>
          </Logo>

          <Title>Welcome</Title>
          <Subtitle>Your account is ready. Let’s begin your fashion journey.</Subtitle>

          <CTA onClick={handleContinue}>
            Continue <FiChevronRight />
          </CTA>
        </Card>
      </Page>
    </>
  );
}
