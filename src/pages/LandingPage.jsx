import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Dumbbell, 
  Check, 
  ArrowRight, 
  Shield, 
  Award, 
  Users, 
  Zap, 
  Smartphone, 
  Sparkles, 
  MessageSquare,
  TrendingUp,
  Clock,
  Star,
  X,
  Target
} from 'lucide-react';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.05; transform: scale(1); }
  50% { opacity: 0.12; transform: scale(1.05); }
`;

const pulseDot = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.4; }
`;

const PulseDot = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  z-index: 10;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #ef4444;
    animation: ${pulseDot} 2s infinite ease-in-out;
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  color: #0f172a;
  font-family: 'Outfit', 'Inter', sans-serif;
  overflow-x: hidden;
  position: relative;
`;

const DecorativeBlob = styled.div`
  position: absolute;
  width: ${props => props.$size || '500px'};
  height: ${props => props.$size || '500px'};
  top: ${props => props.$top || 'auto'};
  bottom: ${props => props.$bottom || 'auto'};
  left: ${props => props.$left || 'auto'};
  right: ${props => props.$right || 'auto'};
  background: ${props => props.$color || '#eff6ff'};
  filter: blur(140px);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  animation: ${pulseGlow} 10s ease-in-out infinite;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 8%;
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e2e8f0;
  z-index: 100;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 1.35rem;
  letter-spacing: -0.5px;
  color: #0f172a;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const NavLink = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: color 0.2s;
  &:hover { color: var(--accent, #2563eb); }
  @media (max-width: 600px) { display: none; }
`;

const NavButton = styled.button`
  background: ${props => props.$primary ? 'var(--accent, #2563eb)' : 'transparent'};
  color: ${props => props.$primary ? '#fff' : '#0f172a'};
  border: ${props => props.$primary ? 'none' : '1px solid #cbd5e1'};
  padding: 10px 22px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$primary ? 'var(--accent, #1d4ed8)' : '#f8fafc'};
    transform: translateY(-1px);
    box-shadow: ${props => props.$primary ? '0 10px 20px rgba(37, 99, 235, 0.15)' : 'none'};
  }
`;

const Hero = styled.section`
  padding: 6rem 8% 5rem 8%;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    text-align: center;
    padding-top: 4rem;
    gap: 3rem;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 968px) {
    align-items: center;
  }
`;

const HeroBadge = styled.span`
  background: #eff6ff;
  border: 1px solid #dbeafe;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent, #2563eb);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -1.5px;
  margin-bottom: 1.5rem;
  color: #0f172a;

  span {
    color: var(--accent, #2563eb);
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.15rem;
  color: #475569;
  line-height: 1.65;
  margin-bottom: 2.5rem;
  max-width: 600px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;

  @media (max-width: 968px) {
    justify-content: center;
  }

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const HeroButton = styled.button`
  padding: 16px 36px;
  font-size: 0.95rem;
  font-weight: 700;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s ease;
  
  @media (max-width: 480px) {
    width: 100%;
  }

  &.primary {
    background: var(--accent, #2563eb);
    color: #fff;
    border: none;
    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);
    
    &:hover {
      background: var(--accent, #1d4ed8);
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(37, 99, 235, 0.25);
    }
  }

  &.secondary {
    background: #ffffff;
    color: #0f172a;
    border: 1px solid #cbd5e1;
    
    &:hover {
      background: #f8fafc;
      transform: translateY(-2px);
    }
  }
`;

const HeroIllustrationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  
  img {
    width: 100%;
    max-width: 480px;
    height: auto;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
    animation: ${float} 6s ease-in-out infinite;
  }
`;

const StatsStrip = styled.div`
  display: flex;
  gap: 2.5rem;
  margin-top: 3.5rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 2rem;
  width: 100%;

  @media (max-width: 968px) {
    justify-content: center;
  }
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    text-align: center;
  }

  .stat-item {
    h4 { font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
    p { font-size: 0.85rem; color: #64748b; font-weight: 500; line-height: 1.4; }
  }
`;

const ComparisonSection = styled.section`
  padding: 6rem 8%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ComparisonCard = styled.div`
  background: ${props => props.$success ? '#f8fafc' : '#ffffff'};
  border: 1px solid ${props => props.$success ? 'rgba(37, 99, 235, 0.15)' : '#e2e8f0'};
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: ${props => props.$success ? '0 10px 30px rgba(37, 99, 235, 0.02)' : 'none'};
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  h3 {
    font-size: 1.3rem;
    font-weight: 800;
    color: ${props => props.$success ? 'var(--accent, #2563eb)' : '#64748b'};
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 0.95rem;
    line-height: 1.5;
    
    .icon-box {
      margin-top: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .text-container {
      h5 { font-size: 0.95rem; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
      p { font-size: 0.85rem; color: #64748b; margin-bottom: 0; }
    }
  }
`;

const ShowcaseSection = styled.section`
  background: #f8fafc;
  border-top: 1px solid #edf2f7;
  border-bottom: 1px solid #edf2f7;
  padding: 7rem 8%;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled.div`
  text-align: center;
  margin-bottom: 5rem;

  span {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--accent, #2563eb);
    text-transform: uppercase;
    letter-spacing: 2px;
    display: block;
    margin-bottom: 10px;
  }

  h2 {
    font-size: 2.25rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #0f172a;
    margin-bottom: 1rem;
    text-transform: uppercase;
  }

  p {
    color: #475569;
    font-size: 1.05rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const AppVisualizerGrid = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 4.5rem;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;

  @media (max-width: 968px) {
    gap: 3.5rem;
  }
`;

const PhoneWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
  max-width: 325px;
  
  .phone-title {
    font-size: 1rem;
    font-weight: 800;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    span {
      background: var(--accent, #2563eb);
      color: #fff;
      font-size: 0.75rem;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }
  }
`;

const MobileWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const PhoneDevice = styled.div`
  background: #09090b;
  border: 12px solid #1e293b;
  border-radius: 44px;
  width: 100%;
  max-width: 325px;
  height: 640px;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.15), inset 0 2px 8px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  z-index: 2;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 25px;
    background: #1e293b;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    z-index: 20;
  }

  @media (max-width: 375px) {
    max-width: 280px;
    height: 550px;
    border-width: 8px;
    border-radius: 32px;
    
    &::before {
      width: 90px;
      height: 18px;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
  }
`;

const Screen = styled.div`
  flex: 1;
  background: #ffffff;
  padding: 30px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  font-family: 'Outfit', 'Inter', sans-serif;
  color: #0f172a;

  /* Scrollbar hide */
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: 375px) {
    padding: 24px 12px 12px 12px;
    gap: 12px;
  }
`;

const PhoneHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 10px;
  
  .welcome {
    span { font-size: 0.7rem; color: #64748b; font-weight: 500; }
    h4 { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-top: 2px; }
  }

  .avatar-mock {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--accent, #2563eb);
  }
`;

const DaySelectorMock = styled.div`
  display: flex;
  gap: 6px;
  justify-content: space-between;
  width: 100%;
`;

const DayBubbleMock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 10px 0;
  border-radius: 12px;
  background: ${props => props.$active ? 'var(--accent, #2563eb)' : '#f8fafc'};
  color: ${props => props.$active ? '#fff' : '#64748b'};
  border: 1px solid ${props => props.$active ? 'var(--accent, #2563eb)' : '#e2e8f0'};
  font-size: 0.7rem;
  font-weight: 600;
  
  .num { font-size: 0.9rem; font-weight: 800; margin-top: 2px; color: ${props => props.$active ? '#fff' : '#0f172a'}; }
`;

const TrainingBannerMock = styled.div`
  background: var(--accent, #2563eb);
  color: #ffffff !important;
  padding: 1.25rem;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.15);
  display: flex;
  flex-direction: column;
  gap: 12px;

  .meta {
    font-size: 0.6rem;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 1.5px;
    opacity: 0.85;
    color: #ffffff !important;
  }

  h4 { 
    font-size: 1.15rem; 
    font-weight: 700; 
    color: #ffffff !important; 
    margin-top: 2px;
  }

  .progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.7rem;
    font-weight: 600;
    margin-top: 4px;
  }

  .progress-bar-mock {
    height: 5px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 75%;
      background: #ffffff;
    }
  }
`;

const ExerciseListMock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ExerciseItemMock = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: default;
  transition: all 0.2s;

  .preview-box {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent, #2563eb);
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .details {
    flex: 1;
    h5 { font-size: 0.8rem; font-weight: 700; color: #0f172a; margin: 0; }
    p { font-size: 0.7rem; color: #64748b; margin: 2px 0 0 0; }
  }

  .check {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.$done ? '#ecfdf5' : '#f1f5f9'};
    color: ${props => props.$done ? '#10b981' : '#cbd5e1'};
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const VideoBoxMock = styled.div`
  width: 100%;
  height: 150px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const ExerciseModalMock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MetaGridMock = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  
  .meta-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 8px;
    text-align: center;
    span { font-size: 0.6rem; color: #64748b; display: block; margin-bottom: 2px; }
    strong { font-size: 0.75rem; color: #0f172a; font-weight: 700; }
  }
`;

const LogTableMock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.7rem;

    .set { font-weight: 700; color: #64748b; }
    .inputs { color: #0f172a; font-weight: 600; }
  }
`;

const ShowcaseText = styled.div`
  h3 {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--accent, #2563eb);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 2.25rem;
    font-weight: 800;
    line-height: 1.15;
    margin-bottom: 1.5rem;
    color: #0f172a;
    text-transform: uppercase;
  }

  p {
    color: #475569;
    line-height: 1.6;
    margin-bottom: 2rem;
    font-size: 0.95rem;
  }
`;

const LibraryShowcaseSection = styled.section`
  padding: 6rem 8%;
  background: #ffffff;
  border-bottom: 1px solid #edf2f7;
  position: relative;
  z-index: 1;
`;

const LibraryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 3rem auto 0 auto;
`;

const LibraryCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.01);
  align-items: center;
  text-align: center;
  
  .gif-container {
    width: 100%;
    height: 160px;
    border-radius: 12px;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid #edf2f7;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  
  h4 {
    font-size: 0.9rem;
    font-weight: 700;
    color: #0f172a;
    margin: 4px 0 2px 0;
  }
  
  span {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--accent, #2563eb);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const MethodologySection = styled.section`
  background: #f8fafc;
  border-top: 1px solid #edf2f7;
  border-bottom: 1px solid #edf2f7;
  padding: 7rem 8%;
  position: relative;
  z-index: 1;
`;

const MethodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const MethodCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2.25rem;
  position: relative;
  box-shadow: 0 10px 25px rgba(0,0,0,0.01);

  .step-num {
    position: absolute;
    top: -20px;
    left: 2rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--accent, #2563eb);
    color: #fff;
    font-weight: 800;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 16px rgba(37, 99, 235, 0.2);
  }

  h4 { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-top: 0.75rem; margin-bottom: 0.75rem; }
  p { font-size: 0.85rem; color: #64748b; line-height: 1.5; }
`;

const PricingSection = styled.section`
  padding: 7rem 8%;
  position: relative;
  z-index: 1;
`;

const PricingCard = styled.div`
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 24px;
  max-width: 520px;
  margin: 0 auto;
  padding: 3.5rem 3rem;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: var(--accent, #2563eb);
  }

  .badge {
    background: #eff6ff;
    border: 1px solid #dbeafe;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--accent, #2563eb);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-block;
    margin-bottom: 1.5rem;
  }

  .price {
    font-size: 3rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -1.5px;
    margin-bottom: 0.5rem;
    
    span { font-size: 1rem; color: #64748b; font-weight: 500; letter-spacing: 0; }
  }

  .recurrence { font-size: 0.85rem; color: #64748b; margin-bottom: 2rem; }

  .perks {
    display: flex;
    flex-direction: column;
    gap: 12px;
    text-align: left;
    margin-bottom: 2.5rem;
    border-top: 1px solid #edf2f7;
    border-bottom: 1px solid #edf2f7;
    padding: 2rem 0;

    .perk-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.9rem;
      color: #334155;
      font-weight: 500;
      
      .check { color: #10b981; }
    }
  }
`;

const GuaranteeStrip = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 2rem;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
`;

const Footer = styled.footer`
  padding: 4rem 8% 3rem 8%;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  text-align: center;
  position: relative;
  z-index: 1;

  p {
    font-size: 0.8rem;
    color: #64748b;
  }
`;

const LandingPage = () => {
  const navigate = useNavigate();
  const { settings } = useSelector(state => state.auth);
  
  const systemName = settings?.systemName || 'TREINO PRO';
  const contactPhone = settings?.contactPhone || '5531991660594';
  const infinitePayHandle = settings?.infinitePayHandle || '';
  const accentColor = settings?.themeColor || '#2563eb';
  
  // Custom message for WhatsApp CTA to join TeamPro
  const joinMessage = encodeURIComponent('Olá! Quero entrar para o TeamPro e iniciar meus treinos personalizados!');
  const whatsappJoinLink = `https://wa.me/${contactPhone}?text=${joinMessage}`;
  const checkoutLink = whatsappJoinLink;

  return (
    <PageContainer style={{ '--accent': accentColor }}>
      {/* Decorative Blobs for Light Blue Clean Look */}
      <DecorativeBlob $size="600px" $top="-150px" $left="-100px" $color="#eff6ff" />
      <DecorativeBlob $size="500px" $bottom="200px" $right="-100px" $color="#f0f9ff" />
      
      <Header>
        <Logo>
          <Dumbbell size={22} color="var(--accent)" style={{ transform: 'rotate(-45deg)', filter: 'drop-shadow(0 2px 4px rgba(37,99,235,0.1))' }} />
          <span style={{ fontWeight: 800 }}>{systemName}</span>
        </Logo>
        <HeaderActions>
          <NavLink onClick={() => document.getElementById('por-que').scrollIntoView({ behavior: 'smooth' })}>Por Que Nós?</NavLink>
          <NavLink onClick={() => document.getElementById('app').scrollIntoView({ behavior: 'smooth' })}>O Aplicativo</NavLink>
          <NavLink onClick={() => document.getElementById('biblioteca').scrollIntoView({ behavior: 'smooth' })}>Exercícios</NavLink>
          <NavLink onClick={() => document.getElementById('metodologia').scrollIntoView({ behavior: 'smooth' })}>Como Funciona</NavLink>
          <NavLink onClick={() => navigate('/login')}>Área do Aluno</NavLink>
          <NavButton $primary onClick={() => window.open(whatsappLink, '_blank')}>
            Inscrever-se
          </NavButton>
        </HeaderActions>
      </Header>

      <Hero>
        <HeroContent>
          <HeroBadge>
            <Sparkles size={13} style={{ marginRight: 4 }} />
            Consultoria Fitness Premium
          </HeroBadge>
          <HeroTitle>
            Seu corpo não muda com <span>treinos genéricos</span>
          </HeroTitle>
          <HeroSubtitle>
            A consultoria fitness definitiva que une planejamento individualizado ao melhor aplicativo de treino do mercado. Tudo simples, prático e focado no seu resultado.
          </HeroSubtitle>
          
          <ButtonGroup>
            <HeroButton className="primary" onClick={() => window.open(checkoutLink, '_blank')}>
              Garantir Minha Vaga <ArrowRight size={16} />
            </HeroButton>
            <HeroButton className="secondary" onClick={() => navigate('/login')}>
              Acessar Área do Aluno
            </HeroButton>
          </ButtonGroup>

          <StatsStrip>
            <div className="stat-item">
              <h4>
                <Check size={18} color="var(--accent)" />
                Foco 100% em Você
              </h4>
              <p>Planejamento sob medida para sua rotina e limitações.</p>
            </div>
            <div className="stat-item">
              <h4>
                <MessageSquare size={16} color="var(--accent)" />
                Suporte de Verdade
              </h4>
              <p>Tire suas dúvidas e ajuste seus treinos diretamente com o treinador.</p>
            </div>
            <div className="stat-item">
              <h4>
                <TrendingUp size={16} color="var(--accent)" />
                Evolução Certa
              </h4>
              <p>Registre suas cargas e veja seu progresso em gráficos fáceis.</p>
            </div>
          </StatsStrip>
        </HeroContent>

        <HeroIllustrationWrapper>
          <img src="/landing_hero.png" alt="Fitness Consulting illustration" onError={(e) => { e.target.style.display = 'none'; }} />
        </HeroIllustrationWrapper>
      </Hero>

      <ComparisonSection id="por-que">
        <SectionTitle>
          <span>O Que Agrega no Seu Processo?</span>
          <h2>A diferença entre treinar sozinho e ter um método</h2>
          <p>Veja como estruturamos a sua jornada para garantir que você não perca tempo na academia e alcance o corpo que deseja de forma rápida e segura.</p>
        </SectionTitle>

        <ComparisonGrid>
          <ComparisonCard>
            <h3>
              <X size={18} color="#ef4444" />
              Treinar sem Método (Academia Comum)
            </h3>
            <div className="list">
              <div className="item">
                <div className="icon-box"><X size={18} color="#ef4444" /></div>
                <div className="text-container">
                  <h5>Fichas genéricas e repetitivas</h5>
                  <p>Treinos idênticos ao de centenas de outros alunos, sem focar nos seus pontos fracos ou objetivos específicos.</p>
                </div>
              </div>
              <div className="item">
                <div className="icon-box"><X size={18} color="#ef4444" /></div>
                <div className="text-container">
                  <h5>Falta de registro de carga</h5>
                  <p>Você nunca lembra quanto peso levantou na semana passada, estagnando o ganho de massa e força.</p>
                </div>
              </div>
              <div className="item">
                <div className="icon-box"><X size={18} color="#ef4444" /></div>
                <div className="text-container">
                  <h5>Dúvida na execução do exercício</h5>
                  <p>Incerteza se está fazendo o movimento certo, o que reduz os resultados e aumenta o risco de lesões.</p>
                </div>
              </div>
              <div className="item">
                <div className="icon-box"><X size={18} color="#ef4444" /></div>
                <div className="text-container">
                  <h5>Desistência por falta de suporte</h5>
                  <p>Ninguém te acompanha de verdade. Ao primeiro sinal de desmotivação ou dúvida, você acaba parando.</p>
                </div>
              </div>
            </div>
          </ComparisonCard>

          <ComparisonCard $success>
            <h3>
              <Check size={18} color="var(--accent)" />
              Com a Nossa Consultoria Fitness
            </h3>
            <div className="list">
              <div className="item">
                <div className="icon-box"><Check size={18} color="#10b981" /></div>
                <div className="text-container">
                  <h5>Treino 100% individualizado no aplicativo</h5>
                  <p>Prescrição pensada exatamente para a sua rotina, tempo disponível e focado no físico que quer construir.</p>
                </div>
              </div>
              <div className="item">
                <div className="icon-box"><Check size={18} color="#10b981" /></div>
                <div className="text-container">
                  <h5>Histórico e evolução de carga simplificado</h5>
                  <p>Registre seus pesos na hora do exercício e saiba exatamente com quanto treinar para progredir de verdade.</p>
                </div>
              </div>
              <div className="item">
                <div className="icon-box"><Check size={18} color="#10b981" /></div>
                <div className="text-container">
                  <h5>Instrução visual e GIFs na tela</h5>
                  <p>Um acervo com GIFs fluidos mostrando a execução correta, postura ideal e velocidade do exercício.</p>
                </div>
              </div>
              <div className="item">
                <div className="icon-box"><Check size={18} color="#10b981" /></div>
                <div className="text-container">
                  <h5>Contato direto e suporte integrado</h5>
                  <p>Tire suas dúvidas, envie feedbacks e receba ajustes do seu planejamento de forma prática pelo WhatsApp.</p>
                </div>
              </div>
            </div>
          </ComparisonCard>
        </ComparisonGrid>
      </ComparisonSection>

      <ShowcaseSection id="app">
        <SectionTitle>
          <span>Tecnologia ao Seu Favor</span>
          <h2>O Aplicativo na visão do aluno</h2>
          <p>Conheça a interface projetada exclusivamente para simplificar o seu treino, acompanhar o cronograma e registrar sua evolução de carga.</p>
        </SectionTitle>

        <AppVisualizerGrid>
          <PhoneWrapper>
            <div className="phone-title">
              <span>1</span> Dashboard Diário
            </div>
            <PhoneDevice>
              <Screen>
                <PhoneHeader>
                  <div className="welcome">
                    <span>BOM TREINO,</span>
                    <h4>Olá, Gabriel! ⚡</h4>
                  </div>
                  <div className="avatar-mock">G</div>
                </PhoneHeader>

                <DaySelectorMock>
                  <DayBubbleMock>
                    <span>DOM</span>
                    <span className="num">24</span>
                  </DayBubbleMock>
                  <DayBubbleMock $active>
                    <span>SEG</span>
                    <span className="num">25</span>
                  </DayBubbleMock>
                  <DayBubbleMock>
                    <span>TER</span>
                    <span className="num">26</span>
                  </DayBubbleMock>
                  <DayBubbleMock>
                    <span>QUA</span>
                    <span className="num">27</span>
                  </DayBubbleMock>
                  <DayBubbleMock>
                    <span>QUI</span>
                    <span className="num">28</span>
                  </DayBubbleMock>
                </DaySelectorMock>

                <TrainingBannerMock>
                  <span className="meta">Treino de Hoje</span>
                  <h4>Ficha A - Peitoral e Ombros</h4>
                  <div>
                    <div className="progress-info">
                      <span>Conclusão</span>
                      <span>3 / 4 exercícios</span>
                    </div>
                    <div className="progress-bar-mock" />
                  </div>
                </TrainingBannerMock>

                <ExerciseListMock>
                  <ExerciseItemMock $done>
                    <div className="preview-box">
                      <img src="https://res.cloudinary.com/dsqtianpj/image/upload/v1779910693/vvmtylubkd7gseuefbnw.gif" alt="Supino Reto" />
                    </div>
                    <div className="details">
                      <h5>Supino Reto c/ Halteres</h5>
                      <p>4 séries • 8-12 reps • Descanso: 90s</p>
                    </div>
                    <div className="check $done">
                      <Check size={12} color="#10b981" />
                    </div>
                  </ExerciseItemMock>

                  <ExerciseItemMock $done>
                    <div className="preview-box">
                      <img src="https://res.cloudinary.com/dsqtianpj/image/upload/v1779910658/dfnkxewb8jf9zflo1qp3.gif" alt="Crucifixo Inclinado" />
                    </div>
                    <div className="details">
                      <h5>Crucifixo Inclinado</h5>
                      <p>4 séries • 10-12 reps • Descanso: 60s</p>
                    </div>
                    <div className="check $done">
                      <Check size={12} color="#10b981" />
                    </div>
                  </ExerciseItemMock>

                  <ExerciseItemMock>
                    <div className="preview-box">
                      <img src="https://res.cloudinary.com/dsqtianpj/image/upload/v1779901701/kzpg2athpqvgbkq9h9z1.gif" alt="Desenvolvimento" />
                    </div>
                    <div className="details">
                      <h5>Desenvolvimento c/ Halteres</h5>
                      <p>3 séries • 10-12 reps • Descanso: 60s</p>
                    </div>
                    <div className="check">
                      <Check size={12} color="#cbd5e1" />
                    </div>
                  </ExerciseItemMock>
                </ExerciseListMock>
              </Screen>
            </PhoneDevice>
          </PhoneWrapper>

          <PhoneWrapper>
            <div className="phone-title">
              <span>2</span> Execução e Carga
            </div>
            <PhoneDevice>
              <Screen>
                <PhoneHeader>
                  <div className="welcome">
                    <span style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem' }}>EXECUÇÃO DO TREINO</span>
                    <h4 style={{ marginTop: 4 }}>Elevação Lateral</h4>
                  </div>
                  <div className="avatar-mock">G</div>
                </PhoneHeader>

                <ExerciseModalMock>
                  <VideoBoxMock>
                    <PulseDot />
                    <img 
                      src="https://res.cloudinary.com/dsqtianpj/image/upload/v1779915348/yhcuai8y9bfcdn5hlhds.gif" 
                      alt="Lateral raise gif" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                    <span style={{ position: 'absolute', bottom: 8, left: 12, fontSize: '0.55rem', color: '#64748b', background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e2e8f0', fontWeight: 600 }}>Loop Explicativo</span>
                  </VideoBoxMock>

                  <MetaGridMock>
                    <div className="meta-card">
                      <span>SÉRIES</span>
                      <strong>4</strong>
                    </div>
                    <div className="meta-card">
                      <span>REPETIÇÕES</span>
                      <strong>12-15</strong>
                    </div>
                    <div className="meta-card">
                      <span>DESCANSO</span>
                      <strong>60s</strong>
                    </div>
                  </MetaGridMock>

                  <div style={{ marginTop: 10 }}>
                    <h6 style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: 8 }}>REGISTRO DE EXECUÇÃO:</h6>
                    <LogTableMock>
                      <div className="row">
                        <span className="set">SÉRIE 1</span>
                        <span className="inputs">15 repetições × 12 kg</span>
                        <Check size={12} color="#10b981" />
                      </div>
                      <div className="row">
                        <span className="set">SÉRIE 2</span>
                        <span className="inputs">12 repetições × 14 kg</span>
                        <Check size={12} color="#10b981" />
                      </div>
                      <div className="row">
                        <span className="set">SÉRIE 3</span>
                        <span className="inputs">12 repetições × 14 kg</span>
                        <Check size={12} color="#10b981" />
                      </div>
                    </LogTableMock>
                  </div>
                </ExerciseModalMock>
              </Screen>
            </PhoneDevice>
          </PhoneWrapper>

          <PhoneWrapper>
            <div className="phone-title">
              <span>3</span> Perfil e Biometria
            </div>
            <PhoneDevice>
              <Screen>
                <PhoneHeader>
                  <div className="welcome">
                    <span style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem' }}>MEU PERFIL</span>
                    <h4 style={{ marginTop: 4 }}>Gabriel Rodrigues</h4>
                  </div>
                  <div className="avatar-mock">G</div>
                </PhoneHeader>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: 14, textAlign: 'center' }}>
                    <span style={{ fontSize: '0.6rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>ÍNDICE DE MASSA CORPORAL (IMC)</span>
                    <strong style={{ fontSize: '1.8rem', color: '#10b981' }}>22.4</strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#10b981', marginTop: 2 }}>Peso Saudável</span>
                    <p style={{ fontSize: '0.65rem', color: '#64748b', marginTop: 6, lineHeight: 1.4 }}>Excelente! Seu peso está na faixa ideal recomendada.</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                      <span style={{ fontSize: '0.55rem', color: '#64748b', display: 'block' }}>PESO ATUAL</span>
                      <strong style={{ fontSize: '1rem', color: '#0f172a', display: 'block', marginTop: 4 }}>74 kg</strong>
                    </div>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                      <span style={{ fontSize: '0.55rem', color: '#64748b', display: 'block' }}>ALTURA</span>
                      <strong style={{ fontSize: '1rem', color: '#0f172a', display: 'block', marginTop: 4 }}>1.82 m</strong>
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>DADOS DA ASSINATURA</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                      <span style={{ color: '#64748b' }}>Plano:</span>
                      <strong style={{ color: '#0f172a' }}>Mensal Premium</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                      <span style={{ color: '#64748b' }}>Status de Acesso:</span>
                      <strong style={{ color: '#10b981' }}>Ativo ✓</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                      <span style={{ color: '#64748b' }}>Vencimento:</span>
                      <strong style={{ color: '#0f172a' }}>28/06/2026</strong>
                    </div>
                  </div>
                </div>
              </Screen>
            </PhoneDevice>
          </PhoneWrapper>
        </AppVisualizerGrid>
      </ShowcaseSection>

      <LibraryShowcaseSection id="biblioteca">
        <SectionTitle>
          <span>Biblioteca de Exercícios</span>
          <h2>Gifs de Execução para Cada Movimento</h2>
          <p>Você nunca mais treinará com dúvidas. Nosso aplicativo conta com uma biblioteca de execuções corretas em alta qualidade para te guiar.</p>
        </SectionTitle>

        <LibraryGrid>
          <LibraryCard>
            <div className="gif-container">
              <img src="https://res.cloudinary.com/dsqtianpj/image/upload/v1779910718/k2lqifqeyjf5bwcmzmvi.gif" alt="Supino Inclinado" />
            </div>
            <span>Peitoral</span>
            <h4>Supino Inclinado c/ Halteres</h4>
          </LibraryCard>

          <LibraryCard>
            <div className="gif-container">
              <img src="https://res.cloudinary.com/dsqtianpj/image/upload/v1779915963/qx0uiculhl1acashkouk.gif" alt="Remada Sentada" />
            </div>
            <span>Costas</span>
            <h4>Remada Sentada c/ Corda</h4>
          </LibraryCard>

          <LibraryCard>
            <div className="gif-container">
              <img src="https://res.cloudinary.com/dsqtianpj/image/upload/v1779915284/s7mstfxfitbg2hak9y9q.gif" alt="Agachamento Snatch" />
            </div>
            <span>Pernas</span>
            <h4>Agachamento Overhead</h4>
          </LibraryCard>

          <LibraryCard>
            <div className="gif-container">
              <img src="https://res.cloudinary.com/dsqtianpj/image/upload/v1778612275/aupkseh6jrybyyad3wqr.gif" alt="Bicicleta Ergométrica" />
            </div>
            <span>Cardio</span>
            <h4>Bicicleta Ergométrica</h4>
          </LibraryCard>
        </LibraryGrid>
      </LibraryShowcaseSection>

      <MethodologySection id="metodologia">
        <SectionTitle>
          <span>Simples e Direto</span>
          <h2>Como funciona o seu acompanhamento</h2>
          <p>O processo foi desenhado para ser o mais fácil possível, exigindo poucos minutos da sua rotina para manter seu treino atualizado.</p>
        </SectionTitle>

        <MethodGrid>
          <MethodCard>
            <div className="step-num">01</div>
            <h4>Preencha a Anamnese</h4>
            <p>Você responde a um formulário rápido informando seus objetivos, dores, lesões e tempo de treino disponível.</p>
          </MethodCard>

          <MethodCard>
            <div className="step-num">02</div>
            <h4>Acesse o Seu Treino</h4>
            <p>Seu treino é montado sob medida e disponibilizado instantaneamente no aplicativo com todas as instruções.</p>
          </MethodCard>

          <MethodCard>
            <div className="step-num">03</div>
            <h4>Treine e Evolua</h4>
            <p>Faça os exercícios acompanhando os GIFs de execução correta e anote o peso levantado para planejar sua progressão.</p>
          </MethodCard>

          <MethodCard>
            <div className="step-num">04</div>
            <h4>Ajuste Conforme Evolui</h4>
            <p>Tire suas dúvidas e peça correções e ajustes de carga a qualquer momento pelo suporte integrado de WhatsApp.</p>
          </MethodCard>
        </MethodGrid>
      </MethodologySection>

      <PricingSection id="preco">
        <PricingCard>
          <span className="badge" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' }}>Vagas Limitadas</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.5px' }}>Entre para o TeamPro</h2>
          <p className="recurrence" style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
            Fale diretamente comigo pelo WhatsApp para garantir sua vaga na consultoria fitness premium e receber seu planejamento individualizado de treinos e mobilidade.
          </p>
          
          <div className="perks" style={{ borderTop: '1px solid #edf2f7', borderBottom: '1px solid #edf2f7', padding: '1.5rem 0', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
            <div className="perk-item" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Check size={16} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>Planejamento de treinos 100% individualizado</span>
            </div>
            <div className="perk-item" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Check size={16} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>Suporte e ajustes constantes via WhatsApp</span>
            </div>
            <div className="perk-item" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Check size={16} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>Acesso completo ao aplicativo do aluno</span>
            </div>
          </div>

          <HeroButton className="primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px' }} onClick={() => window.open(checkoutLink, '_blank')}>
            Falar no WhatsApp & Garantir Vaga <ArrowRight size={16} />
          </HeroButton>
        </PricingCard>
      </PricingSection>

      <Footer>
        <Logo style={{ justifyContent: 'center', marginBottom: '1.25rem', opacity: 0.8 }}>
          <Dumbbell size={18} color="var(--accent)" style={{ transform: 'rotate(-45deg)' }} />
          <span style={{ fontWeight: 800 }}>{systemName}</span>
        </Logo>
        <p>© {new Date().getFullYear()} {systemName} Consultoria. Todos os direitos reservados.</p>
      </Footer>
    </PageContainer>
  );
};

export default LandingPage;
