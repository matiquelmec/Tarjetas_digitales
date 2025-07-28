'use client';

import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import BusinessCardGenerator from '../components/BusinessCardGenerator';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container fluid className="min-vh-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
      <h1 className="my-4 text-center">Plataforma de Creación Digital</h1>
      <Row className="justify-content-center text-center w-100">
        <Col md={4} className="mb-4">
          <Card className="h-100" style={{ backgroundColor: '#2c2c2c', color: '#ffffff', border: 'none' }}>
            <Card.Body className="d-flex flex-column justify-content-between">
              <Card.Title>Generador de Tarjetas de Presentación</Card.Title>
              <Card.Text>
                Crea y personaliza tus tarjetas de presentación digitales con un editor intuitivo y diseños modernos.
              </Card.Text>
              <Link href="/business-card-generator" passHref>
                <Button variant="primary" style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}>Ir al Generador</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100" style={{ backgroundColor: '#2c2c2c', color: '#ffffff', border: 'none' }}>
            <Card.Body className="d-flex flex-column justify-content-between">
              <Card.Title>Generador de Currículums</Card.Title>
              <Card.Text>
                Sube tus CVs antiguos y mejóralos con nuestra IA, controlando el diseño y las funciones.
              </Card.Text>
              <Button variant="secondary" disabled>Próximamente</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100" style={{ backgroundColor: '#2c2c2c', color: '#ffffff', border: 'none' }}>
            <Card.Body className="d-flex flex-column justify-content-between">
              <Card.Title>Creador de Presentaciones</Card.Title>
              <Card.Text>
                Diseña presentaciones impactantes con herramientas intuitivas y plantillas profesionales.
              </Card.Text>
              <Button variant="secondary" disabled>Próximamente</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
