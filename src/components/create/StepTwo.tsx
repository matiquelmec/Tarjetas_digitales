'use client';

import { Form, Row, Col, Card } from 'react-bootstrap';
import { useState } from 'react';

interface StepTwoProps {
  cardData: any;
  updateCardData: (field: string, value: any) => void;
}

export function StepTwo({ cardData, updateCardData }: StepTwoProps) {
  const templates = [
    { 
      id: 'modern', 
      name: 'Moderno', 
      description: 'Diseño limpio y profesional',
      preview: '🎨'
    },
    { 
      id: 'elegant', 
      name: 'Elegante', 
      description: 'Estilo sofisticado y minimalista',
      preview: '✨'
    },
    { 
      id: 'creative', 
      name: 'Creativo', 
      description: 'Colores vibrantes y dinámicos',
      preview: '🚀'
    },
    { 
      id: 'classic', 
      name: 'Clásico', 
      description: 'Tradicional y confiable',
      preview: '📊'
    },
  ];

  const colors = [
    '#007bff', '#6f42c1', '#e83e8c', '#dc3545',
    '#fd7e14', '#ffc107', '#28a745', '#20c997',
    '#17a2b8', '#6c757d', '#343a40', '#000000'
  ];

  return (
    <div>
      {/* Template Selection */}
      <div className="mb-4">
        <h5 className="mb-3">Selecciona una Plantilla</h5>
        <Row>
          {templates.map((template) => (
            <Col md={6} lg={3} key={template.id} className="mb-3">
              <Card 
                className={`cursor-pointer border-2 ${
                  cardData.template === template.id 
                    ? 'border-info bg-info bg-opacity-10' 
                    : 'border-secondary'
                }`}
                onClick={() => updateCardData('template', template.id)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="text-center">
                  <div style={{ fontSize: '2rem' }}>{template.preview}</div>
                  <h6 className="mt-2">{template.name}</h6>
                  <small className="text-muted">{template.description}</small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Color Selection */}
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Color Principal</Form.Label>
            <div className="d-flex flex-wrap gap-2 mb-2">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`rounded-circle cursor-pointer border ${
                    cardData.primaryColor === color ? 'border-white border-3' : 'border-dark'
                  }`}
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: color,
                    cursor: 'pointer'
                  }}
                  onClick={() => updateCardData('primaryColor', color)}
                />
              ))}
            </div>
            <Form.Control
              type="color"
              value={cardData.primaryColor}
              onChange={(e) => updateCardData('primaryColor', e.target.value)}
              className="w-100"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Color Secundario</Form.Label>
            <div className="d-flex flex-wrap gap-2 mb-2">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`rounded-circle cursor-pointer border ${
                    cardData.secondaryColor === color ? 'border-white border-3' : 'border-dark'
                  }`}
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: color,
                    cursor: 'pointer'
                  }}
                  onClick={() => updateCardData('secondaryColor', color)}
                />
              ))}
            </div>
            <Form.Control
              type="color"
              value={cardData.secondaryColor}
              onChange={(e) => updateCardData('secondaryColor', e.target.value)}
              className="w-100"
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Photo Upload */}
      <Form.Group className="mb-3">
        <Form.Label>Foto de Perfil (Opcional)</Form.Label>
        <Form.Control
          type="url"
          placeholder="https://ejemplo.com/mi-foto.jpg"
          value={cardData.photo}
          onChange={(e) => updateCardData('photo', e.target.value)}
        />
        <Form.Text className="text-muted">
          Puedes usar una URL de imagen o subirla más tarde
        </Form.Text>
      </Form.Group>

      <div className="bg-warning bg-opacity-10 p-3 rounded mt-4">
        <small className="text-warning">
          <strong>🎨 Recomendación:</strong> Los colores que elijas representarán tu marca personal. 
          Usa colores que reflejen tu profesión y personalidad.
        </small>
      </div>
    </div>
  );
}