'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Breadcrumb } from 'react-bootstrap';
import Link from 'next/link';
import IndiNavbar from '@/components/layout/IndiNavbar';
import HologramPreview from '@/components/HologramPreview';
import BusinessCard from '@/features/digital-card/components/BusinessCard';
import '@/styles/hologram-effects.css';
import { CONSISTENT_DEMO_DATA } from '@/lib/constants/defaultCardData';

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
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy] = useState<'name' | 'views' | 'clicks' | 'date'>('date');
  const [planLimits, setPlanLimits] = useState<any>(null);

  // Usar datos centralizados consistentes para vista previa
  const demoCardData = CONSISTENT_DEMO_DATA;

  // Resto del código permanece igual...
  useEffect(() => {
    if (session?.user?.id) {
      fetchCards();
      fetchPlanLimits();
    }
  }, [session]);

  const showMessage = (message: string, duration = 3000) => {
    setWelcomeMessage(message);
    setShowWelcomeMessage(true);
    
    switch (message) {
      case 'cardCreated':
        setTimeout(() => {
          setShowWelcomeMessage(false);
        }, duration);
        break;
      case 'welcome':
        setTimeout(() => {
          setShowWelcomeMessage(false);
        }, 5000);
        break;
      case 'limitReached':
        setTimeout(() => {
          setShowWelcomeMessage(false);
        }, 8000);
        break;
      case 'cardDeleted':
        setTimeout(() => {
          setShowWelcomeMessage(false);
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
        await fetchCards();
        showMessage('cardDeleted');
      } else {
        alert('Error al eliminar la tarjeta.');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Error de red al eliminar la tarjeta.');
    } finally {
      setDeletingCardId(null);
    }
  };

  // Filtrar y ordenar tarjetas
  const filteredAndSortedCards = (cards || [])
    .filter(card => 
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.profession.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return (
      <div className="min-vh-100" style={{ 
        background: 'linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e)',
        backgroundSize: '400% 400%',
        animation: 'simpleGradientAnimation 15s ease infinite'
      }}>
        <IndiNavbar />
        <Container className="py-4">
          <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
            <div className="spinner-border text-primary" role="status" style={{ width: '4rem', height: '4rem' }}>
              <span className="visually-hidden">Cargando tus tarjetas...</span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ 
      background: 'linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e)',
      backgroundSize: '400% 400%',
      animation: 'simpleGradientAnimation 15s ease infinite'
    }}>
      <style jsx global>{`
        @keyframes simpleGradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      
      <IndiNavbar />
      
      <Container className="py-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item linkAs={Link} linkProps={{ href: '/dashboard' }} className="text-light">
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item active className="text-white">
            Mis Tarjetas
          </Breadcrumb.Item>
        </Breadcrumb>

        <Row>
          <Col md={8}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="text-white">Mis Tarjetas Digitales</h1>
              <Button 
                as={Link} 
                href="/create" 
                variant="primary"
                size="lg"
                className="btn-gradient"
              >
                ➕ Nueva Tarjeta
              </Button>
            </div>

            {cards.length === 0 ? (
              <div className="text-center py-5">
                <h3 className="text-white mb-3">¡Crea tu primera tarjeta digital!</h3>
                <p className="text-light mb-4">
                  Empieza a conectar con tus clientes de manera más efectiva
                </p>
                <Button 
                  as={Link} 
                  href="/create" 
                  variant="primary"
                  size="lg"
                  className="btn-gradient"
                >
                  🚀 Crear Mi Primera Tarjeta
                </Button>
              </div>
            ) : (
              <div className="cards-grid">
                {filteredAndSortedCards.map((card) => (
                  <div key={card.id} className="card-item mb-3 p-3 bg-dark rounded">
                    <h5 className="text-white">{card.name}</h5>
                    <p className="text-light">{card.profession}</p>
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">
                        👁️ {card.views} vistas • 🖱️ {card.clicks} clics
                      </small>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => deleteCard(card.id)}
                        disabled={deletingCardId === card.id}
                      >
                        {deletingCardId === card.id ? 'Eliminando...' : '🗑️'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Col>

          <Col md={4}>
            <HologramPreview
              mode="basic"
              showBeam={false}
              showParticles={false}
              showScanlines={false}
              enable3D={false}
              title="👁️ Vista Previa"
              subtitle="Así se verá tu tarjeta"
              pageBackgroundColor={demoCardData.pageBackgroundColor}
              className="preview-mode"
            >
              <BusinessCard
                name={demoCardData.name}
                title={demoCardData.title}
                about={demoCardData.about}
                location={demoCardData.location}
                whatsapp={demoCardData.whatsapp}
                email={demoCardData.email}
                photoUrl={demoCardData.photo}
                cardBackgroundColor={demoCardData.cardBackgroundColor}
                cardTextColor={demoCardData.cardTextColor}
                pageBackgroundColor={demoCardData.pageBackgroundColor}
                enableHoverEffect={false}
                enableGlassmorphism={false}
                enableSubtleAnimations={false}
                enableBackgroundPatterns={false}
                enableParticles={false}
                enableAnimatedGradient={false}
                enableFloatingShapes={false}
                whatsappShareUrl={`https://wa.me/${demoCardData.whatsapp}`}
                appointmentLink={demoCardData.appointmentLink}
                professionalDetails={demoCardData.professionalDetails}
                linkedin={demoCardData.linkedin}
                instagram={demoCardData.instagram}
                twitter={demoCardData.twitter}
                facebook={demoCardData.facebook}
                website={demoCardData.website}
                buttonSecondaryColor={demoCardData.buttonSecondaryColor}
                buttonNormalBackgroundColor={demoCardData.buttonNormalBackgroundColor}
                buttonSecondaryHoverColor={demoCardData.buttonSecondaryHoverColor}
                template={demoCardData.template}
                fontFamily={demoCardData.fontFamily}
              />
            </HologramPreview>
          </Col>
        </Row>
      </Container>
    </div>
  );
}