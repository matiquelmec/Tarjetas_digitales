'use client';

import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import styles from './page.module.css';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleCreateCard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Create card button clicked');
    
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
    <div className={styles.animatedGradientBackground}>
        <Container fluid className="py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className={`text-center display-4 fw-bold ${styles.header}`}>Digital Business Cards Platform</h1>
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
              <Card className={styles.glassCard}>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <Card.Title className={styles.cardTitle}>Business Card Generator</Card.Title>
                  <Card.Text className={styles.cardText}>
                    Create and customize your digital business cards with an intuitive editor and modern designs.
                  </Card.Text>
                  <div>
                    <a 
                      href="/create"
                      className={styles.buttonLink}
                      onClick={handleCreateCard}
                    >
                      <Button 
                        variant="primary" 
                        className={styles.btnModern}
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
              <Card className={styles.glassCard}>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <Card.Title className={styles.cardTitle}>Generador de Currículums</Card.Title>
                  <Card.Text className={styles.cardText}>
                    Sube tus CVs antiguos y mejóralos con nuestra IA, controlando el diseño y las funciones.
                  </Card.Text>
                  <Button variant="secondary" disabled className={styles.btnDisabled}>Próximamente</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className={styles.glassCard}>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <Card.Title className={styles.cardTitle}>Creador de Presentaciones</Card.Title>
                  <Card.Text className={styles.cardText}>
                    Diseña presentaciones impactantes con herramientas intuitivas y plantillas profesionales.
                  </Card.Text>
                  <Button variant="secondary" disabled className={styles.btnDisabled}>Próximamente</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
  );
}
