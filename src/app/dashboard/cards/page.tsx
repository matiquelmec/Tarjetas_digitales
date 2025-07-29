'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, ProgressBar } from 'react-bootstrap';
import Link from 'next/link';
import { PlanLimits, PLAN_LIMITS } from '@/lib/planLimits'; // Assuming this import is needed

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

export default function DashboardCardsPage() {
  const { data: session } = useSession();
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [planLimits, setPlanLimits] = useState<PlanLimits | null>(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);

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
      default:
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

  const deleteCard = async (cardId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarjeta? Esta acción no se puede deshacer.')) return;
    
    setDeletingCardId(cardId);
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: 'DELETE',
        credentials: 'same-origin'
      });
      
      if (response.ok) {
        setCards(cards.filter(card => card.id !== cardId));
      } else {
        // Handle error, maybe show an alert
        console.error('Failed to delete card', await response.json());
        alert('Error al eliminar la tarjeta.');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Error de red al eliminar la tarjeta.');
    } finally {
      setDeletingCardId(null);
    }
  };

  return (
    <Container fluid>
      {/* Welcome Message */}
      {showWelcomeMessage && (
        <Row className="mb-4">
          <Col>
            <Alert variant="success" className="d-flex justify-content-between align-items-center">
              <div>
                <strong>👋 ¡Bienvenido!</strong> {welcomeMessage}
              </div>
              <Button 
                variant="outline-success" 
                size="sm"
                onClick={() => setShowWelcomeMessage(false)}
              >
                ✕
              </Button>
            </Alert>
          </Col>
        </Row>
      )}

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
                <div className="text-white text-center py-5">
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-3">Cargando tus tarjetas...</p>
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
                              disabled={deletingCardId === card.id}
                            >
                              {deletingCardId === card.id ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              ) : (
                                '🗑️'
                              )}
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
    </Container>
  );
}
