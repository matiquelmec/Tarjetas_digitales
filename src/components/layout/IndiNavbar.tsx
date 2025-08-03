'use client';

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import IndiLogo from '@/components/ui/IndiLogo';

interface IndiNavbarProps {
  variant?: 'transparent' | 'solid' | 'gradient';
  position?: 'fixed' | 'sticky' | 'relative';
  showActions?: boolean;
}

const IndiNavbar: React.FC<IndiNavbarProps> = ({
  variant = 'transparent',
  position = 'relative',
  showActions = true
}) => {
  const { data: session } = useSession();

  const getNavbarClasses = () => {
    let classes = 'indi-navbar-container';
    
    switch (variant) {
      case 'solid':
        classes += ' navbar-solid';
        break;
      case 'gradient':
        classes += ' navbar-gradient';
        break;
      default:
        classes += ' navbar-transparent';
    }
    
    if (position !== 'relative') {
      classes += ` navbar-${position}`;
    }
    
    return classes;
  };

  return (
    <>
      <style jsx>{`
        .indi-navbar-container {
          padding: 2rem 0;
          transition: all 0.3s ease;
          z-index: 1000;
        }
        
        .navbar-transparent {
          background: transparent;
        }
        
        .navbar-solid {
          background: rgba(15, 12, 41, 0.95);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(0, 246, 255, 0.2);
        }
        
        .navbar-gradient {
          background: linear-gradient(135deg, 
            rgba(0, 198, 255, 0.1), 
            rgba(0, 114, 255, 0.1), 
            rgba(142, 45, 226, 0.1)
          );
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 246, 255, 0.3);
        }
        
        .navbar-fixed {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999;
          background: rgba(15, 12, 41, 0.95);
          backdrop-filter: blur(15px);
        }
        
        .navbar-sticky {
          position: sticky;
          top: 0;
        }
        
        .nav-actions-container {
          position: absolute;
          top: 20px;
          right: 20px;
          transform: none;
          z-index: 10;
          pointer-events: auto;
        }
        
        .nav-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-items: center;
        }
        
        .btn-nav {
          font-size: 0.9rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          transition: all 0.3s ease;
          text-decoration: none;
          border: none;
        }
        
        .btn-nav-primary {
          background: rgba(255, 255, 255, 0.9);
          color: #1a1a1a;
          border: 2px solid rgba(255, 255, 255, 0.3);
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }
        
        .btn-nav-primary:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.5);
          color: #000000;
          border-color: rgba(255, 255, 255, 0.8);
        }
        
        .btn-nav-outline {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.4);
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }
        
        .btn-nav-outline:hover {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(255, 255, 255, 0.8);
          transform: translateY(-3px) scale(1.02);
          color: #1a1a1a;
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4);
        }
        
        .btn-nav-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.5);
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }
        
        .btn-nav-secondary:hover {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(255, 255, 255, 0.8);
          color: #1a1a1a;
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4);
        }
        
        .btn-nav-upgrade {
          background: linear-gradient(135deg, #D4A017, #B8860B);
          color: white;
          border: 2px solid #D4A017;
          font-weight: 700;
          box-shadow: 0 6px 20px rgba(212, 160, 23, 0.4);
          backdrop-filter: blur(10px);
          animation: upgradeGlow 2s ease-in-out infinite alternate;
        }
        
        .btn-nav-upgrade:hover {
          background: linear-gradient(135deg, #E5B41F, #CD950C);
          border-color: #E5B41F;
          color: white;
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 10px 30px rgba(212, 160, 23, 0.6);
        }
        
        @keyframes upgradeGlow {
          0% { 
            box-shadow: 0 6px 20px rgba(212, 160, 23, 0.4);
          }
          100% { 
            box-shadow: 0 8px 25px rgba(212, 160, 23, 0.6), 0 0 20px rgba(212, 160, 23, 0.3);
          }
        }
        
        .user-greeting {
          background: rgba(255, 255, 255, 0.25);
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 20px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(15px);
          white-space: nowrap;
        }
        
        /* Forzar posición fija en la derecha SIEMPRE */
        .nav-actions-fixed-right {
          position: fixed !important;
          top: 20px !important;
          right: 20px !important;
          left: auto !important;
          transform: none !important;
          margin: 0 !important;
          width: auto !important;
          display: block !important;
          justify-content: flex-start !important;
        }
        
        @media (max-width: 768px) {
          .indi-navbar-container {
            padding: 1rem 0;
          }
          
          /* Mantener posición fija incluso en móvil pero más abajo para no solapar */
          .nav-actions-fixed-right {
            position: fixed !important;
            top: 80px !important;
            right: 15px !important;
            left: auto !important;
            transform: none !important;
            margin: 0 !important;
            width: auto !important;
            display: block !important;
            justify-content: flex-start !important;
          }
          
          .nav-actions {
            gap: 0.5rem;
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .btn-nav {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
          }
          
          .user-greeting {
            text-align: center;
            width: 100%;
            margin-top: 0.5rem;
          }
          
          .btn-nav-upgrade {
            order: -1; /* Mostrar primero en móvil */
            flex-basis: 100%;
            margin-bottom: 0.5rem;
          }
        }
        
        /* Forzar centrado del logo */
        .logo-container {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Asegurar que el container no interfiera */
        .navbar-container-fix {
          margin: 0 !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
      `}</style>
      
      <div className={getNavbarClasses()}>
        <Container fluid className="navbar-container-fix">
          <Row className="align-items-center position-relative">
            {/* Logo Indi - Centrado absoluto */}
            <Col xs={12} className="logo-container">
              <IndiLogo
                variant="navbar"
                size="xl"
                animated={true}
                interactive={true}
                showName={true}
                href="/"
                state="normal"
              />
            </Col>
            
            {/* Acciones - Posición absoluta derecha */}
            {showActions && (
              <div className="nav-actions-container nav-actions-fixed-right" style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1000
              }}>
                <div className="nav-actions">
                  {session ? (
                    <>
                      <Link href="/pricing" className="btn-nav btn-nav-upgrade">
                        ⭐ Actualizar Plan
                      </Link>
                      <Link href="/dashboard" className="btn-nav btn-nav-outline">
                        📊 Dashboard
                      </Link>
                      <Link href="/create" className="btn-nav btn-nav-primary">
                        ✨ Crear
                      </Link>
                      <button 
                        onClick={() => signOut()} 
                        className="btn-nav btn-nav-secondary"
                      >
                        👋 Salir
                      </button>
                      <div className="user-greeting d-none d-md-block">
                        Hola, {session.user?.name?.split(' ')[0] || 'Terrícola'} 👋
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/demo" className="btn-nav btn-nav-outline">
                        🌟 Demo
                      </Link>
                      <Link href="/pricing" className="btn-nav btn-nav-outline">
                        💰 Precios
                      </Link>
                      <button 
                        onClick={() => signIn('google')} 
                        className="btn-nav btn-nav-primary"
                      >
                        🚀 Comenzar Viaje
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default IndiNavbar;