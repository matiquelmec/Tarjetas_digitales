'use client';

import { useSession, signIn } from 'next-auth/react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Container fluid className="animated-gradient-background min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-white">Loading...</div>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container fluid className="animated-gradient-background min-vh-100 d-flex justify-content-center align-items-center">
        <style jsx global>{`
          .animated-gradient-background {
            background: linear-gradient(-45deg, #00c6ff, #0072ff, #8e2de2, #4a00e0);
            background-size: 400% 400%;
            animation: gradientAnimation 15s ease infinite;
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
          }
        `}</style>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="glass-card text-white text-center p-4">
              <Card.Body>
                <h2 className="mb-4">Sign in to create your digital business card</h2>
                <p className="mb-4">
                  Create professional digital business cards with our advanced visual editor. 
                  Modern designs, instant sharing, and powerful customization.
                </p>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => signIn('google')}
                  className="w-100"
                >
                  Sign in with Google
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return <>{children}</>;
}