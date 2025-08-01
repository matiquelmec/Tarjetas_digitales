'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthWrapper } from '../../components/AuthWrapper';
import { usePostLoginRedirect } from '@/hooks/usePostLoginRedirect';

interface CardData {
  id: string;
  title: string;
  name: string;
  profession: string;
  views: number;
  clicks: number;
  isActive: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [planLimits, setPlanLimits] = useState<any>(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  
  // Handle post-login redirection
  usePostLoginRedirect();

  useEffect(() => {
    if (session?.user?.id) {
      fetchCards();
      fetchPlanLimits();
      
      // Check if user came here with a specific intention
      const dashboardAction = sessionStorage.getItem('dashboardAction');
      if (dashboardAction) {
        sessionStorage.removeItem('dashboardAction');
        handleUserIntention(dashboardAction);
      }
    }
  }, [session]);

  const handleUserIntention = (intention: string) => {
    switch (intention) {
      case 'createCard':
        setWelcomeMessage('¡Perfecto! Aquí puedes crear tu nueva tarjeta digital. Haz clic en "Crear Nueva Tarjeta" para comenzar.');
        setShowWelcomeMessage(true);
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
          setShowWelcomeMessage(false);
        }, 5000);
        
        // Highlight the create button
        setTimeout(() => {
          const createButton = document.querySelector('[href="/create"]') as HTMLElement;
          if (createButton) {
            createButton.style.animation = 'pulse 2s';
          }
        }, 1000);
        break;
      case 'accessDashboard':
        setWelcomeMessage('¡Bienvenido a tu dashboard! Desde aquí puedes gestionar todas tus tarjetas digitales, ver estadísticas y crear nuevas.');
        setShowWelcomeMessage(true);
        
        // Auto-hide message after 6 seconds (un poco más tiempo para leer)
        setTimeout(() => {
          setShowWelcomeMessage(false);
        }, 6000);
        break;
      default:
        // Keep default overview tab
        break;
    }
  };

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/cards', {
        credentials: 'same-origin'
      });
      if (response.ok) {
        const data = await response.json();
        setCards(data);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanLimits = async () => {
    try {
      const response = await fetch('/api/user/plan-limits', {
        credentials: 'same-origin'
      });
      if (response.ok) {
        const data = await response.json();
        setPlanLimits(data);
      }
    } catch (error) {
      console.error('Error fetching plan limits:', error);
    }
  };

  return (
    <AuthWrapper>
      <style jsx global>{`
        body {
          background: linear-gradient(-45deg, #00c6ff, #0072ff, #8e2de2, #4a00e0);
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
          min-height: 100vh;
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .animated-gradient-background {
          background: linear-gradient(-45deg, #00c6ff, #0072ff, #8e2de2, #4a00e0);
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
          min-height: 100vh;
        }
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.5);
        }
        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          height: 100%;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
        }
        .nav-pills .nav-link {
          border-radius: 12px;
          margin: 0 4px;
          transition: all 0.3s ease;
          color: #64748b !important;
          font-weight: 500;
        }
        .nav-pills .nav-link.active {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
          color: white !important;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
        }
        .nav-pills .nav-link:hover {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6 !important;
        }
        .action-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          height: 100%;
        }
        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
          border-color: #3b82f6;
        }
        .header-content {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 2rem;
        }
        .primary-gradient {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }
        .success-gradient {
          background: linear-gradient(135deg, #10b981, #059669);
        }
        .warning-gradient {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }
        .info-gradient {
          background: linear-gradient(135deg, #06b6d4, #0891b2);
        }
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }

        /* Dashboard Header Simplificado */
        .dashboard-header-minimal {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dashboard-welcome {
          position: relative;
          z-index: 2;
        }

        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
          font-family: 'Montserrat', sans-serif;
        }

        .dashboard-subtitle {
          font-size: 1.1rem;
          margin: 0;
        }

        .user-highlight {
          color: #00f6ff;
          font-weight: 600;
        }

        /* Quick Stats Bar Compacto */
        .quick-stats-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1.5rem;
          height: 100%;
        }

        .stat-compact {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }

        .stat-label-compact {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 4px;
        }

        .stat-divider-compact {
          color: rgba(255, 255, 255, 0.3);
          font-size: 1.5rem;
        }

        .plan-badge {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.9rem;
        }

        /* Responsive */
        @media (max-width: 991px) {
          .dashboard-header-minimal {
            padding: 1.5rem 1rem;
          }
          
          .dashboard-title {
            font-size: 1.8rem;
          }
          
          .quick-stats-bar {
            justify-content: center;
            margin-top: 1rem;
          }
          
          .stat-value {
            font-size: 1.4rem;
          }
        }
      `}</style>
      <div className="animated-gradient-background">
        <Container className="py-5">
          {/* Header Simplificado del Dashboard */}
          <div className="dashboard-header-minimal">
            <Row className="align-items-center">
              <Col lg={8}>
                <div className="dashboard-welcome">
                  <h1 className="dashboard-title text-white mb-2">
                    Panel de Control
                  </h1>
                  <p className="dashboard-subtitle text-white opacity-75">
                    Bienvenido de vuelta, <span className="user-highlight">{session?.user?.name?.split(' ')[0] || 'Usuario'}</span>
                  </p>
                </div>
              </Col>
              <Col lg={4}>
                <div className="quick-stats-bar">
                  <div className="stat-compact">
                    <span className="stat-value">{cards.length}</span>
                    <span className="stat-label-compact">Tarjetas</span>
                  </div>
                  <div className="stat-divider-compact">|</div>
                  <div className="stat-compact">
                    <span className="stat-value">{cards.reduce((sum, card) => sum + card.views, 0)}</span>
                    <span className="stat-label-compact">Vistas</span>
                  </div>
                  <div className="stat-divider-compact">|</div>
                  <div className="stat-compact">
                    <span className="stat-value plan-badge">{session?.user?.plan || 'FREE'}</span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Navigation Tabs */}
          <Row className="mb-5">
            <Col>
              <Card className="glass-card border-0">
                <Card.Body className="p-3">
                  <div className="d-block d-lg-none mb-3">
                    {/* Mobile: Dropdown navigation */}
                    <div className="dropdown">
                      <button 
                        className="btn btn-outline-light dropdown-toggle w-100 text-start" 
                        type="button" 
                        data-bs-toggle="dropdown"
                      >
                        {pathname === '/dashboard' && '📊 Resumen General'}
                        {pathname === '/dashboard/cards' && '💼 Mis Tarjetas'}
                        {pathname === '/dashboard/cv' && '🚀 CVs Inteligentes'}
                      </button>
                      <ul className="dropdown-menu w-100">
                        <li><Link href="/dashboard" className="dropdown-item">📊 Resumen General</Link></li>
                        <li><Link href="/dashboard/cards" className="dropdown-item">💼 Mis Tarjetas</Link></li>
                        <li><Link href="/dashboard/cv" className="dropdown-item">🚀 CVs Inteligentes</Link></li>
                        <li><span className="dropdown-item text-muted">🎯 Presentaciones (Próximamente)</span></li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Desktop: Tab navigation */}
                  <Nav variant="pills" className="nav-fill d-none d-lg-flex">
                    <Nav.Item className="px-1">
                      <Link href="/dashboard" passHref legacyBehavior>
                        <Nav.Link 
                          active={pathname === '/dashboard'} 
                          className={`border-0 py-3 fw-semibold ${pathname === '/dashboard' ? 'active' : ''}`}
                        >
                          📊 Resumen General
                        </Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className="px-1">
                      <Link href="/dashboard/cards" passHref legacyBehavior>
                        <Nav.Link 
                          active={pathname === '/dashboard/cards'} 
                          className={`border-0 py-3 fw-semibold ${pathname === '/dashboard/cards' ? 'active' : ''}`}
                        >
                          💼 Mis Tarjetas
                        </Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className="px-1">
                      <Link href="/dashboard/cv" passHref legacyBehavior>
                        <Nav.Link 
                          active={pathname === '/dashboard/cv'} 
                          className={`border-0 py-3 fw-semibold ${pathname === '/dashboard/cv' ? 'active' : ''}`}
                        >
                          🚀 CVs Inteligentes
                        </Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className="px-1">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Disponible en Marzo 2025. Crea presentaciones cinematográficas con IA.</Tooltip>}
                      >
                        <div>
                          <Nav.Link 
                            href="#"
                            className="border-0 py-3 text-muted"
                            style={{ cursor: 'not-allowed' }}
                          >
                            🎯 Presentaciones
                            <br />
                            <small className="text-muted">(Próximamente)</small>
                          </Nav.Link>
                        </div>
                      </OverlayTrigger>
                    </Nav.Item>
                  </Nav>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Tab Content */}
          {pathname === '/dashboard' && (
            <>
              {/* Stats Overview */}
              <Row className="mb-5 g-4">
                <Col md={6} lg={3}>
                  <div className="stat-card">
                    <div className="icon-wrapper primary-gradient text-white">
                      💼
                    </div>
                    <h2 className="fw-bold text-dark mb-1">{cards.length}</h2>
                    <p className="text-muted mb-2">Tarjetas Creadas</p>
                    <div className="d-flex justify-content-center">
                      <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold">
                        Activas: {cards.filter(card => card.isActive).length}
                      </span>
                    </div>
                  </div>
                </Col>
                <Col md={6} lg={3}>
                  <div className="stat-card">
                    <div className="icon-wrapper success-gradient text-white">
                      👁️
                    </div>
                    <h2 className="fw-bold text-dark mb-1">{cards.reduce((sum, card) => sum + card.views, 0)}</h2>
                    <p className="text-muted mb-2">Visualizaciones</p>
                    <div className="d-flex justify-content-center">
                      <span className="badge bg-success bg-opacity-10 text-success fw-semibold">
                        Este mes
                      </span>
                    </div>
                  </div>
                </Col>
                <Col md={6} lg={3}>
                  <div className="stat-card">
                    <div className="icon-wrapper warning-gradient text-white">
                      🚀
                    </div>
                    <h2 className="fw-bold text-muted mb-1">0</h2>
                    <p className="text-muted mb-2">CVs Optimizados</p>
                    <div className="d-flex justify-content-center">
                      <span className="badge bg-warning bg-opacity-10 text-warning fw-semibold">
                        Feb 2025
                      </span>
                    </div>
                  </div>
                </Col>
                <Col md={6} lg={3}>
                  <div className="stat-card">
                    <div className="icon-wrapper info-gradient text-white">
                      🎯
                    </div>
                    <h2 className="fw-bold text-muted mb-1">0</h2>
                    <p className="text-muted mb-2">Presentaciones</p>
                    <div className="d-flex justify-content-center">
                      <span className="badge bg-info bg-opacity-10 text-info fw-semibold">
                        Mar 2025
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Quick Actions */}
              <Row className="mb-5">
                <Col>
                  <div className="glass-card border-0">
                    <div className="p-4">
                      <div className="d-flex align-items-center mb-4">
                        <div className="icon-wrapper primary-gradient text-white me-3" style={{ width: '48px', height: '48px' }}>
                          🚀
                        </div>
                        <div>
                          <h4 className="fw-bold text-dark mb-1">Acciones Rápidas</h4>
                          <p className="text-muted mb-0">Crea contenido profesional en minutos</p>
                        </div>
                      </div>
                      
                      <Row className="g-4">
                        <Col lg={4}>
                          <div className="action-card">
                            <div className="icon-wrapper primary-gradient text-white">
                              💼
                            </div>
                            <h5 className="fw-bold text-dark mb-2">Crear Tarjeta Digital</h5>
                            <p className="text-muted mb-4">
                              Diseña tu tarjeta profesional con efectos visuales únicos en solo 5 minutos
                            </p>
                            <Link href="/create">
                              <Button 
                                variant="primary" 
                                className="w-100 fw-semibold py-2"
                                style={{ borderRadius: '12px' }}
                              >
                                Crear Nueva Tarjeta
                              </Button>
                            </Link>
                          </div>
                        </Col>
                        <Col lg={4}>
                          <div className="action-card">
                            <div className="icon-wrapper warning-gradient text-white">
                              🚀
                            </div>
                            <h5 className="fw-bold text-muted mb-2">Optimizar CV con IA</h5>
                            <p className="text-muted mb-4">
                              Mejora tu CV con inteligencia artificial y análisis ATS automático
                            </p>
                            <Button 
                              variant="outline-secondary" 
                              className="w-100 fw-semibold py-2" 
                              disabled
                              style={{ borderRadius: '12px' }}
                            >
                              Febrero 2025
                            </Button>
                          </div>
                        </Col>
                        <Col lg={4}>
                          <div className="action-card">
                            <div className="icon-wrapper info-gradient text-white">
                              🎯
                            </div>
                            <h5 className="fw-bold text-muted mb-2">Crear Presentación</h5>
                            <p className="text-muted mb-4">
                              Presenta con transiciones cinematográficas y elementos interactivos
                            </p>
                            <Button 
                              variant="outline-secondary" 
                              className="w-100 fw-semibold py-2" 
                              disabled
                              style={{ borderRadius: '12px' }}
                            >
                              Marzo 2025
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
    </AuthWrapper>
  );
}