'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, ProgressBar, Nav } from 'react-bootstrap';
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
        // Set tab to cards and show welcome message
        setActiveTab('cards');
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
      default:
        // Keep default overview tab
        break;
    }
  };

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/cards', {
        credentials: 'same-origin' // Include cookies for authentication
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
        credentials: 'same-origin' // Include cookies for authentication
      });
      if (response.ok) {
        const data = await response.json();
        setPlanLimits(data);
      }
    } catch (error) {
      console.error('Error fetching plan limits:', error);
    }
  };

  const deleteCard = async (cardId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarjeta? Esta acción no se puede deshacer.')) return;
    
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: 'DELETE',
        credentials: 'same-origin' // Include cookies for authentication
      });
      
      if (response.ok) {
        setCards(cards.filter(card => card.id !== cardId));
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  return (
    <AuthWrapper>
      <style jsx global>{`
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
        }
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(0, 123, 255, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 123, 255, 0); }
        }
      `}</style>
      <div className="animated-gradient-background">
        <Container className="py-5">
          {/* Header */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="text-white mb-1">Mi Panel Digital</h1>
                  <p className="text-white-50 mb-0">Gestiona tu identidad profesional digital</p>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <Link href="/pricing">
                    <Button variant="outline-warning" size="sm">
                      Actualizar Plan
                    </Button>
                  </Link>
                  <div className="text-white text-end">
                    <div>Bienvenido, {session?.user?.name}</div>
                    <small className="text-white-50">Plan: {session?.user?.plan || 'GRATUITO'}</small>
                  </div>
                  <Button variant="outline-light" size="sm" onClick={() => signOut()}>
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Navigation Tabs */}
          <Row className="mb-4">
            <Col>
              <Card className="glass-card">
                <Card.Body className="p-0">
                  <Nav variant="pills" className="nav-fill">
                    <Nav.Item>
                      <Link href="/dashboard" passHref legacyBehavior>
                        <Nav.Link 
                          active={pathname === '/dashboard'} 
                          className={`text-white border-0 ${pathname === '/dashboard' ? 'bg-primary' : ''}`}>
                          📊 Resumen General
                        </Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Link href="/dashboard/cards" passHref legacyBehavior>
                        <Nav.Link 
                          active={pathname === '/dashboard/cards'} 
                          className={`text-white border-0 ${pathname === '/dashboard/cards' ? 'bg-primary' : ''}`}>
                          💼 Tarjetas Digitales
                        </Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Link href="/dashboard/cv" passHref legacyBehavior>
                        <Nav.Link 
                          active={pathname === '/dashboard/cv'} 
                          className={`text-white border-0 ${pathname === '/dashboard/cv' ? 'bg-primary' : ''}`}>
                          🚀 CVs Inteligentes
                        </Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        href="#"
                        className={`text-white-50 border-0`}
                        style={{ cursor: 'not-allowed' }}
                      >
                        🎯 Presentaciones <small>(Próximamente)</small>
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Tab Content */}
          import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav } from 'react-bootstrap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthWrapper } from '../../components/AuthWrapper';
import { usePostLoginRedirect } from '@/hooks/usePostLoginRedirect';

export default function Dashboard() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [cards, setCards] = useState<any[]>([]); // Keep cards state for overview stats
  const [loading, setLoading] = useState(true);
  const [planLimits, setPlanLimits] = useState<any>(null);

  // Handle post-login redirection
  usePostLoginRedirect();

  useEffect(() => {
    if (session?.user?.id) {
      fetchCards();
      fetchPlanLimits();
    }
  }, [session]);

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/cards', {
        credentials: 'same-origin' // Include cookies for authentication
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
        credentials: 'same-origin' // Include cookies for authentication
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
        }
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(0, 123, 255, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 123, 255, 0); }
        }
      `}</style>
      <div className="animated-gradient-background">
        <Container className="py-5">
          {/* Header */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="text-white mb-1">Mi Panel Digital</h1>
                  <p className="text-white-50 mb-0">Gestiona tu identidad profesional digital</p>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <Link href="/pricing">
                    <Button variant="outline-warning" size="sm">
                      Actualizar Plan
                    </Button>
                  </Link>
                  <div className="text-white text-end">
                    <div>Bienvenido, {session?.user?.name}</div>
                    <small className="text-white-50">Plan: {session?.user?.plan || 'GRATUITO'}</small>
                  </div>
                  <Button variant="outline-light" size="sm" onClick={() => signOut()}>
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Navigation Tabs */}
          <Row className="mb-4">
            <Col>
              <Card className="glass-card">
                <Card.Body className="p-0">
                  <Nav variant="pills" className="nav-fill">
                    <Nav.Item>
                      <Link href="/dashboard" passHref legacyBehavior>
                        <Nav.Link 
                          active={pathname === '/dashboard'} 
                          className={`text-white border-0 ${pathname === '/dashboard' ? 'bg-primary' : ''}`}>
                          📊 Resumen General
                        </Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Link href="/dashboard/cards" passHref legacyBehavior>
                        <Nav.Link 
                          active={pathname === '/dashboard/cards'} 
                          className={`text-white border-0 ${pathname === '/dashboard/cards' ? 'bg-primary' : ''}`}>
                          💼 Tarjetas Digitales
                        </Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Link href="/dashboard/cv" passHref legacyBehavior>
                        <Nav.Link 
                          active={pathname === '/dashboard/cv'} 
                          className={`text-white border-0 ${pathname === '/dashboard/cv' ? 'bg-primary' : ''}`}>
                          🚀 CVs Inteligentes
                        </Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        href="#"
                        className={`text-white-50 border-0`}
                        style={{ cursor: 'not-allowed' }}
                      >
                        🎯 Presentaciones <small>(Próximamente)</small>
                      </Nav.Link>
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
              <Row className="mb-4">
                <Col md={3}>
                  <Card className="glass-card text-white text-center">
                    <Card.Body>
                      <div style={{ fontSize: '2rem' }} className="mb-2">💼</div>
                      <h3>{cards.length}</h3>
                      <p className="mb-0">Tarjetas Creadas</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="glass-card text-white text-center">
                    <Card.Body>
                      <div style={{ fontSize: '2rem' }} className="mb-2">👁️</div>
                      <h3>{cards.reduce((sum, card) => sum + card.views, 0)}</h3>
                      <p className="mb-0">Visualizaciones</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="glass-card text-white text-center">
                    <Card.Body>
                      <div style={{ fontSize: '2rem' }} className="mb-2">🚀</div>
                      <h3>0</h3>
                      <p className="mb-0">CVs Optimizados</p>
                      <small className="text-white-50">(Próximamente)</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="glass-card text-white text-center">
                    <Card.Body>
                      <div style={{ fontSize: '2rem' }} className="mb-2">🎯</div>
                      <h3>0</h3>
                      <p className="mb-0">Presentaciones</p>
                      <small className="text-white-50">(Próximamente)</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Quick Actions */}
              <Row className="mb-4">
                <Col>
                  <Card className="glass-card">
                    <Card.Header>
                      <h5 className="text-white mb-0">🚀 Acciones Rápidas</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={4}>
                          <div className="text-center p-3">
                            <div style={{ fontSize: '3rem' }} className="mb-3">💼</div>
                            <h6 className="text-white">Crear Tarjeta Digital</h6>
                            <p className="text-white-50 small mb-3">Diseña tu tarjeta profesional en 5 minutos</p>
                            <Link href="/create">
                              <Button variant="primary" className="w-100">
                                Crear Nueva Tarjeta
                              </Button>
                            </Link>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="text-center p-3">
                            <div style={{ fontSize: '3rem' }} className="mb-3">🚀</div>
                            <h6 className="text-white-50">Optimizar CV con IA</h6>
                            <p className="text-white-50 small mb-3">Mejora tu CV con inteligencia artificial</p>
                            <Button variant="outline-light" className="w-100" disabled>
                              Próximamente - Feb 2025
                            </Button>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="text-center p-3">
                            <div style={{ fontSize: '3rem' }} className="mb-3">🎯</div>
                            <h6 className="text-white-50">Crear Presentación</h6>
                            <p className="text-white-50 small mb-3">Presenta con impacto visual</p>
                            <Button variant="outline-light" className="w-100" disabled>
                              Próximamente - Mar 2025
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
    </AuthWrapper>
  );
}}
        </Container>
      </div>
    </AuthWrapper>
  );
}