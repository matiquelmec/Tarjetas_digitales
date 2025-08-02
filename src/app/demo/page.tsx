'use client';

import dynamic from 'next/dynamic';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';

const BusinessCard = dynamic(() => import('@/features/digital-card/components/BusinessCard'), {
  loading: () => <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
    <div className="hologram-loader">
      <div className="hologram-spinner"></div>
      <span className="loader-text">Materializando holograma...</span>
    </div>
  </div>,
  ssr: false
});

export default function DemoPage() {
  // Datos demo con template Ocean original
  const demoCardData = {
    name: 'Dr. María Elena Rodríguez',
    title: 'Especialista en Cardiología Clínica',
    about: 'Con más de 15 años de experiencia en cardiología clínica, me especializo en el diagnóstico y tratamiento de enfermedades cardiovasculares. Comprometida con brindar atención médica integral y de calidad a cada paciente.',
    location: 'Providencia, Santiago, Chile',
    whatsapp: '56987654321',
    email: 'dra.rodriguez@clinica.cl',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    
    // Template Ocean con gradientes azul oceánico
    template: 'ocean',
    cardBackgroundColor: 'linear-gradient(135deg, #006994 0%, #004d6b 50%, #003947 100%)', // Ocean gradient
    cardTextColor: '#ffffff',
    buttonSecondaryColor: '#00D4FF',
    buttonSecondaryHoverColor: '#00B8E6',
    buttonNormalBackgroundColor: '#1F1F1F',
    fontFamily: 'Montserrat',
    
    // Props requeridos adicionales
    whatsappShareUrl: 'https://wa.me/56987654321',
    appointmentLink: 'https://calendly.com/dra-rodriguez',
    professionalDetails: 'Especialista certificada en cardiología clínica con experiencia en procedimientos mínimamente invasivos.',
    linkedin: 'https://linkedin.com/in/maria-rodriguez-cardiologa',
    instagram: 'https://instagram.com/dra.rodriguez.cardio',
    twitter: '',
    facebook: '',
    
    // Todos los efectos premium activados
    enableHoverEffect: true,
    enableGlassmorphism: true,
    enableSubtleAnimations: true,
    enableBackgroundPatterns: true,
    enableParticles: true,
    particleType: 'floating' as 'floating' | 'constellation' | 'professional' | 'creative',
    particleCount: 50
  };

  return (
    <>
      <style jsx global>{`
        body {
          overflow-x: hidden;
        }
        
        .demo-gradient-background {
          background: linear-gradient(-45deg, #00c6ff, #0072ff, #8e2de2, #4a00e0, #006994, #003947);
          background-size: 600% 600%;
          animation: hypnoticGradientAnimation 20s ease infinite;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        
        .demo-gradient-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(0, 246, 255, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(142, 45, 226, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 40% 80%, rgba(0, 114, 255, 0.2) 0%, transparent 50%);
          animation: stellarMovement 25s ease-in-out infinite;
          pointer-events: none;
        }
        
        @keyframes hypnoticGradientAnimation {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes stellarMovement {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -20px) rotate(120deg); }
          66% { transform: translate(-20px, 30px) rotate(240deg); }
        }
        
        /* Partículas espaciales flotantes */
        .space-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .space-particle {
          position: absolute;
          color: rgba(0, 246, 255, 0.6);
          font-size: 1rem;
          animation: floatParticle 15s linear infinite;
        }
        
        .particle-1 { top: 10%; left: 10%; animation-delay: 0s; font-size: 1.2rem; }
        .particle-2 { top: 20%; left: 80%; animation-delay: -3s; font-size: 0.8rem; }
        .particle-3 { top: 60%; left: 15%; animation-delay: -6s; font-size: 1rem; }
        .particle-4 { top: 80%; left: 70%; animation-delay: -9s; font-size: 1.1rem; }
        .particle-5 { top: 40%; left: 90%; animation-delay: -12s; font-size: 0.9rem; }
        .particle-6 { top: 70%; left: 40%; animation-delay: -2s; font-size: 1.3rem; }
        
        @keyframes floatParticle {
          0% { 
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% { 
            transform: translateY(-100px) translateX(50px) rotate(360deg);
            opacity: 0;
          }
        }
        
        /* Loader holográfico mejorado */
        .hologram-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        .hologram-spinner {
          width: 60px;
          height: 60px;
          border: 3px solid transparent;
          border-top: 3px solid #00f6ff;
          border-right: 3px solid #8e2de2;
          border-radius: 50%;
          animation: hologramSpin 1.5s linear infinite;
          position: relative;
        }
        
        .hologram-spinner::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          border: 2px solid transparent;
          border-left: 2px solid #0072ff;
          border-bottom: 2px solid #4a00e0;
          border-radius: 50%;
          animation: hologramSpin 2s linear infinite reverse;
        }
        
        @keyframes hologramSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .loader-text {
          color: #00f6ff;
          font-weight: 600;
          font-size: 1rem;
          text-shadow: 0 0 10px rgba(0, 246, 255, 0.5);
          animation: textPulse 2s ease-in-out infinite;
        }
        
        @keyframes textPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        
        .demo-header {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.15), 
            rgba(255, 255, 255, 0.05));
          backdrop-filter: blur(25px);
          border-radius: 24px;
          padding: 3rem 2rem;
          margin-bottom: 3rem;
          border: 2px solid rgba(0, 246, 255, 0.3);
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 
            0 8px 32px rgba(0, 246, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        .demo-header::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, 
            transparent, #00f6ff, transparent, #8e2de2, transparent);
          background-size: 200% 200%;
          border-radius: inherit;
          z-index: -1;
          opacity: 0.6;
          animation: holographicBorder 4s linear infinite;
        }
        
        @keyframes holographicBorder {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        
        .demo-title {
          color: #ffffff;
          font-size: 2.8rem;
          font-weight: 900;
          text-shadow: 
            0 0 20px rgba(0, 246, 255, 0.8),
            0 0 40px rgba(0, 246, 255, 0.6),
            0 0 80px rgba(0, 246, 255, 0.4);
          animation: hypnoticTitlePulse 4s ease-in-out infinite;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #ffffff, #00f6ff, #ffffff);
          background-size: 200% 200%;
          animation: hypnoticTitlePulse 4s ease-in-out infinite,
                     titleGradientShift 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        @keyframes hypnoticTitlePulse {
          0%, 100% { 
            text-shadow: 
              0 0 20px rgba(0, 246, 255, 0.8),
              0 0 40px rgba(0, 246, 255, 0.6),
              0 0 80px rgba(0, 246, 255, 0.4);
            transform: scale(1);
          }
          50% { 
            text-shadow: 
              0 0 30px rgba(0, 246, 255, 1),
              0 0 60px rgba(0, 246, 255, 0.8),
              0 0 120px rgba(0, 246, 255, 0.6);
            transform: scale(1.02);
          }
        }
        
        @keyframes titleGradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .demo-subtitle {
          color: rgba(255, 255, 255, 0.95);
          font-size: 1.3rem;
          margin-bottom: 2rem;
          font-weight: 500;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .demo-card-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
          padding: 3rem 0;
          position: relative;
        }
        
        /* Holograma contenedor de la tarjeta */
        .hologram-card-wrapper {
          position: relative;
          transform-style: preserve-3d;
          animation: hologramFloat 6s ease-in-out infinite;
        }
        
        @keyframes hologramFloat {
          0%, 100% { 
            transform: translateY(0px) rotateX(0deg) rotateY(0deg);
          }
          25% { 
            transform: translateY(-10px) rotateX(2deg) rotateY(1deg);
          }
          50% { 
            transform: translateY(-5px) rotateX(0deg) rotateY(-1deg);
          }
          75% { 
            transform: translateY(-15px) rotateX(-1deg) rotateY(0.5deg);
          }
        }
        
        .hologram-card-wrapper::before {
          content: '';
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          background: conic-gradient(from 0deg, 
            transparent, 
            rgba(0, 246, 255, 0.4), 
            transparent, 
            rgba(142, 45, 226, 0.4), 
            transparent);
          border-radius: 30px;
          z-index: -1;
          animation: hologramSpin 8s linear infinite;
          filter: blur(2px);
        }
        
        .hologram-card-wrapper::after {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: linear-gradient(45deg, 
            rgba(0, 246, 255, 0.1), 
            transparent, 
            rgba(142, 45, 226, 0.1));
          border-radius: 25px;
          z-index: -1;
          animation: hologramSpin 6s linear infinite reverse;
        }
        
        .demo-cta {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.15), 
            rgba(255, 255, 255, 0.05));
          backdrop-filter: blur(20px);
          border: 2px solid rgba(0, 246, 255, 0.4);
          border-radius: 24px;
          padding: 3rem 2rem;
          text-align: center;
          margin-top: 4rem;
          position: relative;
          overflow: hidden;
          box-shadow: 
            0 15px 45px rgba(0, 246, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        .demo-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(0, 246, 255, 0.1), 
            transparent);
          animation: ctaScanline 3s ease-in-out infinite;
        }
        
        @keyframes ctaScanline {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        .demo-btn-create {
          background: linear-gradient(135deg, #00D4FF, #006994);
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.2rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 212, 255, 0.4);
          margin: 0.5rem;
        }
        
        .demo-btn-create:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 12px 48px rgba(0, 212, 255, 0.6);
          background: linear-gradient(135deg, #00B8E6, #005580);
        }
        
        .demo-btn-back {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 0.75rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          margin: 0.5rem;
        }
        
        .demo-btn-back:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }
        
        .demo-badge {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(0, 212, 255, 0.9);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
          z-index: 1000;
          animation: demoBadgePulse 2s ease-in-out infinite;
        }
        
        @keyframes demoBadgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @media (max-width: 768px) {
          .demo-header {
            padding: 2rem 1.5rem;
            margin-bottom: 2rem;
          }
          
          .demo-title {
            font-size: 2rem;
            line-height: 1.2;
          }
          
          .demo-subtitle {
            font-size: 1.1rem;
            line-height: 1.4;
          }
          
          .demo-card-container {
            padding: 2rem 0;
            min-height: 60vh;
          }
          
          .hologram-card-wrapper {
            max-width: 90% !important;
          }
          
          .demo-cta {
            padding: 2rem 1.5rem;
            margin-top: 3rem;
          }
          
          .demo-cta h3 {
            font-size: 1.6rem !important;
            line-height: 1.3 !important;
          }
          
          .demo-cta p {
            font-size: 1rem !important;
            line-height: 1.5 !important;
          }
          
          .demo-btn-create {
            font-size: 0.95rem;
            padding: 1rem 2rem;
            width: 100%;
            max-width: 280px;
          }
          
          .demo-btn-back {
            font-size: 0.9rem;
            padding: 0.875rem 1.5rem;
            width: 100%;
            max-width: 250px;
          }
          
          .demo-badge {
            top: 15px;
            right: 15px;
            font-size: 0.75rem;
            padding: 0.5rem 1rem;
          }
          
          .space-particles {
            display: none; /* Ocultar partículas en móvil para mejor performance */
          }
          
          .hologram-card-wrapper::before,
          .hologram-card-wrapper::after {
            animation-duration: 12s; /* Animaciones más lentas en móvil */
          }
        }
        
        @media (max-width: 576px) {
          .demo-header {
            padding: 1.5rem 1rem;
          }
          
          .demo-title {
            font-size: 1.7rem;
          }
          
          .demo-subtitle {
            font-size: 1rem;
          }
          
          .demo-card-container {
            padding: 1.5rem 0;
            min-height: 50vh;
          }
          
          .demo-cta {
            padding: 1.5rem 1rem;
          }
          
          .demo-cta h3 {
            font-size: 1.4rem !important;
          }
          
          .demo-cta p {
            font-size: 0.95rem !important;
          }
          
          .demo-btn-create,
          .demo-btn-back {
            font-size: 0.9rem;
            padding: 0.875rem 1.5rem;
          }
        }
      `}</style>
      
      {/* Badge flotante indicando que es demo */}
      <div className="demo-badge">
        🔮 DEMO INTERGALÁCTICO
      </div>
      
      <div className="demo-gradient-background">
        {/* Partículas espaciales flotantes */}
        <div className="space-particles">
          <span className="space-particle particle-1">✨</span>
          <span className="space-particle particle-2">🌟</span>
          <span className="space-particle particle-3">⭐</span>
          <span className="space-particle particle-4">💫</span>
          <span className="space-particle particle-5">🔮</span>
          <span className="space-particle particle-6">✦</span>
        </div>
        
        <Container className="py-4" style={{ position: 'relative', zIndex: 2 }}>
          {/* Header */}
          <div className="demo-header">
            <h1 className="demo-title">
              🔮 Holograma Demo Intergaláctico
            </h1>
            <p className="demo-subtitle">
              Experiencia inmersiva de tarjeta digital con tecnología alienígena premium
            </p>
          </div>
          
          {/* Tarjeta Demo */}
          <Row>
            <Col>
              <div className="demo-card-container">
                <div className="hologram-card-wrapper" style={{ maxWidth: '480px', width: '100%' }}>
                  <BusinessCard
                    key={`demo-ocean-${demoCardData.template}`}
                    name={demoCardData.name}
                    title={demoCardData.title}
                    about={demoCardData.about}
                    location={demoCardData.location}
                    whatsapp={demoCardData.whatsapp}
                    email={demoCardData.email}
                    photoUrl={demoCardData.photoUrl}
                    cardBackgroundColor={demoCardData.cardBackgroundColor}
                    cardTextColor={demoCardData.cardTextColor}
                    whatsappShareUrl={demoCardData.whatsappShareUrl}
                    appointmentLink={demoCardData.appointmentLink}
                    professionalDetails={demoCardData.professionalDetails}
                    linkedin={demoCardData.linkedin}
                    instagram={demoCardData.instagram}
                    twitter={demoCardData.twitter}
                    facebook={demoCardData.facebook}
                    enableHoverEffect={demoCardData.enableHoverEffect}
                    enableGlassmorphism={demoCardData.enableGlassmorphism}
                    enableSubtleAnimations={demoCardData.enableSubtleAnimations}
                    enableBackgroundPatterns={demoCardData.enableBackgroundPatterns}
                    enableParticles={demoCardData.enableParticles}
                    particleType={demoCardData.particleType}
                    particleCount={demoCardData.particleCount}
                    template={demoCardData.template}
                    fontFamily={demoCardData.fontFamily}
                    buttonSecondaryColor={demoCardData.buttonSecondaryColor}
                    buttonSecondaryHoverColor={demoCardData.buttonSecondaryHoverColor}
                    buttonNormalBackgroundColor={demoCardData.buttonNormalBackgroundColor}
                  />
                </div>
              </div>
            </Col>
          </Row>
          
          {/* CTA Section */}
          <Row>
            <Col>
              <div className="demo-cta">
                <h3 className="text-white mb-4" style={{ 
                  fontSize: '2.2rem', 
                  fontWeight: '800',
                  textShadow: '0 0 20px rgba(0, 246, 255, 0.6)',
                  position: 'relative',
                  zIndex: 2
                }}>
                  ¿Listo para Materializar tu <span style={{ 
                    color: '#00f6ff',
                    textShadow: '0 0 30px rgba(0, 246, 255, 0.8)'
                  }}>Holograma Digital</span>?
                </h3>
                <p className="text-white mb-5" style={{ 
                  fontSize: '1.2rem',
                  fontWeight: '500',
                  opacity: '0.95',
                  position: 'relative',
                  zIndex: 2,
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}>
                  Inicia tu transmisión intergaláctica y crea una tarjeta digital que fascine a toda tu red de contactos
                </p>
                <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-4" style={{ position: 'relative', zIndex: 2 }}>
                  <Link href="/create">
                    <Button className="demo-btn-create">
                      🛸 Materializar Mi Holograma
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline-light" className="demo-btn-back">
                      ← Regresar a Base Espacial
                    </Button>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}