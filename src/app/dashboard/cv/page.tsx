'use client';

import { Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function CVPage() {
  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="text-center p-5 bg-dark text-white">
            <Card.Body>
              <h1 className="mb-4">🚀 CVs Inteligentes</h1>
              <p className="lead mb-4">
                Esta sección está en construcción. ¡Vuelve pronto para transformar tu CV con el poder de la IA!
              </p>
              <Button variant="primary" href="/dashboard">
                Volver al Dashboard
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
