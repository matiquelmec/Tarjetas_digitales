'use client';

import dynamic from 'next/dynamic';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';

const BusinessCard = dynamic(() => import('@/features/digital-card/components/BusinessCard'), {
  loading: () => <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
    <div className="spinner-border text-light" role="status">
      <span className="visually-hidden">Cargando holograma demo...</span>
    </div>
  </div>,
  ssr: false
});

export default function DemoPage() {
  // Datos demo con template Ocean
  const demoCardData = {
    name: 'Dr. María Elena Rodríguez',
    title: 'Especialista en Cardiología Clínica',
    about: 'Con más de 15 años de experiencia en cardiología clínica, me especializo en el diagnóstico y tratamiento de enfermedades cardiovasculares. Comprometida con brindar atención médica integral y de calidad a cada paciente.',
    company: 'Hospital Clínico Universidad de Chile',
    email: 'dra.rodriguez@clinica.cl',
    phone: '+56 9 8765 4321',
    location: 'Providencia, Santiago, Chile',
    whatsapp: '56987654321',
    
    // Template Ocean con gradientes azul oceánico
    template: 'ocean',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    cardBackgroundColor: 'linear-gradient(135deg, #006994 0%, #004d6b 50%, #003947 100%)', // Ocean gradient
    cardTextColor: '#ffffff',
    buttonSecondaryColor: '#00D4FF',
    buttonSecondaryHoverColor: '#00B8E6',
    buttonNormalBackgroundColor: '#1F1F1F',
    fontFamily: 'Montserrat',
    
    // Todos los efectos premium activados
    enableHoverEffect: true,
    enableGlassmorphism: true,
    enableSubtleAnimations: true,
    enableBackgroundPatterns: true,
    enableParticles: true,
    particleType: 'floating',
    particleCount: 50
  };

  return (
    <>
      <style jsx global>{`
        .demo-gradient-background {
          background: linear-gradient(-45deg, #006994, #004d6b, #003947, #002633);
          background-size: 400% 400%;
          animation: oceanGradientAnimation 15s ease infinite;
          min-height: 100vh;
        }
        
        @keyframes oceanGradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .demo-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
        }
        
        .demo-title {
          color: #ffffff;
          text-shadow: 
            0 0 10px rgba(0, 212, 255, 0.8),
            0 0 20px rgba(0, 212, 255, 0.6),
            0 0 40px rgba(0, 212, 255, 0.4);
          animation: oceanTitlePulse 3s ease-in-out infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes oceanTitlePulse {
          0%, 100% { 
            text-shadow: 
              0 0 10px rgba(0, 212, 255, 0.8),
              0 0 20px rgba(0, 212, 255, 0.6),
              0 0 40px rgba(0, 212, 255, 0.4);
          }
          50% { 
            text-shadow: 
              0 0 15px rgba(0, 212, 255, 1),
              0 0 30px rgba(0, 212, 255, 0.8),
              0 0 50px rgba(0, 212, 255, 0.6);
          }
        }
        
        .demo-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }
        
        .demo-card-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          padding: 2rem 0;
        }
        
        .demo-cta {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          margin-top: 3rem;
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
            padding: 1.5rem;
          }
          
          .demo-title {
            font-size: 1.8rem;
          }
          
          .demo-subtitle {
            font-size: 1rem;
          }
          
          .demo-card-container {
            padding: 1rem 0;
            min-height: 50vh;
          }
          
          .demo-cta {
            padding: 1.5rem;
          }
          
          .demo-btn-create {
            font-size: 1rem;
            padding: 0.875rem 2rem;
          }
          
          .demo-badge {
            top: 10px;
            right: 10px;
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
          }
        }
      `}</style>
      
      {/* Badge flotante indicando que es demo */}
      <div className="demo-badge">
        🔮 DEMO INTERGALÁCTICO
      </div>
      
      <div className="demo-gradient-background">
        <Container className="py-4">
          {/* Header */}
          <div className="demo-header">
            <h1 className="demo-title">
              🌊 Experiencia Demo Ocean
            </h1>
            <p className="demo-subtitle">
              Así se ve una tarjeta digital profesional con nuestro template Ocean premium
            </p>
          </div>
          
          {/* Tarjeta Demo */}
          <Row>
            <Col>
              <div className="demo-card-container">
                <div style={{ maxWidth: '480px', width: '100%' }}>
                  <BusinessCard
                    key={`demo-ocean-${demoCardData.template}`}
                    name={demoCardData.name}
                    title={demoCardData.title}
                    about={demoCardData.about}
                    location={demoCardData.location}
                    whatsapp={demoCardData.whatsapp}
                    email={demoCardData.email}
                    photoUrl={demoCardData.photo}
                    cardBackgroundColor={demoCardData.cardBackgroundColor}
                    cardTextColor={demoCardData.cardTextColor}
                    enableHoverEffect={demoCardData.enableHoverEffect}
                    enableGlassmorphism={demoCardData.enableGlassmorphism}
                    enableSubtleAnimations={demoCardData.enableSubtleAnimations}
                    enableBackgroundPatterns={demoCardData.enableBackgroundPatterns}
                    enableParticles={demoCardData.enableParticles}
                    particleType={demoCardData.particleType}
                    particleCount={demoCardData.particleCount}
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
                <h3 className="text-white mb-3" style={{ fontSize: '1.8rem', fontWeight: '700' }}>
                  ¿Listo para Crear tu Propia <span style={{ color: '#00D4FF' }}>Tarjeta Ocean</span>?
                </h3>
                <p className="text-white opacity-90 mb-4" style={{ fontSize: '1.1rem' }}>
                  Inicia tu misión intergaláctica y crea una tarjeta digital que impresione a tus contactos
                </p>
                <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3">
                  <Link href="/create">
                    <Button className="demo-btn-create">
                      🚀 Crear Mi Tarjeta Intergaláctica
                    </Button>
                  </Link>
                  <Link href="/dashboard/cards">
                    <Button variant="outline-light" className="demo-btn-back">
                      ← Volver a Flota
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