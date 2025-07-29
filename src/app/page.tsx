'use client';

import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleCreateCard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Create card button clicked');
    alert('Button clicked! Navigating to create page...');
    
    // Try multiple navigation methods
    try {
      router.push('/create');
    } catch (error) {
      console.error('Router push failed:', error);
      // Fallback to window.location
      window.location.href = '/create';
    }
  };
  
  return (
    <>
      <style jsx global>{`
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient-background {
          background: linear-gradient(-45deg, #00c6ff, #0072ff, #8e2de2, #4a00e0);
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }
        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.5);
        }
        .btn-modern {
          background-color: #007bff;
          border-color: #007bff;
          transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;
        }
        .btn-modern:hover {
          background-color: #0056b3;
          border-color: #0056b3;
        }
        .btn-disabled {
          background-color: #6c757d !important;
          border-color: #6c757d !important;
          cursor: not-allowed;
        }
      `}</style>
      <div className="animated-gradient-background min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <Container fluid className="py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="text-center display-4 fw-bold" style={{ color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Digital Business Cards Platform</h1>
            <div>
              <div className="d-flex gap-2">
                {session ? (
                  <>
                    <Link href="/pricing">
                      <Button variant="outline-warning">Upgrade</Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline-light">Dashboard</Button>
                    </Link>
                    <Button variant="outline-secondary" onClick={() => signOut()}>
                      Sign Out
                    </Button>
                    <span className="text-white align-self-center">Welcome, {session.user?.name}</span>
                  </>
                ) : (
                  <Button variant="outline-light" onClick={() => signIn('google')}>
                    Sign In with Google
                  </Button>
                )}
              </div>
            </div>
          </div>
          <Row className="justify-content-center text-center w-100">
            <Col md={4} className="mb-4">
              <Card className="h-100 glass-card text-white">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <Card.Title className="h3 mb-3">Business Card Generator</Card.Title>
                  <Card.Text className="mb-4">
                    Create and customize your digital business cards with an intuitive editor and modern designs.
                  </Card.Text>
                  <div>
                    <a 
                      href="/create"
                      style={{ 
                        textDecoration: 'none',
                        display: 'block',
                        width: '100%'
                      }}
                      onClick={handleCreateCard}
                    >
                      <Button 
                        variant="primary" 
                        className="btn-modern w-100"
                        type="button"
                        as="div"
                      >
                        Crear Tarjeta
                      </Button>
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 glass-card text-white">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <Card.Title className="h3 mb-3">Generador de Currículums</Card.Title>
                  <Card.Text className="mb-4">
                    Sube tus CVs antiguos y mejóralos con nuestra IA, controlando el diseño y las funciones.
                  </Card.Text>
                  <Button variant="secondary" disabled className="btn-disabled w-100">Próximamente</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 glass-card text-white">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <Card.Title className="h3 mb-3">Creador de Presentaciones</Card.Title>
                  <Card.Text className="mb-4">
                    Diseña presentaciones impactantes con herramientas intuitivas y plantillas profesionales.
                  </Card.Text>
                  <Button variant="secondary" disabled className="btn-disabled w-100">Próximamente</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
