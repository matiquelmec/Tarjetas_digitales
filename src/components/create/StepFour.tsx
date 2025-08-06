'use client';

import { Form, Row, Col, Alert, Badge } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CardData {
  name: string;
  title: string;
  company?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
  photo?: string;
  customUrl?: string;
  isPublic: boolean;
  enableHoverEffect?: boolean;
  enableGlassmorphism?: boolean;
  enableSubtleAnimations?: boolean;
  enableBackgroundPatterns?: boolean;
  enableParticles?: boolean;
  template?: string;
}

interface StepFourProps {
  cardData: CardData;
  updateCardData: (field: string, value: string | boolean) => void;
}

export function StepFour({ cardData, updateCardData }: StepFourProps) {
  const [generatedUrl, setGeneratedUrl] = useState('');

  // Generate clean URL from name
  useEffect(() => {
    if (cardData.name) {
      // Limpiar y procesar el nombre
      const cleanName = cardData.name
        .trim()
        .replace(/dr\.|dra\.|ing\.|lic\.|prof\./gi, '') // Remover títulos
        .replace(/\s+/g, ' ') // Normalizar espacios
        .trim();
      
      const nameParts = cleanName.split(' ');
      let simpleName = '';
      
      // Tomar primer nombre y primer apellido si existe
      if (nameParts.length >= 2) {
        simpleName = `${nameParts[0]}-${nameParts[nameParts.length - 1]}`;
      } else {
        simpleName = nameParts[0];
      }
      
      const slug = simpleName
        .toLowerCase()
        .normalize('NFD') // Descomponer caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '') // Remover acentos
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      // URL limpia sin número (se agregará solo si hay conflicto en el servidor)
      const defaultUrl = slug;
      
      setGeneratedUrl(defaultUrl);
      
      if (!cardData.customUrl) {
        updateCardData('customUrl', defaultUrl);
      }
    }
  }, [cardData.name, cardData.customUrl, updateCardData]);

  const completionPercentage = () => {
    const requiredFields = ['name', 'title', 'email'];
    const optionalFields = ['company', 'phone', 'linkedin', 'website'];
    
    const requiredCompleted = requiredFields.filter(field => cardData[field as keyof CardData]).length;
    const optionalCompleted = optionalFields.filter(field => cardData[field as keyof CardData]).length;
    
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
                <Image 
                  src={cardData.photo} 
                  alt="Preview" 
                  width={80}
                  height={80}
                  className="rounded-circle"
                  style={{ objectFit: 'cover' }}
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
          <div>
            <strong>Tu tarjeta estará disponible después de publicarla</strong><br/>
            <small className="text-muted">Se generará una URL única automáticamente</small>
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

      {/* Recordatorio de funciones premium */}
      {(cardData.enableHoverEffect || cardData.enableGlassmorphism || 
        cardData.enableSubtleAnimations || cardData.enableBackgroundPatterns || 
        cardData.enableParticles || cardData.template !== 'modern') && (
        <Alert variant="info">
          <h6>💎 Recordatorio sobre funciones premium</h6>
          <p className="mb-2">
            Has seleccionado efectos y diseños premium. Estas funciones tienen un <strong>costo único de $4.990 CLP</strong>.
          </p>
          <p className="mb-0 small">
            Si prefieres no pagar, puedes volver al <strong>Paso 2</strong> y seleccionar las alternativas gratuitas:
            <br />• Template: Modern (gratuito)
            <br />• Desactivar todos los efectos visuales
          </p>
        </Alert>
      )}

    </div>
  );
}