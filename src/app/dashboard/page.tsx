'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthWrapper } from '../../components/AuthWrapper';
import { usePostLoginRedirect } from '@/hooks/usePostLoginRedirect';
import IndiNavbar from '@/components/layout/IndiNavbar';

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
          padding: 1.5rem;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          min-height: 320px;
        }
        
        .module-description {
          flex: 1;
          display: flex;
          align-items: center;
          text-align: left;
          line-height: 1.4;
          padding: 0.5rem 0;
        }
        
        .module-description small {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.5;
        }
        
        .alien-stat-card {
          position: relative;
          overflow: hidden;
        }
        
        .alien-stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 
            0 16px 48px rgba(0, 0, 0, 0.2),
            0 0 32px rgba(0, 246, 255, 0.3);
        }
        
        .alien-glow-effect {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, transparent, #00f6ff, transparent, #8e2de2, transparent);
          background-size: 200% 200%;
          border-radius: inherit;
          z-index: -1;
          opacity: 0;
          filter: blur(8px);
          transition: opacity 0.3s ease;
          animation: alienGlowRotate 3s linear infinite;
        }
        
        .alien-stat-card:hover .alien-glow-effect {
          opacity: 0.6;
        }
        
        @keyframes alienGlowRotate {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        
        .alien-badge {
          border-radius: 12px;
          padding: 4px 12px;
          font-size: 0.85rem;
          font-weight: 600;
        }
        
        /* Botones de Creación Alienígena */
        .alien-create-btn {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          border: none;
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 246, 255, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .alien-create-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 246, 255, 0.5);
          background: linear-gradient(135deg, #00d4e7, #0056cc);
          color: white;
        }
        
        .alien-create-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }
        
        .alien-create-btn:hover::before {
          left: 100%;
        }
        
        .alien-create-btn-disabled {
          background: linear-gradient(135deg, #6c757d, #495057);
          border: none;
          color: rgba(255, 255, 255, 0.6);
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: not-allowed;
          opacity: 0.7;
        }
        
        .create-icon {
          margin-right: 6px;
          font-size: 1em;
          filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5));
        }
        .alien-nav-link {
          border-radius: 16px;
          margin: 0 4px;
          transition: all 0.3s ease;
          color: rgba(255, 255, 255, 0.7) !important;
          font-weight: 600;
          position: relative;
          overflow: hidden;
        }
        
        .alien-nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 246, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }
        
        .alien-nav-link:hover::before {
          left: 100%;
        }
        
        .alien-nav-link.active {
          background: linear-gradient(135deg, #00f6ff, #0072ff) !important;
          color: white !important;
          box-shadow: 0 4px 20px rgba(0, 246, 255, 0.4);
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        
        .alien-nav-link:hover:not(.active) {
          background: rgba(0, 246, 255, 0.1);
          color: #00f6ff !important;
          border: 1px solid rgba(0, 246, 255, 0.3);
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
        .alien-primary-gradient {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          box-shadow: 0 4px 16px rgba(0, 246, 255, 0.3);
        }
        .alien-success-gradient {
          background: linear-gradient(135deg, #00ff88, #00cc6a);
          box-shadow: 0 4px 16px rgba(0, 255, 136, 0.3);
        }
        .alien-warning-gradient {
          background: linear-gradient(135deg, #ffaa00, #ff8800);
          box-shadow: 0 4px 16px rgba(255, 170, 0, 0.3);
        }
        .alien-info-gradient {
          background: linear-gradient(135deg, #8e2de2, #4a00e0);
          box-shadow: 0 4px 16px rgba(142, 45, 226, 0.3);
        }
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }

        /* Cards clicables con hover effects */
        .clickable-stat-card {
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .clickable-stat-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .card-hover-text {
          opacity: 0;
          transition: opacity 0.3s ease;
          margin-top: 8px;
        }

        .clickable-stat-card:hover .card-hover-text {
          opacity: 1;
        }

        .clickable-stat-card:hover .alien-glow-effect {
          opacity: 0.8;
          transform: scale(1.1);
        }

        /* Centro de Comando Intergaláctico */
        .alien-command-center {
          position: relative;
          background: linear-gradient(135deg, rgba(15, 12, 41, 0.6), rgba(48, 43, 99, 0.4));
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2.5rem;
          margin-bottom: 2rem;
          border: 2px solid rgba(0, 246, 255, 0.2);
          overflow: hidden;
          box-shadow: 
            0 8px 32px rgba(0, 246, 255, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        /* Partículas espaciales del dashboard */
        .dashboard-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }

        .space-particle {
          position: absolute;
          font-size: 1.2rem;
          animation: particleDrift 20s linear infinite;
          opacity: 0.3;
        }

        .particle-1 { top: 10%; left: 5%; animation-delay: 0s; }
        .particle-2 { top: 60%; left: 90%; animation-delay: -5s; }
        .particle-3 { bottom: 10%; left: 50%; animation-delay: -10s; }
        .particle-4 { top: 40%; right: 10%; animation-delay: -15s; }

        @keyframes particleDrift {
          0% { transform: translateX(0) translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateX(100px) translateY(-50px) rotate(360deg); opacity: 0; }
        }

        /* Badge de estado alienígena */
        .alien-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 246, 255, 0.1);
          border: 1px solid rgba(0, 246, 255, 0.3);
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          color: #00f6ff;
        }

        .signal-indicator {
          font-size: 1em;
          animation: signalPulse 2s ease-in-out infinite;
        }

        @keyframes signalPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
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

        .alien-glow-text {
          background: linear-gradient(135deg, #00f6ff, #0072ff, #8e2de2);
          background-size: 200% 200%;
          animation: alienTextGlow 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes alienTextGlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .dashboard-subtitle {
          font-size: 1.1rem;
          margin: 0;
        }

        .commander-name {
          color: #00f6ff;
          font-weight: 700;
          text-shadow: 0 0 10px rgba(0, 246, 255, 0.5);
        }

        /* Quick Stats Bar Alienígena */
        .quick-stats-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1.5rem;
          height: 100%;
        }

        .alien-stat {
          position: relative;
        }

        .stat-compact {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stat-icon {
          font-size: 1.5rem;
          margin-bottom: 4px;
          filter: drop-shadow(0 0 8px rgba(0, 246, 255, 0.6));
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .stat-label-compact {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 4px;
        }

        .stat-divider-compact {
          color: #00f6ff;
          font-size: 1.2rem;
          filter: drop-shadow(0 0 6px rgba(0, 246, 255, 0.8));
        }

        .plan-badge-alien {
          background: linear-gradient(135deg, #ffd700, #ffb347);
          padding: 6px 14px;
          border-radius: 14px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #1a1a1a;
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
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
        {/* Navbar con Indi */}
        <IndiNavbar variant="gradient" position="sticky" showActions={true} />
        
        <Container className="py-4">
          {/* Centro de Comando Intergaláctico */}
          <div className="alien-command-center">
            {/* Partículas espaciales sutiles */}
            <div className="dashboard-particles">
              <span className="space-particle particle-1">✨</span>
              <span className="space-particle particle-2">🌟</span>
              <span className="space-particle particle-3">⭐</span>
              <span className="space-particle particle-4">💫</span>
            </div>
            
            <Row className="align-items-center">
              <Col lg={8}>
                <div className="dashboard-welcome">
                  <div className="alien-status-badge mb-2">
                    <span className="signal-indicator">📡</span>
                    <small>Conectado al Sistema Intergaláctico</small>
                  </div>
                  <h1 className="dashboard-title text-white mb-2">
                    Centro de Comando <span className="alien-glow-text">Intergaláctico</span>
                  </h1>
                  <p className="dashboard-subtitle text-white opacity-90">
                    Transmisión recibida, <span className="commander-name">Comandante {session?.user?.name?.split(' ')[0] || 'Usuario'}</span>
                  </p>
                </div>
              </Col>
              <Col lg={4}>
                <div className="quick-stats-bar">
                  <div className="stat-compact alien-stat">
                    <span className="stat-icon">🛸</span>
                    <span className="stat-value">{cards.length}</span>
                    <span className="stat-label-compact">Tarjetas Activas</span>
                  </div>
                  <div className="stat-divider-compact">⚡</div>
                  <div className="stat-compact alien-stat">
                    <span className="stat-icon">🌟</span>
                    <span className="stat-value plan-badge-alien">
                      {session?.user?.plan?.toString() === 'premium' ? 'PREMIUM' : 'FREE'}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>


          {/* Tab Content */}
          {pathname === '/dashboard' && (
            <>
              {/* Estadísticas Intergalácticas */}
              <Row className="mb-5 g-4">
                <Col md={6} lg={4}>
                  <Link href="/dashboard/cards" className="text-decoration-none">
                    <div className="stat-card alien-stat-card clickable-stat-card">
                      <div className="alien-glow-effect"></div>
                      <div className="icon-wrapper alien-primary-gradient text-white">
                        🛸
                      </div>
                      <h2 className="fw-bold text-dark mb-1">{cards.length}</h2>
                      <p className="text-muted mb-2">Tarjetas Digitales Premium</p>
                      <div className="module-description mb-3">
                        <small className="text-secondary">
                          Crea tu tarjeta digital con diseño exclusivo y propiedades interactivas. Compártela fácilmente por WhatsApp y atrae más clientes para tu negocio con efectos visuales únicos que nadie más tiene.
                        </small>
                      </div>
                      <div className="d-flex justify-content-center mb-3">
                        <span className="alien-badge bg-primary bg-opacity-10 text-primary fw-semibold">
                          En órbita: {cards.filter(card => card.isActive).length}
                        </span>
                      </div>
                      <div className="card-hover-text">
                        <small className="text-primary fw-semibold">Click para gestionar →</small>
                      </div>
                    </div>
                  </Link>
                </Col>
                <Col md={6} lg={4}>
                  <Link href="/dashboard/cv" className="text-decoration-none">
                    <div className="stat-card alien-stat-card clickable-stat-card">
                      <div className="alien-glow-effect"></div>
                      <div className="icon-wrapper alien-warning-gradient text-white">
                        🚀
                      </div>
                      <h2 className="fw-bold text-muted mb-1">0</h2>
                      <p className="text-muted mb-2">CVs con Inteligencia Alienígena</p>
                      <div className="module-description mb-3">
                        <small className="text-secondary">
                          Optimiza automáticamente tu currículum con IA avanzada. Usa plantillas ATS-friendly que pasan filtros automáticos y captan la atención de reclutadores al instante, multiplicando tus entrevistas de trabajo.
                        </small>
                      </div>
                      <div className="d-flex justify-content-center mb-3">
                        <span className="alien-badge bg-warning bg-opacity-10 text-warning fw-semibold">
                          Próximamente
                        </span>
                      </div>
                      <div className="card-hover-text">
                        <small className="text-warning fw-semibold">Click para crear →</small>
                      </div>
                    </div>
                  </Link>
                </Col>
                <Col md={6} lg={4}>
                  <Link href="/dashboard/presentations" className="text-decoration-none">
                    <div className="stat-card alien-stat-card clickable-stat-card">
                      <div className="alien-glow-effect"></div>
                      <div className="icon-wrapper alien-info-gradient text-white">
                        📡
                      </div>
                      <h2 className="fw-bold text-muted mb-1">0</h2>
                      <p className="text-muted mb-2">Presentaciones Inmersivas</p>
                      <div className="module-description mb-3">
                        <small className="text-secondary">
                          Hipnotiza a tu audiencia con presentaciones cinematográficas que convierten ideas en resultados. Elementos interactivos y transiciones que cierran más deals y generan impacto duradero en clientes.
                        </small>
                      </div>
                      <div className="d-flex justify-content-center mb-3">
                        <span className="alien-badge bg-info bg-opacity-10 text-info fw-semibold">
                          Próximamente
                        </span>
                      </div>
                      <div className="card-hover-text">
                        <small className="text-info fw-semibold">Click para explorar →</small>
                      </div>
                    </div>
                  </Link>
                </Col>
              </Row>

            </>
          )}
        </Container>
      </div>
    </AuthWrapper>
  );
}