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

        /* Hero Section Dinámico */
        .hero-section {
          position: relative;
          padding: 3rem 2rem;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          margin-bottom: 3rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          overflow: hidden;
        }

        .min-vh-50 {
          min-height: 50vh;
        }

        /* Partículas de fondo */
        .hero-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }

        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: particleFloat 8s ease-in-out infinite;
        }

        .particle-1 { top: 20%; left: 10%; animation-delay: 0s; }
        .particle-2 { top: 60%; left: 20%; animation-delay: -2s; }
        .particle-3 { top: 30%; left: 70%; animation-delay: -4s; }
        .particle-4 { top: 80%; left: 60%; animation-delay: -6s; }
        .particle-5 { top: 40%; left: 90%; animation-delay: -8s; }

        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
          33% { transform: translateY(-10px) scale(1.1); opacity: 1; }
          66% { transform: translateY(-5px) scale(0.9); opacity: 0.8; }
        }

        /* Contenido del hero */
        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-block;
        }

        .badge-text {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
          border: 1px solid rgba(59, 130, 246, 0.3);
          padding: 8px 16px;
          border-radius: 20px;
          color: #60a5fa;
          font-size: 0.9rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          line-height: 1.1;
          font-family: 'Montserrat', sans-serif;
        }

        .hero-highlight {
          background: linear-gradient(135deg, #00f6ff, #0072ff, #8e2de2);
          background-size: 200% 200%;
          animation: gradientShift 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.3rem);
          line-height: 1.6;
          max-width: 90%;
        }

        /* CTAs Mejorados */
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .hero-cta-primary {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border: none;
          padding: 16px 32px;
          border-radius: 16px;
          font-weight: 700;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          font-size: 1.1rem;
        }

        .hero-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(59, 130, 246, 0.4);
          background: linear-gradient(135deg, #2563eb, #1e40af);
        }

        .hero-cta-secondary {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 16px 32px;
          border-radius: 16px;
          font-weight: 600;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          font-size: 1.1rem;
        }

        .hero-cta-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
          color: white;
        }

        .cta-icon {
          margin-right: 8px;
          font-size: 1.2em;
        }

        .cta-arrow {
          margin-left: 8px;
          transition: transform 0.3s ease;
        }

        .hero-cta-primary:hover .cta-arrow {
          transform: translateX(4px);
        }

        /* Stats rápidas */
        .hero-stats {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 800;
          color: #00f6ff;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-divider {
          color: rgba(255, 255, 255, 0.4);
          font-size: 1.2rem;
        }

        /* Tarjeta flotante */
        .hero-preview {
          position: relative;
          z-index: 2;
        }

        .floating-card-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
        }

        .floating-card {
          width: 320px;
          height: 200px;
          background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
          border-radius: 20px;
          padding: 24px;
          position: relative;
          animation: cardFloat 6s ease-in-out infinite;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
        }

        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px) rotateY(0deg); }
          25% { transform: translateY(-10px) rotateY(2deg); }
          50% { transform: translateY(-5px) rotateY(0deg); }
          75% { transform: translateY(-15px) rotateY(-2deg); }
        }

        .card-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, #00f6ff, #0072ff, #8e2de2);
          border-radius: 22px;
          z-index: -1;
          opacity: 0.5;
          filter: blur(8px);
          animation: glowPulse 3s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        .card-content {
          position: relative;
          z-index: 2;
          color: white;
        }

        .card-header {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }

        .profile-img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          margin-right: 12px;
          flex-shrink: 0;
        }

        .profile-info h4 {
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
          font-family: 'Montserrat', sans-serif;
        }

        .profile-info p {
          font-size: 0.9rem;
          margin: 0;
          opacity: 0.8;
        }

        .feature-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .feature-icon {
          margin-right: 8px;
          font-size: 1.1em;
        }

        /* Decoraciones */
        .decoration {
          position: absolute;
          font-size: 2rem;
          opacity: 0.6;
          animation: decorationFloat 4s ease-in-out infinite;
          pointer-events: none;
        }

        .decoration-1 {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .decoration-2 {
          top: 20%;
          right: 15%;
          animation-delay: -1.5s;
        }

        .decoration-3 {
          bottom: 20%;
          left: 15%;
          animation-delay: -3s;
        }

        @keyframes decorationFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-15px) rotate(10deg); opacity: 1; }
        }

        /* Barra de información de usuario */
        .user-info-bar {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 16px 24px;
          margin-top: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-welcome {
          color: white;
        }

        .welcome-text {
          opacity: 0.8;
        }

        .user-name {
          font-weight: 700;
          color: #00f6ff;
        }

        .user-action-btn {
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .user-action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }

        /* Responsive */
        @media (max-width: 991px) {
          .hero-section {
            padding: 2rem 1rem;
          }
          
          .floating-card-container {
            height: 300px;
            margin-top: 2rem;
          }
          
          .floating-card {
            width: 280px;
            height: 180px;
            padding: 20px;
          }
          
          .hero-actions {
            justify-content: center;
          }
          
          .hero-stats {
            justify-content: center;
          }
        }
      `}</style>
      <div className="animated-gradient-background">
        <Container className="py-5">
          {/* Hero Section Dinámico */}
          <div className="hero-section">
            {/* Partículas de fondo */}
            <div className="hero-particles">
              <div className="particle particle-1"></div>
              <div className="particle particle-2"></div>
              <div className="particle particle-3"></div>
              <div className="particle particle-4"></div>
              <div className="particle particle-5"></div>
            </div>
            
            <Row className="align-items-center min-vh-50">
              <Col lg={7}>
                <div className="hero-content">
                  <div className="hero-badge mb-3">
                    <span className="badge-text">🚀 Plataforma Digital Profesional</span>
                  </div>
                  <h1 className="hero-title text-white mb-3">
                    Tu Identidad Digital
                    <br />
                    <span className="hero-highlight">Hipnotizante</span>
                  </h1>
                  <p className="hero-subtitle text-white opacity-90 mb-4 fs-5">
                    Crea tarjetas digitales, CVs inteligentes y presentaciones cinematográficas 
                    que <strong>elevan tu imagen profesional</strong> a otro nivel
                  </p>
                  
                  {/* CTA Principal Mejorado */}
                  <div className="hero-actions mb-4">
                    <Link href="/create">
                      <Button 
                        className="hero-cta-primary me-3 mb-2"
                        size="lg"
                      >
                        <span className="cta-icon">💼</span>
                        Crear Mi Primera Tarjeta
                        <span className="cta-arrow">→</span>
                      </Button>
                    </Link>
                    <Link href="/pricing">
                      <Button 
                        className="hero-cta-secondary mb-2"
                        size="lg"
                      >
                        <span className="cta-icon">⭐</span>
                        Ver Planes Premium
                      </Button>
                    </Link>
                  </div>

                  {/* Stats Rápidas */}
                  <div className="hero-stats">
                    <div className="stat-item">
                      <span className="stat-number">{cards.length}</span>
                      <span className="stat-label">Tarjetas</span>
                    </div>
                    <div className="stat-divider">•</div>
                    <div className="stat-item">
                      <span className="stat-number">{cards.reduce((sum, card) => sum + card.views, 0)}</span>
                      <span className="stat-label">Vistas</span>
                    </div>
                    <div className="stat-divider">•</div>
                    <div className="stat-item">
                      <span className="stat-number">{session?.user?.plan || 'FREE'}</span>
                      <span className="stat-label">Plan</span>
                    </div>
                  </div>
                </div>
              </Col>
              
              <Col lg={5}>
                <div className="hero-preview">
                  {/* Tarjeta Flotante Animada */}
                  <div className="floating-card-container">
                    <div className="floating-card stellar-preview">
                      <div className="card-glow"></div>
                      <div className="card-content">
                        <div className="card-header">
                          <div className="profile-img"></div>
                          <div className="profile-info">
                            <h4>{session?.user?.name || 'Tu Nombre'}</h4>
                            <p>Professional Digital</p>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="feature-item">
                            <span className="feature-icon">✨</span>
                            <span>Efectos Glassmorphism</span>
                          </div>
                          <div className="feature-item">
                            <span className="feature-icon">🎨</span>
                            <span>Tipografía Estratégica</span>
                          </div>
                          <div className="feature-item">
                            <span className="feature-icon">⭐</span>
                            <span>Template Stellar</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Elementos decorativos */}
                    <div className="decoration decoration-1">💼</div>
                    <div className="decoration decoration-2">✨</div>
                    <div className="decoration decoration-3">🚀</div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Información de Usuario Mejorada */}
            <div className="user-info-bar">
              <div className="d-flex justify-content-between align-items-center">
                <div className="user-welcome">
                  <span className="welcome-text">Bienvenido de vuelta, </span>
                  <span className="user-name">{session?.user?.name?.split(' ')[0] || 'Usuario'}</span>
                </div>
                <div className="user-actions d-flex gap-2">
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    onClick={() => signOut()}
                    className="user-action-btn"
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </div>
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