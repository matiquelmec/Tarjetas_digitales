'use client';

import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePostLoginRedirect } from '@/hooks/usePostLoginRedirect';

type ServiceStatus = 'available' | 'coming-soon' | 'contact-us';

interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
  status: ServiceStatus;
  buttonText: string;
  buttonVariant: string;
  link?: string;
  comingSoonDate?: string;
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const services: Service[] = [
    {
      icon: '💼',
      title: 'Tarjetas Digitales Premium',
      description: 'Crea tarjetas de presentación digitales con efectos visuales premium, QR codes integrados y compartir instantáneo por WhatsApp.',
      features: [
        'Editor visual en tiempo real',
        'Efectos glassmorphism y partículas',
        'URLs personalizadas',
        'Analytics de interacción',
      ],
      status: 'available',
      buttonText: 'Comenzar Ahora',
      buttonVariant: 'primary',
      link: '/dashboard',
    },
    {
      icon: '🚀',
      title: 'CVs Inteligentes',
      description: 'Sube tu CV actual y nuestra IA lo optimiza con diseños modernos, palabras clave relevantes y estructura profesional.',
      features: [
        'Optimización con IA',
        'Plantillas modernas ATS-friendly',
        'Análisis de palabras clave',
        'Exportación PDF/Word',
      ],
      status: 'coming-soon',
      buttonText: 'Próximamente',
      buttonVariant: 'outline-light',
      comingSoonDate: 'Febrero 2025',
    },
    {
      icon: '🎯',
      title: 'Presentaciones Inmersivas',
      description: 'Crea presentaciones que hipnoticen a tu audiencia con transiciones cinematográficas y contenido interactivo.',
      features: [
        'Transiciones cinematográficas',
        'Elementos interactivos',
        'Colaboración en tiempo real',
        'Analytics de engagement',
      ],
      status: 'coming-soon',
      buttonText: 'Próximamente',
      buttonVariant: 'outline-light',
      comingSoonDate: 'Marzo 2025',
    },
    {
      icon: '🏢',
      title: 'Soluciones Empresariales',
      description: 'White-label completo, integraciones CRM avanzadas, SSO y herramientas de gestión de equipos para empresas.',
      features: [
        'White-label personalizable',
        'Integraciones CRM/API',
        'Single Sign-On (SSO)',
        'Manager dashboard',
      ],
      status: 'contact-us',
      buttonText: 'Consulta Enterprise',
      buttonVariant: 'btn-premium-gold-outline',
      link: '/contact', // Assuming a contact page exists
    },
    {
      icon: '🔗',
      title: 'API & Integraciones',
      description: 'Conecta nuestra plataforma con tus herramientas favoritas. API RESTful completa con webhooks y SDKs.',
      features: [
        'API RESTful completa',
        'Webhooks en tiempo real',
        'SDKs JavaScript/Python',
        'HubSpot, Salesforce, Zapier',
      ],
      status: 'contact-us',
      buttonText: 'Ver Documentación',
      buttonVariant: 'outline-info',
      link: '/docs', // Assuming a docs page exists
    },
    {
      icon: '🎨',
      title: 'Template Marketplace',
      description: 'Descubre plantillas premium creadas por diseñadores profesionales o vende tus propios diseños.',
      features: [
        'Plantillas premium exclusivas',
        'Diseños por profesionales',
        'Vende tus creaciones',
        'Comisiones del 70%',
      ],
      status: 'coming-soon',
      buttonText: 'Próximamente',
      buttonVariant: 'outline-light',
      comingSoonDate: 'Abril 2025',
    },
  ];
  
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
          background: linear-gradient(-45deg, #00c6ff, #0072ff, #8e2de2, #4a00e0);
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
          border: 2px solid rgba(0, 246, 255, 0.4);
          padding: 12px 24px;
          border-radius: 25px;
          color: #00f6ff;
          font-size: 1rem;
          font-weight: 700;
          backdrop-filter: blur(15px);
          box-shadow: 0 8px 32px rgba(0, 246, 255, 0.2);
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
        
        @media (min-width: 992px) {
          .hero-ctas {
            justify-content: flex-start;
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
          box-shadow: 0 12px 40px rgba(0, 246, 255, 0.3);
        }
        
        .cta-abduction-primary:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 20px 60px rgba(0, 246, 255, 0.5);
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
        
        /* Contenedor de nave espacial */
        .spaceship-container {
          position: relative;
          height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Animación de llegada de nave */
        .spaceship-arrival {
          position: absolute;
          top: 20%;
          right: 15%;
          z-index: 2;
        }
        
        .spaceship {
          font-size: 4rem;
          animation: spaceshipArrival 8s ease-in-out infinite;
          filter: drop-shadow(0 0 20px rgba(0, 246, 255, 0.8));
        }
        
        @keyframes spaceshipArrival {
          0% { transform: translateX(100px) translateY(-50px) rotate(10deg); opacity: 0.3; }
          25% { transform: translateX(0px) translateY(0px) rotate(0deg); opacity: 1; }
          50% { transform: translateX(-20px) translateY(10px) rotate(-5deg); opacity: 1; }
          75% { transform: translateX(10px) translateY(-5px) rotate(2deg); opacity: 1; }
          100% { transform: translateX(0px) translateY(0px) rotate(0deg); opacity: 1; }
        }
        
        /* Rayo de luz de abducción */
        .beam-light {
          position: absolute;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 200px;
          background: linear-gradient(to bottom, rgba(0, 246, 255, 0.8), rgba(0, 246, 255, 0));
          animation: beamPulse 3s ease-in-out infinite;
        }
        
        @keyframes beamPulse {
          0%, 100% { opacity: 0.3; width: 2px; }
          50% { opacity: 1; width: 8px; }
        }
        
        /* Holograma de tarjeta */
        .hologram-card {
          position: relative;
          z-index: 2;
        }
        
        .hologram-glow {
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          background: linear-gradient(135deg, #00f6ff, #0072ff, #8e2de2);
          border-radius: 24px;
          z-index: -1;
          opacity: 0.6;
          filter: blur(12px);
          animation: hologramGlow 4s ease-in-out infinite;
        }
        
        @keyframes hologramGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .card-hologram {
          width: 340px;
          height: 220px;
          background: linear-gradient(135deg, rgba(15, 12, 41, 0.9), rgba(48, 43, 99, 0.9));
          border-radius: 20px;
          padding: 24px;
          position: relative;
          animation: cardHologram 6s ease-in-out infinite;
          backdrop-filter: blur(20px);
          border: 2px solid rgba(0, 246, 255, 0.3);
        }
        
        @keyframes cardHologram {
          0%, 100% { transform: translateY(0px) rotateY(0deg); }
          25% { transform: translateY(-15px) rotateY(3deg); }
          50% { transform: translateY(-8px) rotateY(0deg); }
          75% { transform: translateY(-20px) rotateY(-3deg); }
        }
        
        .holo-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .profile-alien {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-right: 16px;
          border: 2px solid rgba(0, 246, 255, 0.5);
        }
        
        .profile-data h4 {
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0;
          color: #ffffff;
          font-family: 'Montserrat', sans-serif;
        }
        
        .profile-data p {
          font-size: 1rem;
          margin: 0;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .holo-features {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .feature-alien {
          display: flex;
          align-items: center;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.9);
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
          top: 30%;
          left: 8%;
          font-size: 2.2rem;
          animation: alienFloat1 5s ease-in-out infinite;
        }
        
        .alien-2 {
          top: 45%;
          right: 8%;
          font-size: 1.8rem;
          animation: alienFloat2 7s ease-in-out infinite;
          animation-delay: -2s;
        }
        
        .alien-3 {
          bottom: 25%;
          left: 20%;
          font-size: 2rem;
          animation: alienFloat3 6s ease-in-out infinite;
          animation-delay: -4s;
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
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .hero-intergalactico {
            padding: 2rem 1rem;
          }
          
          .min-vh-60 {
            min-height: 50vh;
          }
          
          .spaceship-container {
            height: 300px;
            margin-top: 1rem;
          }
          
          .card-hologram {
            width: 260px;
            height: 160px;
            padding: 16px;
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
            top: 25%;
            left: 5%;
          }
          
          .alien-2 {
            font-size: 1.5rem;
            top: 40%;
            right: 5%;
          }
          
          .alien-3 {
            font-size: 1.6rem;
            bottom: 20%;
            left: 15%;
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
        }
      `}</style>
      <div className="animated-gradient-background min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <Container fluid className="py-5">
          {/* Top-right navigation */}
          <Row className="justify-content-end mb-4">
            <Col xs="auto">
              <div className="d-flex flex-column flex-sm-row gap-2 align-items-center">
                {session ? (
                  <>
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                      <Link href="/pricing">
                        <Button size="sm" className="btn-premium-gold-outline px-3">
                          ⭐ Actualizar Plan
                        </Button>
                      </Link>
                      <Link href="/dashboard/cards">
                        <Button variant="outline-light" size="sm" className="px-3">
                          💼 Mis Tarjetas
                        </Button>
                      </Link>
                      <Button variant="outline-secondary" size="sm" onClick={() => signOut()} className="px-3">
                        👋 Salir
                      </Button>
                    </div>
                    <div className="text-white text-center mt-2 mt-sm-0">
                      <small>Hola, {session.user?.name?.split(' ')[0] || 'Usuario'}</small>
                    </div>
                  </>
                ) : (
                  <Button variant="outline-light" onClick={() => signIn('google')} className="px-4 py-2">
                    🚀 Iniciar Sesión con Google
                  </Button>
                )}
              </div>
            </Col>
          </Row>
          
          {/* HERO INTERGALÁCTICO */}
          <div className="hero-intergalactico">
            {/* Partículas espaciales de fondo */}
            <div className="space-particles">
              <div className="particle space-particle-1"></div>
              <div className="particle space-particle-2"></div>
              <div className="particle space-particle-3"></div>
              <div className="particle space-particle-4"></div>
              <div className="particle space-particle-5"></div>
              <div className="particle space-particle-6"></div>
            </div>
            
            <Row className="align-items-center min-vh-60">
              <Col lg={7}>
                <div className="hero-content text-center text-lg-start">
                  <div className="alien-badge mb-3">
                    <span className="badge-alien">👽 Diseños de Otro Mundo</span>
                  </div>
                  
                  <h1 className="hero-title-alien text-white mb-4">
                    Eleva tu Imagen Profesional
                    <br />
                    <span className="hero-highlight-alien">a Otro Nivel</span>
                  </h1>
                  
                  <p className="hero-subtitle-alien text-white opacity-90 mb-5">
                    Tecnología intergaláctica para crear tarjetas digitales, CVs y presentaciones 
                    que <strong>transportan tu profesionalismo</strong> más allá de este mundo
                  </p>
                  
                  {/* CTA de Abducción */}
                  <div className="hero-ctas mb-4">
                    <Button 
                      size="lg"
                      className="cta-abduction-primary mb-3"
                      onClick={handleDashboardAccess}
                    >
                      <span className="cta-icon">🛸</span>
                      Iniciar Abducción
                      <span className="cta-arrow">→</span>
                    </Button>
                  </div>
                  
                  {/* Transmisión desde la nave */}
                  <div className="transmission-status">
                    <small className="text-white opacity-75">
                      <span className="signal-indicator">📡</span>
                      Conectados con <strong>500+</strong> profesionales intergalácticos
                    </small>
                  </div>
                </div>
              </Col>
              
              <Col lg={5}>
                <div className="spaceship-container">
                  {/* Nave espacial animada */}
                  <div className="spaceship-arrival">
                    <div className="spaceship">🛸</div>
                    <div className="beam-light"></div>
                  </div>
                  
                  {/* Holograma de tarjeta flotante */}
                  <div className="hologram-card">
                    <div className="hologram-glow"></div>
                    <div className="card-hologram">
                      <div className="holo-header">
                        <div className="profile-alien">👽</div>
                        <div className="profile-data">
                          <h4>Profesional Intergaláctico</h4>
                          <p>Especialista en Networking</p>
                        </div>
                      </div>
                      <div className="holo-features">
                        <div className="feature-alien">✨ Efectos Glassmorphism</div>
                        <div className="feature-alien">🎨 Tipografía Estratégica</div>
                        <div className="feature-alien">⭐ Template Stellar</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Elementos decorativos alienígenas */}
                  <div className="alien-decorations">
                    <div className="decoration alien-1">🌌</div>
                    <div className="decoration alien-2">⭐</div>
                    <div className="decoration alien-3">🌟</div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* ¿Qué Puedes Hacer en Nuestra Plataforma? */}
          <Row className="justify-content-center mb-5">
            <Col lg={10} xl={8}>
              <div className="platform-capabilities text-center">
                <h2 className="text-white mb-5" style={{ fontSize: '2.5rem', fontWeight: '800' }}>
                  ¿Qué Puedes Hacer en Nuestra <span className="hero-highlight-alien">Plataforma</span>?
                </h2>
                
                <Row className="g-4">
                  <Col md={6} lg={3}>
                    <div className="capability-card">
                      <div className="capability-icon mb-3">
                        🛸
                      </div>
                      <h4 className="capability-title text-white mb-3">
                        Crear Tarjetas de Otro Mundo
                      </h4>
                      <p className="capability-description text-white opacity-85">
                        Diseña tarjetas digitales que transportan tu profesionalismo más allá de este planeta
                      </p>
                    </div>
                  </Col>
                  
                  <Col md={6} lg={3}>
                    <div className="capability-card">
                      <div className="capability-icon mb-3">
                        🚀
                      </div>
                      <h4 className="capability-title text-white mb-3">
                        Optimizar con Inteligencia Alienígena
                      </h4>
                      <p className="capability-description text-white opacity-85">
                        Transforma tu CV con algoritmos de otra dimensión para destacar en cualquier galaxia
                      </p>
                    </div>
                  </Col>
                  
                  <Col md={6} lg={3}>
                    <div className="capability-card">
                      <div className="capability-icon mb-3">
                        📡
                      </div>
                      <h4 className="capability-title text-white mb-3">
                        Crear Presentaciones Inmersivas
                      </h4>
                      <p className="capability-description text-white opacity-85">
                        Hipnotiza a tu audiencia con presentaciones que desafían las leyes de la física terrestre
                      </p>
                    </div>
                  </Col>
                  
                  <Col md={6} lg={3}>
                    <div className="capability-card">
                      <div className="capability-icon mb-3">
                        🌌
                      </div>
                      <h4 className="capability-title text-white mb-3">
                        Acceder al Ecosistema Completo
                      </h4>
                      <p className="capability-description text-white opacity-85">
                        Una plataforma integral donde tu identidad profesional evoluciona constantemente
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          {/* CTA Final */}
          <Row className="justify-content-center">
            <Col lg={8} xl={6}>
              <div className="final-cta text-center py-5">
                <h3 className="text-white mb-4" style={{ fontSize: '2rem', fontWeight: '700' }}>
                  ¿Listo para Transformar tu <span className="hero-highlight-alien">Networking</span>?
                </h3>
                <p className="text-white opacity-85 mb-4" style={{ fontSize: '1.1rem' }}>
                  Únete a cientos de profesionales que ya elevaron su presencia digital
                </p>
                <Button 
                  size="lg"
                  className="cta-final-button"
                  onClick={handleDashboardAccess}
                >
                  <span className="cta-icon">🚀</span>
                  Comenzar Gratis
                  <span className="cta-arrow">→</span>
                </Button>
              </div>
            </Col>
          </Row>

        </Container>
      </div>
    </>
  );
}
