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
          right: 0;
          transform: translateY(-50%);
          z-index: 10;
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
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          color: white;
          border: none;
        }
        
        .btn-nav-primary:hover {
          background: linear-gradient(135deg, #00d4e7, #0056cc);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 246, 255, 0.3);
          color: white;
        }
        
        .btn-nav-outline {
          background: transparent;
          color: #00f6ff;
          border: 2px solid rgba(0, 246, 255, 0.5);
        }
        
        .btn-nav-outline:hover {
          background: rgba(0, 246, 255, 0.1);
          border-color: #00f6ff;
          transform: translateY(-2px);
          color: #00f6ff;
        }
        
        .btn-nav-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .btn-nav-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          transform: translateY(-2px);
        }
        
        .user-greeting {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
          font-weight: 500;
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
        }
      `}</style>
      
      <div className={getNavbarClasses()}>
        <Container fluid>
          <Row className="align-items-center position-relative">
            {/* Logo Indi - Centrado absoluto */}
            <Col xs={12} className="d-flex justify-content-center">
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
                      <Link href="/pricing" className="btn-nav btn-nav-outline">
                        ⭐ Actualizar Plan
                      </Link>
                      <Link href="/dashboard" className="btn-nav btn-nav-outline">
                        🛸 Dashboard
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