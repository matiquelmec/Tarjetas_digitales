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
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .hero-content h2 {
            font-size: 2.2rem !important;
          }
          
          .cta-hero {
            font-size: 1.1rem !important;
            padding: 1rem 2rem !important;
          }
          
          .future-services {
            margin-top: 2rem;
          }
          
          .future-item {
            margin-bottom: 1rem;
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
          
          {/* New Centered Hero Section */}
          <Row className="justify-content-center text-center mb-5">
            <Col lg={10} xl={8}>
              <div className="hero-content">
                <Image src="/logo.png" alt="Indi Logo" width={150} height={150} priority />
                <h1 className="text-white fw-light" style={{ fontSize: '4.5rem', textTransform: 'lowercase', letterSpacing: '1px', marginTop: '-10px' }}>
                  indi
                </h1>
                <p className="lead text-white mt-3 mb-4 opacity-90" style={{ fontSize: '1.3rem', fontWeight: '400' }}>
                  Eleva tu identidad digital. Profesionalismo al siguiente nivel.
                </p>
                
                {/* CTA Principal Gigante */}
                <div className="mb-4">
                  <Button 
                    size="lg"
                    className="cta-hero px-5 py-3"
                    onClick={handleDashboardAccess}
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #00F6FF, #0072ff)',
                      border: 'none',
                      color: '#ffffff',
                      boxShadow: '0 8px 32px rgba(0, 246, 255, 0.3)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    🚀 Crear Mi Tarjeta Gratis
                  </Button>
                </div>
                
                {/* Social Proof Simple */}
                <div className="social-proof-mini">
                  <small className="text-white opacity-75">
                    ✨ Únete a cientos de profesionales que ya digitalizaron su networking
                  </small>
                </div>
              </div>
            </Col>
          </Row>

          {/* Servicio Principal - Tarjetas Digitales */}
          <Row className="justify-content-center mb-5">
            <Col lg={8} xl={6}>
              <Card className="glass-card text-white main-service-card">
                <Card.Body className="p-4 text-center">
                  <div className="service-icon mb-3" style={{ fontSize: '3rem' }}>
                    💼
                  </div>
                  <Card.Title as="h3" className="mb-3 fw-bold" style={{ fontSize: '1.8rem' }}>
                    Tarjetas Digitales Premium
                  </Card.Title>
                  <Card.Text className="mb-4 opacity-90" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                    Diseña tarjetas profesionales con efectos visuales únicos, QR integrado y compartir instantáneo
                  </Card.Text>
                  
                  {/* Features destacadas */}
                  <div className="features-grid mb-4">
                    <Row className="g-3">
                      <Col sm={6}>
                        <div className="feature-item">
                          <small className="text-white opacity-75">
                            ✨ Editor visual en tiempo real
                          </small>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="feature-item">
                          <small className="text-white opacity-75">
                            🎨 Efectos glassmorphism
                          </small>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="feature-item">
                          <small className="text-white opacity-75">
                            📊 Analytics de interacción
                          </small>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="feature-item">
                          <small className="text-white opacity-75">
                            📱 URLs personalizadas
                          </small>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  
                  <Button 
                    className="btn-cta-secondary px-4 py-2"
                    onClick={handleDashboardAccess}
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      borderRadius: '12px',
                      background: 'rgba(0, 246, 255, 0.2)',
                      border: '2px solid #00F6FF',
                      color: '#00F6FF'
                    }}
                  >
                    ✨ Comenzar Ahora - Es Gratis
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Servicios Futuros - Colapsados */}
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="future-services text-center">
                <h4 className="text-white mb-4 opacity-75">Próximamente en nuestra plataforma</h4>
                <div className="d-flex gap-4 justify-content-center flex-wrap">
                  <div className="future-item">
                    <span className="future-icon">🚀</span>
                    <small className="text-white opacity-60 d-block">CVs Inteligentes</small>
                    <small className="text-white opacity-40">Feb 2025</small>
                  </div>
                  <div className="future-item">
                    <span className="future-icon">🎯</span>
                    <small className="text-white opacity-60 d-block">Presentaciones</small>
                    <small className="text-white opacity-40">Mar 2025</small>
                  </div>
                  <div className="future-item">
                    <span className="future-icon">🎨</span>
                    <small className="text-white opacity-60 d-block">Template Store</small>
                    <small className="text-white opacity-40">Abr 2025</small>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

        </Container>
      </div>
    </>
  );
}
