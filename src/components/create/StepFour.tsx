'use client';

import { Form, Row, Col, Alert, Badge } from 'react-bootstrap';
import { useState, useEffect } from 'react';

interface StepFourProps {
  cardData: any;
  updateCardData: (field: string, value: any) => void;
}

export function StepFour({ cardData, updateCardData }: StepFourProps) {
  const [generatedUrl, setGeneratedUrl] = useState('');

  // Generate URL from name
  useEffect(() => {
    if (cardData.name) {
      const slug = cardData.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      const defaultUrl = `${slug}-${cardData.title?.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'professional'}`;
      setGeneratedUrl(defaultUrl);
      
      if (!cardData.customUrl) {
        updateCardData('customUrl', defaultUrl);
      }
    }
  }, [cardData.name, cardData.title]);

  const fullUrl = `https://tarjetasdigitales.netlify.app/c/${cardData.customUrl || generatedUrl}`;

  const completionPercentage = () => {
    const requiredFields = ['name', 'title', 'email'];
    const optionalFields = ['company', 'phone', 'linkedin', 'website'];
    
    const requiredCompleted = requiredFields.filter(field => cardData[field]).length;
    const optionalCompleted = optionalFields.filter(field => cardData[field]).length;
    
    const total = requiredFields.length + optionalFields.length;
    const completed = requiredCompleted + optionalCompleted;
    
    return Math.round((completed / total) * 100);
  };

  return (
    <div>
      {/* Preview Summary */}
      <div className="mb-4">
        <h5 className="mb-3">Resumen de tu Tarjeta</h5>
        
        <div className="bg-dark bg-opacity-25 p-4 rounded">
          <Row>
            <Col md={8}>
              <h4 className="text-primary">{cardData.name || 'Tu Nombre'}</h4>
              <p className="h6 text-muted">{cardData.title || 'Tu Título'}</p>
              {cardData.company && <p className="mb-2">📍 {cardData.company}</p>}
              {cardData.email && <p className="mb-2">📧 {cardData.email}</p>}
              {cardData.phone && <p className="mb-2">📱 +56 {cardData.phone}</p>}
              
              <div className="mt-3">
                {cardData.linkedin && <Badge bg="info" className="me-2">LinkedIn</Badge>}
                {cardData.twitter && <Badge bg="info" className="me-2">Twitter</Badge>}
                {cardData.instagram && <Badge bg="info" className="me-2">Instagram</Badge>}
                {cardData.website && <Badge bg="info" className="me-2">Website</Badge>}
              </div>
            </Col>
            <Col md={4} className="text-end">
              <div className="mb-2">
                <small className="text-muted">Completitud del perfil</small>
                <div className="fw-bold text-info">{completionPercentage()}%</div>
              </div>
              {cardData.photo && (
                <img 
                  src={cardData.photo} 
                  alt="Preview" 
                  className="rounded-circle"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
              )}
            </Col>
          </Row>
        </div>
      </div>

      {/* URL Configuration */}
      <div className="mb-4">
        <h5 className="mb-3">URL de tu Tarjeta</h5>
        
        <Form.Group className="mb-3">
          <Form.Label>URL Personalizada</Form.Label>
          <div className="input-group">
            <span className="input-group-text">tarjetasdigitales.netlify.app/c/</span>
            <Form.Control
              type="text"
              value={cardData.customUrl}
              onChange={(e) => updateCardData('customUrl', e.target.value)}
              placeholder={generatedUrl}
            />
          </div>
          <Form.Text className="text-muted">
            Solo letras, números y guiones. Debe ser único.
          </Form.Text>
        </Form.Group>

        <Alert variant="info">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Tu tarjeta estará disponible en:</strong><br/>
              <code>{fullUrl}</code>
            </div>
            <button
              className="btn btn-outline-info btn-sm"
              onClick={() => navigator.clipboard.writeText(fullUrl)}
            >
              📋 Copiar
            </button>
          </div>
        </Alert>
      </div>

      {/* Privacy Settings */}
      <div className="mb-4">
        <h5 className="mb-3">Configuración de Privacidad</h5>
        
        <Form.Check
          type="switch"
          id="public-switch"
          label="Hacer mi tarjeta pública (aparecerá en búsquedas)"
          checked={cardData.isPublic}
          onChange={(e) => updateCardData('isPublic', e.target.checked)}
          className="mb-3"
        />
      </div>

      {/* Upselling */}
      <Alert variant="warning">
        <h6>🚀 ¿Quieres llevar tu tarjeta al siguiente nivel?</h6>
        <p className="mb-2">
          Con el <strong>Plan Professional</strong> puedes:
        </p>
        <ul className="mb-3">
          <li>Dominio personalizado (alejandro.cards)</li>
          <li>Analytics detallados</li>
          <li>Sin marca de agua</li>
          <li>Múltiples tarjetas</li>
        </ul>
        <button className="btn btn-warning btn-sm">
          Ver Planes → desde $9.990 CLP
        </button>
      </Alert>
    </div>
  );
}