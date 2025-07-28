'use client';

import { Form, Row, Col, InputGroup } from 'react-bootstrap';

interface StepOneProps {
  cardData: any;
  updateCardData: (field: string, value: any) => void;
}

export function StepOne({ cardData, updateCardData }: StepOneProps) {
  return (
    <div>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre Completo *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Alejandro Torres"
              value={cardData.name}
              onChange={(e) => updateCardData('name', e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Título Profesional *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Desarrollador Full-Stack"
              value={cardData.title}
              onChange={(e) => updateCardData('title', e.target.value)}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Empresa</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Tech Solutions Inc."
              value={cardData.company}
              onChange={(e) => updateCardData('company', e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              placeholder="alejandro@ejemplo.com"
              value={cardData.email}
              onChange={(e) => updateCardData('email', e.target.value)}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <InputGroup>
              <InputGroup.Text>+56</InputGroup.Text>
              <Form.Control
                type="tel"
                placeholder="987654321"
                value={cardData.phone}
                onChange={(e) => updateCardData('phone', e.target.value)}
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>WhatsApp</Form.Label>
            <InputGroup>
              <InputGroup.Text>+56</InputGroup.Text>
              <Form.Control
                type="tel"
                placeholder="987654321"
                value={cardData.whatsapp}
                onChange={(e) => updateCardData('whatsapp', e.target.value)}
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <div className="bg-info bg-opacity-10 p-3 rounded mt-4">
        <small className="text-info">
          <strong>💡 Tip:</strong> Los campos marcados con * son obligatorios. 
          Tu tarjeta será más efectiva con información completa y profesional.
        </small>
      </div>
    </div>
  );
}