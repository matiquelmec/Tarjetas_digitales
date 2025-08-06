'use client';

import { Container, Row, Col, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { usePostLoginRedirect } from '@/hooks/usePostLoginRedirect';
import IndiNavbar from '@/components/layout/IndiNavbar';

type ServiceStatus = 'available' | 'coming-soon' | 'contact-us';

// interface Service { // Currently unused, reserved for future service grid
//   icon: string;
//   title: string;
//   description: string;
//   features: string[];
//   status: ServiceStatus;
//   buttonText: string;
//   buttonVariant: string;
//   link?: string;
//   comingSoonDate?: string;
// }

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // Handle post-login redirection
  usePostLoginRedirect();

  const handleCreateCard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Create card button clicked');
    
    // Check if user is authenticated
    if (!session) {
      // Store user intention for after login
      sessionStorage.setItem('userIntention', 'createCard');
      signIn('google');
      return;
    }
    
    // User is authenticated, go directly to create
    try {
      router.push('/create');
    } catch (error) {
      console.error('Router push failed:', error);
      // Fallback to window.location
      window.location.href = '/create';
    }
  };

  const handleDashboardAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Dashboard access button clicked');
    
    // Check if user is authenticated
    if (!session) {
      // Store user intention for after login
      sessionStorage.setItem('userIntention', 'accessDashboard');
      signIn('google');
      return;
    }
    
    // User is authenticated, go to dashboard
    try {
      router.push('/dashboard');
    } catch (error) {
      console.error('Router push failed:', error);
      // Fallback to window.location
      window.location.href = '/dashboard';
    }
  };
  
  return (
    <>
      <style jsx global>{`
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient-background {
          background: linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e);
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }
        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.5);
        }
        .btn-modern {
          background-color: #007bff;
          border-color: #007bff;
          transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;
        }
        .btn-modern:hover {
          background-color: #0056b3;
          border-color: #0056b3;
        }
        .btn-disabled {
          background-color: #6c757d !important;
          border-color: #6c757d !important;
          cursor: not-allowed;
        }
        
        /* Botones premium dorados mejorados */
        .btn-premium-gold-outline {
          background: transparent !important;
          border: 2px solid #D4A017 !important;
          color: #D4A017 !important;
          font-weight: 600 !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 2px 8px rgba(212, 160, 23, 0.2) !important;
        }
        
        .btn-premium-gold-outline:hover {
          background: linear-gradient(135deg, #D4A017, #B8860B) !important;
          border-color: #B8860B !important;
          color: #ffffff !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(212, 160, 23, 0.3) !important;
        }
        
        .btn-premium-gold {
          background: linear-gradient(135deg, #D4A017, #B8860B) !important;
          border-color: #B8860B !important;
          color: #ffffff !important;
          font-weight: 600 !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
          box-shadow: 0 4px 12px rgba(212, 160, 23, 0.3) !important;
          transition: all 0.3s ease !important;
        }
        
        .btn-premium-gold:hover {
          background: linear-gradient(135deg, #E5B41F, #CD950C) !important;
          border-color: #CD950C !important;  
          color: #ffffff !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 16px rgba(212, 160, 23, 0.4) !important;
        }
        
        /* Estilos para homepage minimalista */
        .hero-content {
          padding: 2rem 0;
        }
        
        .cta-hero {
          transition: all 0.3s ease !important;
          transform-origin: center;
        }
        
        .cta-hero:hover {
          transform: translateY(-3px) scale(1.02) !important;
          box-shadow: 0 12px 40px rgba(0, 246, 255, 0.4) !important;
        }
        
        .main-service-card {
          max-width: 600px;
          margin: 0 auto;
          transform: translateY(0);
          transition: all 0.4s ease;
        }
        
        .main-service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 64px 0 rgba(31, 38, 135, 0.6);
        }
        
        .btn-cta-secondary {
          transition: all 0.3s ease !important;
        }
        
        .btn-cta-secondary:hover {
          background: #00F6FF !important;
          color: #ffffff !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px rgba(0, 246, 255, 0.3) !important;
        }
        
        .future-services {
          margin-top: 4rem;
          padding: 2rem 0;
        }
        
        .future-item {
          text-align: center;
          padding: 1rem;
          transition: all 0.3s ease;
          border-radius: 12px;
        }
        
        .future-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        
        .future-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
        }
        
        .feature-item {
          padding: 0.5rem;
          text-align: center;
        }
        
        /* ESTILOS HERO INTERGALÁCTICO */
        .hero-intergalactico {
          position: relative;
          padding: 4rem 2rem;
          margin-bottom: 3rem;
          overflow: hidden;
        }
        
        .min-vh-60 {
          min-height: 60vh;
        }
        
        /* Partículas espaciales */
        .space-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }
        
        .space-particle-1 { top: 10%; left: 10%; animation: particleSpace 12s ease-in-out infinite; animation-delay: 0s; }
        .space-particle-2 { top: 20%; left: 80%; animation: particleSpace 10s ease-in-out infinite; animation-delay: -2s; }
        .space-particle-3 { top: 60%; left: 15%; animation: particleSpace 14s ease-in-out infinite; animation-delay: -4s; }
        .space-particle-4 { top: 80%; left: 70%; animation: particleSpace 8s ease-in-out infinite; animation-delay: -6s; }
        .space-particle-5 { top: 30%; left: 50%; animation: particleSpace 16s ease-in-out infinite; animation-delay: -8s; }
        .space-particle-6 { top: 70%; left: 30%; animation: particleSpace 11s ease-in-out infinite; animation-delay: -10s; }
        
        @keyframes particleSpace {
          0%, 100% { transform: translateY(0px) scale(0.8); opacity: 0.4; }
          25% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
          50% { transform: translateY(-10px) scale(1); opacity: 1; }
          75% { transform: translateY(-30px) scale(0.9); opacity: 0.6; }
        }
        
        /* Badge alienígena */
        .alien-badge {
          display: inline-block;
        }
        
        .badge-alien {
          background: linear-gradient(135deg, rgba(0, 246, 255, 0.2), rgba(142, 45, 226, 0.2));
          border: 2px solid rgba(0, 246, 255, 0.8);
          padding: 14px 28px;
          border-radius: 30px;
          color: #ffffff;
          font-size: clamp(0.9rem, 2.5vw, 1.1rem);
          font-weight: 800;
          backdrop-filter: blur(20px);
          box-shadow: 0 12px 40px rgba(0, 246, 255, 0.4);
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
          letter-spacing: 0.5px;
          text-transform: uppercase;
          white-space: nowrap;
          display: inline-block;
          transition: all 0.3s ease;
        }
        
        .badge-alien:hover {
          background: linear-gradient(135deg, rgba(0, 246, 255, 0.25), rgba(142, 45, 226, 0.25));
          border-color: rgba(0, 246, 255, 0.8);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 16px 50px rgba(0, 246, 255, 0.4);
        }
        
        /* Título alienígena */
        .hero-title-alien {
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 900;
          line-height: 1.1;
          font-family: 'Montserrat', sans-serif;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .hero-highlight-alien {
          background: linear-gradient(135deg, #00f6ff, #0072ff, #8e2de2, #4a00e0);
          background-size: 300% 300%;
          animation: alienGradient 4s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        @keyframes alienGradient {
          0%, 100% { background-position: 0% 50%; }
          33% { background-position: 100% 50%; }
          66% { background-position: 50% 100%; }
        }
        
        .hero-subtitle-alien {
          font-size: clamp(1.2rem, 2.5vw, 1.5rem);
          line-height: 1.7;
          max-width: 95%;
        }
        
        /* CTAs de Abducción */
        .hero-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }
        
        .hero-ctas {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
        }
        
        @media (min-width: 992px) {
          .hero-ctas {
            justify-content: center !important;
          }
        }
        
        .cta-abduction-primary {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          border: none;
          padding: 18px 36px;
          border-radius: 20px;
          font-weight: 800;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          font-size: 1.2rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 12px 40px rgba(0, 246, 255, 0.4);
        }
        
        .cta-abduction-primary:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 20px 60px rgba(0, 246, 255, 0.6);
          background: linear-gradient(135deg, #00d4e7, #0056cc);
        }
        
        .cta-abduction-secondary {
          background: rgba(255, 255, 255, 0.1);
          border: 3px solid rgba(0, 246, 255, 0.4);
          color: #00f6ff;
          padding: 18px 36px;
          border-radius: 20px;
          font-weight: 700;
          backdrop-filter: blur(15px);
          transition: all 0.4s ease;
          font-size: 1.2rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .cta-abduction-secondary:hover {
          background: rgba(0, 246, 255, 0.2);
          border-color: rgba(0, 246, 255, 0.7);
          transform: translateY(-4px);
          color: #ffffff;
          box-shadow: 0 16px 48px rgba(0, 246, 255, 0.3);
        }
        
        .cta-icon {
          margin-right: 12px;
          font-size: 1.3em;
        }
        
        .cta-arrow {
          margin-left: 12px;
          transition: transform 0.3s ease;
        }
        
        .cta-abduction-primary:hover .cta-arrow {
          transform: translateX(8px);
        }
        
        /* Transmisión desde la nave */
        .transmission-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        @media (min-width: 992px) {
          .transmission-status {
            justify-content: flex-start;
          }
        }
        
        .signal-indicator {
          font-size: 1.2em;
          animation: signal 2s ease-in-out infinite;
        }
        
        @keyframes signal {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        /* Indi Hero Assistant Container */
        .indi-hero-assistant {
          position: relative;
          height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Hero Spaceship */
        .hero-spaceship {
          position: absolute;
          top: 10%;
          right: 10%;
          z-index: 1;
        }
        
        .spaceship-main {
          font-size: 3rem;
          animation: heroSpaceshipFloat 6s ease-in-out infinite;
          filter: drop-shadow(0 0 15px rgba(0, 246, 255, 0.6));
        }
        
        .spaceship-trail {
          position: absolute;
          top: 50%;
          left: -40px;
          width: 30px;
          height: 2px;
          background: linear-gradient(to left, rgba(0, 246, 255, 0.8), transparent);
          animation: trailPulse 2s ease-in-out infinite;
        }
        
        @keyframes heroSpaceshipFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        
        @keyframes trailPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        /* Indi Floating Hero */
        .indi-floating-hero {
          position: relative;
          z-index: 3;
          animation: indiHeroFloat 4s ease-in-out infinite;
        }
        
        @keyframes indiHeroFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        
        /* Hero Particles Background */
        .hero-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }
        
        .hero-particle {
          position: absolute;
          font-size: 1.2rem;
          animation: heroParticleFloat 10s ease-in-out infinite;
          opacity: 0.3;
        }
        
        .hero-particle-1 { top: 20%; left: 15%; animation-delay: 0s; }
        .hero-particle-2 { top: 40%; left: 25%; animation-delay: -2s; }
        .hero-particle-3 { top: 60%; left: 10%; animation-delay: -4s; }
        .hero-particle-4 { top: 30%; right: 20%; animation-delay: -6s; }
        .hero-particle-5 { top: 70%; right: 15%; animation-delay: -8s; }
        .hero-particle-6 { bottom: 20%; left: 35%; animation-delay: -1s; }
        
        @keyframes heroParticleFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          25% { transform: translateY(-15px) rotate(90deg); opacity: 0.6; }
          50% { transform: translateY(-8px) rotate(180deg); opacity: 0.4; }
          75% { transform: translateY(-20px) rotate(270deg); opacity: 0.5; }
        }
        
        /* Indi Service Assistant */
        .indi-service-assistant {
          position: absolute;
          top: -10px;
          right: -10px;
          z-index: 10;
          animation: indiServiceFloat 3s ease-in-out infinite;
        }
        
        @keyframes indiServiceFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
        
        .indi-message-bubble {
          position: absolute;
          top: -15px;
          right: 60px;
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          color: white;
          padding: 8px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0, 246, 255, 0.3);
          opacity: 0;
          animation: messageBubble 4s ease-in-out infinite;
          font-weight: 600;
        }
        
        .indi-message-bubble::after {
          content: '';
          position: absolute;
          top: 50%;
          right: -8px;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid #00f6ff;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
        }
        
        @keyframes messageBubble {
          0%, 70%, 100% { opacity: 0; transform: translateX(10px); }
          10%, 60% { opacity: 1; transform: translateX(0px); }
        }
        
        /* Decoraciones alienígenas */
        .alien-decorations {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }
        
        .alien-1 {
          top: 25%;
          left: 5%;
          font-size: 2.5rem;
          animation: alienFloat1 5s ease-in-out infinite;
        }
        
        .alien-2 {
          top: 55%;
          right: 6%;
          font-size: 2rem;
          animation: alienFloat2 7s ease-in-out infinite;
          animation-delay: -2s;
        }
        
        .alien-3 {
          bottom: 20%;
          left: 18%;
          font-size: 2.2rem;
          animation: alienFloat3 6s ease-in-out infinite;
          animation-delay: -4s;
        }
        
        .alien-4 {
          top: 10%;
          left: 50%;
          font-size: 1.8rem;
          animation: alienFloat4 8s ease-in-out infinite;
          animation-delay: -6s;
        }
        
        .alien-5 {
          bottom: 35%;
          right: 20%;
          font-size: 1.5rem;
          animation: alienFloat5 9s ease-in-out infinite;
          animation-delay: -1s;
        }
        
        @keyframes alienFloat1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-25px) rotate(15deg); opacity: 1; }
        }
        
        @keyframes alienFloat2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-20px) rotate(-10deg); opacity: 0.9; }
        }
        
        @keyframes alienFloat3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
          50% { transform: translateY(-30px) rotate(20deg); opacity: 1; }
        }
        
        @keyframes alienFloat4 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-18px) rotate(-8deg); opacity: 0.8; }
        }
        
        @keyframes alienFloat5 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-22px) rotate(12deg); opacity: 0.7; }
        }
        
        /* Capabilities Section */
        .platform-capabilities {
          padding: 2rem 0;
        }
        
        /* CTA Final */
        .final-cta {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(0, 246, 255, 0.2);
          border-radius: 24px;
          margin: 2rem 0;
        }
        
        .cta-final-button {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          border: none;
          padding: 18px 40px;
          border-radius: 20px;
          font-weight: 800;
          font-size: 1.3rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(0, 246, 255, 0.4);
        }
        
        .cta-final-button:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 20px 60px rgba(0, 246, 255, 0.6);
          background: linear-gradient(135deg, #00d4e7, #0056cc);
          color: white;
        }
        
        .cta-final-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.6s ease;
        }
        
        .cta-final-button:hover::before {
          left: 100%;
        }
        
        .capability-card {
          padding: 2rem 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          height: 100%;
        }
        
        .capability-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(0, 246, 255, 0.3);
          box-shadow: 0 16px 40px rgba(0, 246, 255, 0.2);
        }
        
        .capability-icon {
          font-size: 3rem;
          filter: drop-shadow(0 4px 12px rgba(0, 246, 255, 0.4));
        }
        
        .capability-title {
          font-size: 1.3rem;
          font-weight: 700;
          font-family: 'Montserrat', sans-serif;
        }
        
        .capability-description {
          font-size: 1rem;
          line-height: 1.5;
        }
        
        /* CTA Final Alienígena */
        .final-alien-cta {
          margin-top: 3rem;
        }
        
        .alien-cta-container {
          position: relative;
          padding: 2rem;
        }
        
        .alien-glow-effect {
          position: relative;
          display: inline-block;
        }
        
        .alien-signal {
          font-size: 3rem;
          animation: alienSignal 2s ease-in-out infinite;
          filter: drop-shadow(0 0 20px rgba(0, 246, 255, 0.8));
        }
        
        @keyframes alienSignal {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
          50% { transform: scale(1.1) rotate(5deg); opacity: 1; }
        }
        
        .alien-cta-title {
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 800;
          font-family: 'Montserrat', sans-serif;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .btn-alien-final {
          background: linear-gradient(135deg, #00f6ff, #0072ff, #8e2de2);
          background-size: 200% 200%;
          animation: alienGradientPulse 3s ease-in-out infinite;
          border: none;
          padding: 18px 40px;
          border-radius: 30px;
          font-weight: 800;
          font-size: 1.2rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: white;
          position: relative;
          overflow: hidden;
          box-shadow: 0 15px 50px rgba(0, 246, 255, 0.4);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes alienGradientPulse {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .btn-alien-final:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 25px 70px rgba(0, 246, 255, 0.6);
          color: white;
        }
        
        .btn-alien-final::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s ease;
        }
        
        .btn-alien-final:hover::before {
          left: 100%;
        }
        
        .alien-icon {
          margin-right: 12px;
          font-size: 1.4em;
          animation: alienBounce 2s ease-in-out infinite;
        }
        
        .alien-trail {
          margin-left: 12px;
          font-size: 1.2em;
          animation: alienSparkle 1.5s ease-in-out infinite;
        }
        
        @keyframes alienBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        
        @keyframes alienSparkle {
          0%, 100% { opacity: 0.6; transform: rotate(0deg); }
          50% { opacity: 1; transform: rotate(180deg); }
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .hero-intergalactico {
            padding: 2rem 1rem;
          }
          
          .min-vh-60 {
            min-height: 50vh;
          }
          
          .badge-alien {
            font-size: 0.85rem;
            padding: 12px 20px;
            letter-spacing: 0.3px;
            white-space: normal;
            text-align: center;
            line-height: 1.3;
            max-width: 280px;
            margin: 0 auto;
          }
        }
          
          .spaceship-container {
            height: 300px;
            margin-top: 1rem;
          }
          
          .card-hologram {
            width: 300px;
            height: 200px;
            padding: 18px;
          }
          
          .profile-alien {
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
            margin-right: 12px;
          }
          
          .profile-data h4 {
            font-size: 1rem !important;
            line-height: 1.2 !important;
          }
          
          .profile-data p {
            font-size: 0.85rem !important;
            line-height: 1.1 !important;
          }
          
          .feature-alien {
            font-size: 0.8rem !important;
            gap: 8px;
          }
          
          .holo-features {
            gap: 8px !important;
          }
          
          .spaceship {
            font-size: 2.2rem;
          }
          
          .spaceship-arrival {
            top: 15%;
            right: 10%;
          }
          
          .alien-1 {
            font-size: 1.8rem;
            top: 20%;
            left: 3%;
          }
          
          .alien-2 {
            font-size: 1.5rem;
            top: 50%;
            right: 3%;
          }
          
          .alien-3 {
            font-size: 1.6rem;
            bottom: 15%;
            left: 12%;
          }
          
          .alien-4 {
            font-size: 1.2rem;
            top: 8%;
            left: 45%;
          }
          
          .alien-5 {
            display: none; /* Ocultar en móvil para evitar saturación */
          }
          
          .hero-ctas {
            flex-direction: column;
            align-items: center;
          }
          
          .cta-abduction-primary {
            width: 100%;
            max-width: 300px;
          }
          
          .capability-card {
            margin-bottom: 1.5rem;
          }
          
          .cta-final-button {
            width: 100%;
            max-width: 320px;
            font-size: 1.1rem;
            padding: 16px 32px;
          }
          
          .btn-alien-final {
            width: 100%;
            max-width: 300px;
            font-size: 1rem;
            padding: 16px 32px;
          }
          
          .alien-signal {
            font-size: 2.5rem;
          }
          
          .alien-cta-container {
            padding: 1.5rem;
          }
        }
      `}</style>
      <div className="animated-gradient-background min-vh-100">
        
        {/* Navigation Header */}
        <IndiNavbar 
          variant="transparent" 
          position="relative" 
          showActions={true} 
        />
        
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
          <Container fluid className="py-5">
          {/* HERO INTERGALÁCTICO */}
          <div className="hero-intergalactico">
            {/* Partículas espaciales de fondo */}
            <div className="space-particles">
              <div className="particle space-particle-1">🆔</div>
              <div className="particle space-particle-2">📄</div>
              <div className="particle space-particle-3">📊</div>
              <div className="particle space-particle-4">🔗</div>
              <div className="particle space-particle-5">💻</div>
              <div className="particle space-particle-6">✨</div>
            </div>
            
            <Row className="align-items-center min-vh-70 justify-content-center">
              <Col lg={8} xl={7}>
                <div className="hero-content text-center">
                  <div className="alien-badge mb-3">
                    <span className="badge-alien">💻 Plataforma Digital Profesional • PRUEBA GRATIS</span>
                  </div>
                  
                  <h1 className="hero-title-alien text-white mb-3">
                    Lleva tu Imagen Personal
                    <br />
                    <span className="hero-highlight-alien">al Siguiente Nivel</span>
                  </h1>
                  
                  <p className="hero-subtitle-alien text-white opacity-90 mb-3">
                    Crea una identidad digital profesional que <strong>convierte contactos en clientes</strong>. 
                    <br />
                    Tarjetas interactivas, CVs optimizados con IA y presentaciones que cierran deals.
                  </p>
                  
                  {/* Destacar productos */}
                  <div className="hero-products mb-4">
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                      <span className="badge bg-success px-3 py-2">🆔 Tarjetas Digitales • GRATIS</span>
                      <span className="badge bg-warning text-dark px-3 py-2">📄 CVs Inteligentes</span>
                      <span className="badge bg-info px-3 py-2">📊 Presentaciones Pro</span>
                    </div>
                  </div>
                  
                  {/* CTA de Abducción */}
                  <div className="hero-ctas mb-3 text-center">
                    <Button 
                      size="lg"
                      className="cta-abduction-primary mb-3"
                      onClick={handleDashboardAccess}
                    >
                      <span className="cta-icon">🚀</span>
                      Comenzar a Diseñar GRATIS
                      <span className="cta-arrow">→</span>
                    </Button>
                  </div>
                  
                  {/* Beneficios clave */}
                  <div className="hero-benefits text-center">
                    <small className="text-white opacity-85">
                      ✅ Sin compromisos • ✅ Resultados inmediatos • ✅ Tecnología única
                    </small>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* ¿Qué Puedes Hacer en Nuestra Plataforma? */}
          <div className="productos-section py-3">
            <Container>
              <Row className="justify-content-center mb-3">
                <Col lg={8} xl={6}>
                  <div className="text-center">
                    <h2 className="text-white mb-4" style={{ fontSize: '2.5rem', fontWeight: '800' }}>
                      ¿Qué Puedes Hacer en Nuestra <span className="hero-highlight-alien">Plataforma</span>?
                    </h2>
                  </div>
                </Col>
              </Row>
              
              <Row className="justify-content-center">
                <Col lg={10} xl={8}>
                  <Row className="g-4">
                    <Col md={6}>
                    <div className="capability-card">
                      <div className="capability-icon mb-3">
                        🆔
                      </div>
                      <h4 className="capability-title text-white mb-3">
                        Tarjetas Digitales Premium
                      </h4>
                      <div className="mb-3">
                        <span className="badge bg-success fs-6 px-3 py-2 mb-2">
                          🎯 PRUEBA GRATIS
                        </span>
                      </div>
                      <p className="capability-description text-white opacity-85">
                        Crea tu tarjeta digital con diseño exclusivo y propiedades interactivas. Compártela fácilmente por WhatsApp y atrae más clientes para tu negocio con efectos visuales únicos que nadie más tiene.
                      </p>
                    </div>
                  </Col>
                  
                    <Col md={6}>
                      <div className="capability-card">
                        <div className="capability-icon mb-3">
                          📄
                        </div>
                        <h4 className="capability-title text-white mb-3">
                          CVs Inteligentes con IA
                        </h4>
                      <div className="mb-3">
                        <span className="badge bg-warning text-dark fs-6 px-3 py-2 mb-2">
                          📅 PRÓXIMAMENTE
                        </span>
                      </div>
                      <p className="capability-description text-white opacity-85">
                        Optimiza automáticamente tu currículum con IA avanzada. Usa plantillas ATS-friendly que pasan filtros automáticos y captan la atención de reclutadores al instante, multiplicando tus entrevistas de trabajo.
                      </p>
                    </div>
                  </Col>
                  
                    <Col md={6}>
                      <div className="capability-card">
                        <div className="capability-icon mb-3">
                          📊
                        </div>
                        <h4 className="capability-title text-white mb-3">
                          Presentaciones Profesionales
                        </h4>
                      <div className="mb-3">
                        <span className="badge bg-info fs-6 px-3 py-2 mb-2">
                          📅 PRÓXIMAMENTE
                        </span>
                      </div>
                      <p className="capability-description text-white opacity-85">
                        Hipnotiza a tu audiencia con presentaciones cinematográficas que convierten ideas en resultados. Elementos interactivos y transiciones que cierran más deals y generan impacto duradero en clientes.
                      </p>
                    </div>
                  </Col>
                  
                    <Col md={6}>
                      <div className="capability-card">
                        <div className="capability-icon mb-3">
                          🔗
                        </div>
                        <h4 className="capability-title text-white mb-3">
                          Identidad Digital Completa
                        </h4>
                      <div className="mb-3">
                        <span className="badge bg-gradient fs-6 px-3 py-2 mb-2" style={{background: 'linear-gradient(135deg, #00f6ff, #0072ff)'}}>
                          🎯 TODO INCLUIDO
                        </span>
                      </div>
                      <p className="capability-description text-white opacity-85">
                        Una plataforma integral donde tu identidad profesional evoluciona constantemente
                      </p>
                    </div>
                  </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </div>

          {/* CTA Final Alienígena */}
          <div className="final-alien-cta py-5">
            <Container>
              <Row className="justify-content-center">
                <Col lg={8} xl={6}>
                  <div className="text-center">
                    <div className="alien-cta-container">
                      <div className="alien-glow-effect mb-4">
                        <span className="alien-signal">💻</span>
                      </div>
                      <h3 className="alien-cta-title text-white mb-3">
                        Tu Identidad Digital Te Está <span className="hero-highlight-alien">Esperando</span>
                      </h3>
                      <p className="text-white opacity-85 mb-4">
                        Comienza con tarjetas digitales y accede a CVs inteligentes, presentaciones y más herramientas próximamente
                      </p>
                      <Button 
                        size="lg"
                        className="btn-alien-final"
                        onClick={handleCreateCard}
                      >
                        <span className="alien-icon">🆔</span>
                        Comenzar con Mi Tarjeta Digital
                        <span className="alien-trail">✨</span>
                      </Button>
                      <div className="mt-3">
                        <small className="text-white opacity-75">
                          ✅ Sin compromisos • ✅ Resultados inmediatos • ✅ Tecnología única
                        </small>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>

        </Container>
        </div>
      </div>
    </>
  );
}
