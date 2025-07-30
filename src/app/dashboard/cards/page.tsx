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
  customUrl?: string;
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
    <>
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
        .glass-card .text-dark {
          color: #ffffff !important;
        }
        .glass-card .text-muted {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        .card-item {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          height: 100%;
        }
        .card-item:hover {
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
        .stat-badge {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }
        .icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          font-size: 1.5rem;
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
        .danger-gradient {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }
        .info-gradient {
          background: linear-gradient(135deg, #06b6d4, #0891b2);
        }
      `}</style>
      <div className="animated-gradient-background">
        <Container className="py-5">
          {/* Header */}
          <div className="header-content mb-4">
            <Row className="align-items-center">
              <Col lg={8}>
                <div>
                  <h1 className="text-white mb-2 fw-bold" style={{ fontSize: '2.5rem' }}>
                    💼 Mis Tarjetas Digitales
                  </h1>
                  <p className="text-white opacity-75 mb-0 fs-5">
                    Gestiona y edita todas tus tarjetas profesionales
                  </p>
                </div>
              </Col>
              <Col lg={4}>
                <div className="d-flex justify-content-end">
                  {planLimits && cards.length >= planLimits.maxCards && planLimits.maxCards !== -1 ? (
                    <Link href="/pricing">
                      <Button 
                        variant="warning" 
                        className="fw-semibold px-4"
                        style={{ borderRadius: '12px' }}
                      >
                        ⭐ Actualizar para Crear Más
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/create">
                      <Button 
                        variant="primary" 
                        className="fw-semibold px-4"
                        style={{ borderRadius: '12px' }}
                      >
                        ✨ Crear Nueva Tarjeta
                      </Button>
                    </Link>
                  )}
                </div>
              </Col>
            </Row>
          </div>

          {/* Welcome Message */}
          {showWelcomeMessage && (
            <Row className="mb-4">
              <Col>
                <div className="glass-card border-0">
                  <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <div className="icon-wrapper success-gradient text-white me-3">
                          👋
                        </div>
                        <div>
                          <h5 className="fw-bold text-dark mb-1">¡Bienvenido!</h5>
                          <p className="text-muted mb-0">{welcomeMessage}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => setShowWelcomeMessage(false)}
                        style={{ borderRadius: '8px' }}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          )}

          {/* Plan Usage Section */}
          {planLimits && (
            <Row className="mb-5">
              <Col>
                <div className="glass-card border-0">
                  <div className="p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="icon-wrapper primary-gradient text-white me-3">
                        📊
                      </div>
                      <div>
                        <h4 className="fw-bold text-dark mb-1">
                          Plan: {session?.user?.plan || 'GRATUITO'}
                        </h4>
                        <p className="text-muted mb-0">Estado de tu suscripción actual</p>
                      </div>
                      <div className="ms-auto">
                        <Link href="/pricing">
                          <Button 
                            variant="warning" 
                            size="sm"
                            className="fw-semibold"
                            style={{ borderRadius: '12px' }}
                          >
                            ⭐ Actualizar Plan
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <Row className="g-4">
                      <Col md={6}>
                        <div className="stat-badge">
                          <h6 className="fw-semibold text-dark mb-2">📈 Uso de Tarjetas</h6>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted">
                              {planLimits.maxCards === -1 ? `${cards.length} / Ilimitadas` : `${cards.length} / ${planLimits.maxCards}`}
                            </span>
                            <span className="fw-bold text-primary">
                              {planLimits.maxCards === -1 ? '∞' : Math.round((cards.length / planLimits.maxCards) * 100)}%
                            </span>
                          </div>
                          <ProgressBar 
                            now={planLimits.maxCards === -1 ? 0 : (cards.length / planLimits.maxCards) * 100}
                            variant={cards.length >= planLimits.maxCards ? "danger" : "success"}
                            style={{ height: '8px', borderRadius: '8px' }}
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="stat-badge">
                          <h6 className="fw-semibold text-dark mb-3">🎯 Características del Plan</h6>
                          <div className="row g-2">
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <span className="me-2">{planLimits.hasWatermark ? '❌' : '✅'}</span>
                                <small className="text-muted">Marca de agua</small>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <span className="me-2">{planLimits.hasAnalytics ? '✅' : '❌'}</span>
                                <small className="text-muted">Analytics</small>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <span className="me-2">{planLimits.hasExport ? '✅' : '❌'}</span>
                                <small className="text-muted">Exportar PDF</small>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <span className="me-2">{planLimits.hasPrioritySupport ? '✅' : '❌'}</span>
                                <small className="text-muted">Soporte</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {cards.length >= planLimits.maxCards && planLimits.maxCards !== -1 && (
                      <div className="mt-4">
                        <div 
                          className="alert alert-warning border-0 d-flex align-items-center"
                          style={{ borderRadius: '12px' }}
                        >
                          <div className="icon-wrapper warning-gradient text-white me-3" style={{ width: '40px', height: '40px' }}>
                            ⚠️
                          </div>
                          <div>
                            <strong className="text-warning">¡Límite del plan alcanzado!</strong>
                            <p className="mb-0 text-muted">
                              Has usado todas las {planLimits.maxCards} tarjetas disponibles en tu plan {session?.user?.plan || 'GRATUITO'}. 
                              <Link href="/pricing" className="text-warning fw-semibold text-decoration-none"> Actualiza para crear más tarjetas.</Link>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          )}
          {/* Cards Section */}
          <Row>
            <Col>
              {loading ? (
                <div className="glass-card border-0">
                  <div className="p-5 text-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <h5 className="mt-3 text-dark">Cargando tus tarjetas...</h5>
                    <p className="text-muted">Un momento por favor</p>
                  </div>
                </div>
              ) : cards.length === 0 ? (
                <div className="glass-card border-0">
                  <div className="p-5 text-center">
                    <div className="icon-wrapper primary-gradient text-white mx-auto mb-4" style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}>
                      💼
                    </div>
                    <h3 className="fw-bold text-dark mb-3">¡Comienza creando tu primera tarjeta!</h3>
                    <p className="text-muted mb-4 fs-5">
                      Diseña una tarjeta digital profesional con efectos únicos en menos de 5 minutos
                    </p>
                    <Link href="/create">
                      <Button 
                        variant="primary" 
                        size="lg" 
                        className="fw-semibold px-5 py-3"
                        style={{ borderRadius: '16px' }}
                      >
                        ✨ Crear Mi Primera Tarjeta
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="glass-card border-0 mb-4">
                    <div className="p-4">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h4 className="fw-bold text-dark mb-1">Tus Tarjetas Digitales</h4>
                          <p className="text-muted mb-0">{cards.length} tarjeta{cards.length !== 1 ? 's' : ''} creada{cards.length !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="d-flex gap-2">
                          <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2">
                            📊 {cards.reduce((sum, card) => sum + card.views, 0)} visualizaciones
                          </span>
                          <span className="badge bg-success bg-opacity-10 text-success fw-semibold px-3 py-2">
                            🔗 {cards.reduce((sum, card) => sum + card.clicks, 0)} clics
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Row className="g-4">
                    {cards.map((card) => (
                      <Col key={card.id} lg={6} xl={4}>
                        <div className="card-item">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="flex-grow-1">
                              <h5 className="fw-bold text-dark mb-1">{card.name}</h5>
                              <p className="text-muted mb-2">{card.profession}</p>
                              <div className="d-flex align-items-center gap-2">
                                <span className={`badge ${card.isActive ? 'bg-success' : 'bg-secondary'} bg-opacity-15 ${card.isActive ? 'text-success' : 'text-secondary'} fw-semibold`}>
                                  {card.isActive ? '🟢 Activa' : '🔴 Inactiva'}
                                </span>
                                <small className="text-muted">
                                  {new Date(card.createdAt).toLocaleDateString('es-ES')}
                                </small>
                              </div>
                            </div>
                          </div>

                          <div className="row g-3 mb-4">
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <div className="icon-wrapper info-gradient text-white me-2" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                                  👁️
                                </div>
                                <div>
                                  <div className="fw-bold text-dark">{card.views}</div>
                                  <small className="text-muted">Vistas</small>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <div className="icon-wrapper success-gradient text-white me-2" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                                  🔗
                                </div>
                                <div>
                                  <div className="fw-bold text-dark">{card.clicks}</div>
                                  <small className="text-muted">Clics</small>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="d-flex gap-2">
                            <Link 
                              href={card.customUrl ? `/c/${card.customUrl}` : `/card/${card.id}`} 
                              target="_blank" 
                              className="flex-fill"
                            >
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="w-100 fw-semibold"
                                style={{ borderRadius: '8px' }}
                              >
                                👁️ Ver
                              </Button>
                            </Link>
                            <Button 
                              variant="outline-info" 
                              size="sm"
                              className="fw-semibold flex-fill"
                              style={{ borderRadius: '8px' }}
                              onClick={() => window.open(`/create?edit=${card.id}`, '_self')}
                            >
                              ✏️ Editar
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              className="fw-semibold"
                              style={{ borderRadius: '8px', minWidth: '60px' }}
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
                        </div>
                      </Col>
                    ))}
                  </Row>
                </>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
