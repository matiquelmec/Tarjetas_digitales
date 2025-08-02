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
        }
        
        .navbar-sticky {
          position: sticky;
          top: 0;
        }
        
        .nav-actions-container {
          position: absolute;
          top: 50%;
          right: 15px;
          transform: translateY(-50%);
          z-index: 10;
          pointer-events: auto;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 12px 20px;
          border: 1px solid rgba(0, 246, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .nav-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }
        
        .btn-nav {
          font-size: 0.85rem;
          font-weight: 700;
          padding: 10px 18px;
          border-radius: 20px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          border: none;
          position: relative;
          overflow: hidden;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .btn-nav::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease;
        }
        
        .btn-nav:hover::before {
          left: 100%;
        }
        
        .btn-nav-primary {
          background: linear-gradient(135deg, #00f6ff, #0072ff, #8e2de2);
          background-size: 200% 200%;
          animation: alienPulse 3s ease-in-out infinite;
          color: white;
          border: none;
          box-shadow: 0 4px 15px rgba(0, 246, 255, 0.4);
        }
        
        @keyframes alienPulse {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .btn-nav-primary:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 25px rgba(0, 246, 255, 0.6);
          color: white;
        }
        
        .btn-nav-outline {
          background: rgba(0, 246, 255, 0.1);
          color: #00f6ff;
          border: 2px solid rgba(0, 246, 255, 0.6);
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 10px rgba(0, 246, 255, 0.2);
        }
        
        .btn-nav-outline:hover {
          background: rgba(0, 246, 255, 0.2);
          border-color: #00f6ff;
          transform: translateY(-3px) scale(1.05);
          color: #ffffff;
          box-shadow: 0 6px 20px rgba(0, 246, 255, 0.4);
        }
        
        .btn-nav-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }
        
        .btn-nav-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          transform: translateY(-3px) scale(1.05);
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);
        }
        
        .user-greeting {
          background: linear-gradient(135deg, rgba(0, 246, 255, 0.2), rgba(142, 45, 226, 0.2));
          backdrop-filter: blur(15px);
          border: 1px solid rgba(0, 246, 255, 0.3);
          border-radius: 20px;
          padding: 8px 16px;
          color: #00f6ff;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(0, 246, 255, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .user-greeting::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 246, 255, 0.1), transparent);
          animation: greetingScan 3s ease-in-out infinite;
        }
        
        @keyframes greetingScan {
          0%, 100% { left: -100%; }
          50% { left: 100%; }
        }
        
        @media (max-width: 768px) {
          .indi-navbar-container {
            padding: 1rem 0;
          }
          
          .nav-actions-container {
            position: static;
            transform: none;
            margin-top: 1rem;
            width: 100%;
            display: flex;
            justify-content: center;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(25px);
            border-radius: 30px;
            padding: 16px 24px;
            border: 1px solid rgba(0, 246, 255, 0.3);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          }
          
          .nav-actions {
            gap: 0.4rem;
            justify-content: center;
            flex-wrap: wrap;
            width: 100%;
          }
          
          .btn-nav {
            font-size: 0.75rem;
            padding: 8px 14px;
            border-radius: 18px;
            flex: 1;
            min-width: fit-content;
            text-align: center;
          }
          
          .user-greeting {
            text-align: center;
            width: 100%;
            margin-top: 0.75rem;
            font-size: 0.8rem;
            padding: 6px 12px;
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
              <div className="nav-actions-container">
                <div className="nav-actions">
                  {session ? (
                    <>
                      <Link href="/create" className="btn-nav btn-nav-primary">
                        ✨ Crear
                      </Link>
                      <Link href="/dashboard" className="btn-nav btn-nav-outline">
                        🛸 Dashboard
                      </Link>
                      <Link href="/pricing" className="btn-nav btn-nav-outline">
                        ⭐ Planes
                      </Link>
                      <button 
                        onClick={() => signOut()} 
                        className="btn-nav btn-nav-secondary"
                      >
                        👋 Salir
                      </button>
                      <div className="user-greeting">
                        Hola, {session.user?.name?.split(' ')[0] || 'Terrícola'} 🛸
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