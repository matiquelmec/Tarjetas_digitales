'use client';

import { Container, Row, Col, Button, Card } from 'react-bootstrap';
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
      link: '/create',
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
      `}</style>
      <div className="animated-gradient-background min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <Container fluid className="py-5">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center mb-4 gap-3">
            <h1 className="display-6 display-lg-4 fw-bold text-center text-lg-start" style={{ color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              Plataforma Digital Profesional
            </h1>
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
          </div>
          {/* Hero Section */}
          <Row className="justify-content-center text-center mb-5">
            <Col lg={8}>
              <p className="lead text-white mb-4" style={{ fontSize: '1.2rem', fontWeight: '300' }}>
                Transforma tu identidad profesional en una experiencia digital hipnotizante en menos de 5 minutos
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <span className="badge bg-light text-dark px-3 py-2">✨ Editor Visual en Tiempo Real</span>
                <span className="badge bg-light text-dark px-3 py-2">🎨 Sugerencias AI-Powered</span>
                <span className="badge bg-light text-dark px-3 py-2">📱 Mobile-First</span>
                <span className="badge bg-light text-dark px-3 py-2">📊 Analytics Avanzados</span>
              </div>
            </Col>
          </Row>

          {/* Services Grid */}
          <Row className="justify-content-center text-center w-100">
            {services.map((service, index) => (
              <Col key={index} lg={4} md={6} className="mb-4">
                <Card className="h-100 glass-card text-white">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <div className="mb-3">
                        <span style={{ fontSize: '3rem' }}>{service.icon}</span>
                      </div>
                      <Card.Title className="h4 mb-3">{service.title}</Card.Title>
                      <Card.Text className="mb-4">
                        {service.description}
                      </Card.Text>
                      <div className="mb-3">
                        <small className="text-white opacity-75">
                          {service.features.map((feature, idx) => (
                            <span key={idx}>✓ {feature}<br/></span>
                          ))}
                        </small>
                      </div>
                    </div>
                    <div>
                      {service.status === 'available' && service.link === '/create' ? (
                        <a 
                          href={service.link}
                          style={{ 
                            textDecoration: 'none',
                            display: 'block',
                            width: '100%'
                          }}
                          onClick={handleCreateCard}
                        >
                          <Button 
                            variant={service.buttonVariant} 
                            className="btn-modern w-100"
                            type="button"
                            as="div"
                          >
                            {service.buttonText}
                          </Button>
                        </a>
                      ) : (
                        <Button 
                          variant={service.buttonVariant.startsWith('btn-') ? undefined : service.buttonVariant}
                          className={`w-100 ${service.buttonVariant.startsWith('btn-') ? service.buttonVariant : ''}`} 
                          disabled={service.status === 'coming-soon'}
                          href={service.link || undefined}
                          target={service.link ? "_blank" : undefined}
                          rel={service.link ? "noopener noreferrer" : undefined}
                        >
                          {service.buttonText} {service.comingSoonDate && `- ${service.comingSoonDate}`}
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* CTA Section */}
          <Row className="justify-content-center text-center mt-5">
            <Col lg={8}>
              <div className="glass-card p-4">
                <h3 className="text-white mb-3">🎯 Transforma tu networking profesional en 5 minutos</h3>
                <p className="text-white opacity-75 mb-4">
                  Únete a más de 10,000 profesionales que ya utilizan nuestra plataforma para destacar y generar más oportunidades de negocio.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  {session ? (
                    <>
                      <Button variant="primary" size="lg" href="/create">
                        ✨ Crear Mi Primera Tarjeta
                      </Button>
                      <Button variant="outline-light" size="lg" href="/dashboard">
                        📊 Ver Mi Panel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="primary" size="lg" onClick={handleCreateCard}>
                        🚀 Crear Mi Tarjeta Gratis
                      </Button>
                      <Button variant="outline-light" size="lg" href="/pricing">
                        💰 Ver Planes Premium
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
