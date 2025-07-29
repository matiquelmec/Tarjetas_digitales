'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, ProgressBar, Nav } from 'react-bootstrap';
import Link from 'next/link';
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
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [planLimits, setPlanLimits] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
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
      const response = await fetch('/api/cards');
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
      const response = await fetch('/api/user/plan-limits');
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
                      <Nav.Link 
                        active={activeTab === 'overview'} 
                        onClick={() => setActiveTab('overview')}
                        className={`text-white border-0 ${activeTab === 'overview' ? 'bg-primary' : ''}`}
                      >
                        📊 Resumen General
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        active={activeTab === 'cards'} 
                        onClick={() => setActiveTab('cards')}
                        className={`text-white border-0 ${activeTab === 'cards' ? 'bg-primary' : ''}`}
                      >
                        💼 Tarjetas Digitales
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        active={activeTab === 'cvs'} 
                        onClick={() => setActiveTab('cvs')}
                        className={`text-white-50 border-0 ${activeTab === 'cvs' ? 'bg-primary' : ''}`}
                        style={{ cursor: 'not-allowed' }}
                      >
                        🚀 CVs Inteligentes <small>(Próximamente)</small>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        active={activeTab === 'presentations'} 
                        onClick={() => setActiveTab('presentations')}
                        className={`text-white-50 border-0 ${activeTab === 'presentations' ? 'bg-primary' : ''}`}
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
          {activeTab === 'overview' && (
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

          {activeTab === 'cards' && (
            <>
              {/* Plan Usage Section */}
              {planLimits && (
                <Row className="mb-4">
                  <Col>
                    <Card className="glass-card">
                      <Card.Header>
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="text-white mb-0">Plan: {session?.user?.plan || 'GRATUITO'}</h5>
                          <Link href="/pricing">
                            <Button variant="outline-warning" size="sm">Actualizar Plan</Button>
                          </Link>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={6}>
                            <div className="text-white mb-3">
                              <strong>Uso de Tarjetas:</strong>
                              <ProgressBar 
                                now={planLimits.maxCards === -1 ? 0 : (cards.length / planLimits.maxCards) * 100}
                                label={planLimits.maxCards === -1 ? `${cards.length} / Ilimitadas` : `${cards.length} / ${planLimits.maxCards}`}
                                variant={cards.length >= planLimits.maxCards ? "danger" : "success"}
                                className="mt-2"
                              />
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="text-white">
                              <strong>Características del Plan:</strong>
                              <ul className="mt-2 mb-0" style={{ fontSize: '0.9rem' }}>
                                <li>{planLimits.hasWatermark ? '❌ Incluye marca de agua' : '✅ Sin marca de agua'}</li>
                                <li>{planLimits.hasAnalytics ? '✅ Analytics avanzados' : '❌ Solo analytics básicos'}</li>
                                <li>{planLimits.hasExport ? '✅ Exportar PDF/Imagen' : '❌ Sin exportación'}</li>
                                <li>{planLimits.hasPrioritySupport ? '✅ Soporte prioritario' : '❌ Soporte comunidad'}</li>
                              </ul>
                            </div>
                          </Col>
                        </Row>
                        {cards.length >= planLimits.maxCards && planLimits.maxCards !== -1 && (
                          <Alert variant="warning" className="mt-3 mb-0">
                            <strong>¡Límite del plan alcanzado!</strong> Has usado todas las {planLimits.maxCards} tarjetas disponibles en tu plan {session?.user?.plan || 'GRATUITO'}. 
                            <Link href="/pricing" className="alert-link"> Actualiza para crear más tarjetas.</Link>
                          </Alert>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
            </>
          )}

          {activeTab === 'cards' && (
            <Row>
              <Col>
                <Card className="glass-card">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h3 className="text-white mb-0">💼 Mis Tarjetas Digitales</h3>
                    {planLimits && cards.length >= planLimits.maxCards && planLimits.maxCards !== -1 ? (
                      <Link href="/pricing">
                        <Button variant="warning">Actualizar para Crear Más</Button>
                      </Link>
                    ) : (
                      <Link href="/create">
                        <Button variant="primary">Crear Nueva Tarjeta</Button>
                      </Link>
                    )}
                  </Card.Header>
                  <Card.Body>
                    {loading ? (
                      <div className="text-white text-center">
                        <div className="spinner-border text-light" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                      </div>
                    ) : cards.length === 0 ? (
                      <div className="text-white text-center py-5">
                        <div style={{ fontSize: '4rem' }} className="mb-3">💼</div>
                        <h4>¡Comienza creando tu primera tarjeta!</h4>
                        <p className="text-white-75 mb-4">Diseña una tarjeta digital profesional en menos de 5 minutos</p>
                        <Link href="/create">
                          <Button variant="primary" size="lg">Crear Mi Primera Tarjeta</Button>
                        </Link>
                      </div>
                    ) : (
                      <Table className="text-white" hover>
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Título</th>
                            <th>Visualizaciones</th>
                            <th>Clics</th>
                            <th>Estado</th>
                            <th>Creada</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cards.map((card) => (
                            <tr key={card.id}>
                              <td>{card.name}</td>
                              <td>{card.profession}</td>
                              <td>
                                <span className="badge bg-info">{card.views}</span>
                              </td>
                              <td>
                                <span className="badge bg-success">{card.clicks}</span>
                              </td>
                              <td>
                                <span className={`badge ${card.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                  {card.isActive ? 'Activa' : 'Inactiva'}
                                </span>
                              </td>
                              <td>{new Date(card.createdAt).toLocaleDateString('es-ES')}</td>
                              <td>
                                <div className="d-flex gap-1">
                                  <Link href={`/card/${card.id}`} target="_blank">
                                    <Button variant="outline-light" size="sm" title="Ver tarjeta">
                                      👁️
                                    </Button>
                                  </Link>
                                  <Button 
                                    variant="outline-info" 
                                    size="sm"
                                    title="Editar"
                                    onClick={() => window.open(`/create?edit=${card.id}`, '_self')}
                                  >
                                    ✏️
                                  </Button>
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    title="Eliminar"
                                    onClick={() => deleteCard(card.id)}
                                  >
                                    🗑️
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Coming Soon Tabs */}
          {activeTab === 'cvs' && (
            <Row>
              <Col>
                <Card className="glass-card text-center">
                  <Card.Body className="py-5">
                    <div style={{ fontSize: '5rem' }} className="mb-4">🚀</div>
                    <h2 className="text-white mb-3">CVs Inteligentes</h2>
                    <p className="text-white-75 mb-4">
                      Sube tu CV actual y nuestra IA lo optimizará con diseños modernos, palabras clave relevantes y estructura profesional.
                    </p>
                    <div className="mb-4">
                      <div className="d-flex justify-content-center gap-4 flex-wrap">
                        <div className="text-white-50">✓ Optimización con IA</div>
                        <div className="text-white-50">✓ Plantillas ATS-friendly</div>
                        <div className="text-white-50">✓ Exportación múltiple</div>
                      </div>
                    </div>
                    <Button variant="outline-light" size="lg" disabled>
                      Disponible Febrero 2025
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {activeTab === 'presentations' && (
            <Row>
              <Col>
                <Card className="glass-card text-center">
                  <Card.Body className="py-5">
                    <div style={{ fontSize: '5rem' }} className="mb-4">🎯</div>
                    <h2 className="text-white mb-3">Presentaciones Inmersivas</h2>
                    <p className="text-white-75 mb-4">
                      Crea presentaciones que hipnoticen a tu audiencia con transiciones cinematográficas y contenido interactivo.
                    </p>
                    <div className="mb-4">
                      <div className="d-flex justify-content-center gap-4 flex-wrap">
                        <div className="text-white-50">✓ Transiciones cinematográficas</div>
                        <div className="text-white-50">✓ Elementos interactivos</div>
                        <div className="text-white-50">✓ Analytics de engagement</div>
                      </div>
                    </div>
                    <Button variant="outline-light" size="lg" disabled>
                      Disponible Marzo 2025
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </AuthWrapper>
  );
}