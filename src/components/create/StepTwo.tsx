'use client';

import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import { useState, useRef } from 'react';
import Image from 'next/image';

interface StepTwoProps {
  cardData: any;
  updateCardData: (field: string, value: any) => void;
}

export function StepTwo({ cardData, updateCardData }: StepTwoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const minimalistPalettes = [
    { 
      name: 'Carbón y Naranja', 
      cardBackgroundColor: '#2c2c2c', 
      cardTextColor: '#ffffff', 
      buttonSecondaryColor: '#ff6600', 
      buttonSecondaryHoverColor: '#cc5200'
    },
    { 
      name: 'Menta y Negro', 
      cardBackgroundColor: '#ffffff', 
      cardTextColor: '#1a1a1a', 
      buttonSecondaryColor: '#1abc9c', 
      buttonSecondaryHoverColor: '#16a085'
    },
    { 
      name: 'Azul Nórdico', 
      cardBackgroundColor: '#d8dee9', 
      cardTextColor: '#2e3440', 
      buttonSecondaryColor: '#5e81ac', 
      buttonSecondaryHoverColor: '#4c6a91'
    },
    { 
      name: 'Arena y Tinta', 
      cardBackgroundColor: '#f5e5c4', 
      cardTextColor: '#2c3e50', 
      buttonSecondaryColor: '#cb4b16', 
      buttonSecondaryHoverColor: '#b58900'
    },
    { 
      name: 'Lavanda y Carbón', 
      cardBackgroundColor: '#ffffff', 
      cardTextColor: '#2c2c2c', 
      buttonSecondaryColor: '#9b59b6', 
      buttonSecondaryHoverColor: '#8e44ad'
    },
  ];

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

  const handlePhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateCardData('photo', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handlePhotoUpload(file);
    }
  };

  const applyPalette = (palette: any) => {
    updateCardData('cardBackgroundColor', palette.cardBackgroundColor);
    updateCardData('cardTextColor', palette.cardTextColor);
    updateCardData('buttonSecondaryColor', palette.buttonSecondaryColor);
    updateCardData('buttonSecondaryHoverColor', palette.buttonSecondaryHoverColor);
  };

  return (
    <div>
      {/* Template Selection */}
      <div className="mb-4">
        <h5 className="mb-3">🎨 Selecciona una Plantilla</h5>
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

      {/* Photo Upload with Drag & Drop */}
      <div className="mb-4">
        <h5 className="mb-3">📸 Foto de Perfil</h5>
        <div
          className={`border-2 border-dashed rounded p-4 text-center ${
            dragActive ? 'border-info bg-info bg-opacity-10' : 'border-secondary'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{ cursor: 'pointer' }}
          onClick={() => fileInputRef.current?.click()}
        >
          {cardData.photo ? (
            <div>
              <Image 
                src={cardData.photo} 
                alt="Preview" 
                width={100}
                height={100}
                className="rounded-circle mb-2"
                style={{ objectFit: 'cover' }}
              />
              <p className="mb-2">✅ Foto cargada</p>
              <Button variant="outline-info" size="sm">
                Cambiar foto
              </Button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '3rem' }}>📸</div>
              <p className="mb-2">Arrastra y suelta tu foto aquí</p>
              <p className="text-muted">o haz clic para seleccionar</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
        </div>
        
        <Form.Group className="mt-3">
          <Form.Label>O ingresa URL de imagen</Form.Label>
          <Form.Control
            type="url"
            placeholder="https://ejemplo.com/mi-foto.jpg"
            value={typeof cardData.photo === 'string' && cardData.photo.startsWith('http') ? cardData.photo : ''}
            onChange={(e) => updateCardData('photo', e.target.value)}
          />
        </Form.Group>
      </div>

      {/* AI Palette Selection */}
      <div className="mb-4">
        <h5 className="mb-3">🤖 Paletas con IA</h5>
        <Row>
          {minimalistPalettes.map((palette, index) => (
            <Col md={6} lg={4} key={index} className="mb-3">
              <Card 
                className="cursor-pointer border-2 hover-card"
                onClick={() => applyPalette(palette)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="text-center p-2">
                  <div className="d-flex mb-2" style={{ height: '40px' }}>
                    <div 
                      className="flex-fill"
                      style={{ backgroundColor: palette.cardBackgroundColor }}
                    ></div>
                    <div 
                      className="flex-fill"
                      style={{ backgroundColor: palette.buttonSecondaryColor }}
                    ></div>
                  </div>
                  <h6 className="mb-1">{palette.name}</h6>
                  <Button 
                    variant="outline-info" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      applyPalette(palette);
                    }}
                  >
                    Aplicar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Advanced Color Customization */}
      <div className="mb-4">
        <h5 className="mb-3">🎨 Personalización Avanzada</h5>
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Color de Fondo de Tarjeta</Form.Label>
              <Form.Control
                type="color"
                value={cardData.cardBackgroundColor || '#2c2c2c'}
                onChange={(e) => updateCardData('cardBackgroundColor', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Color del Texto</Form.Label>
              <Form.Control
                type="color"
                value={cardData.cardTextColor || '#ffffff'}
                onChange={(e) => updateCardData('cardTextColor', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Color de Botones</Form.Label>
              <Form.Control
                type="color"
                value={cardData.buttonSecondaryColor || '#00F6FF'}
                onChange={(e) => updateCardData('buttonSecondaryColor', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Color Hover de Botones</Form.Label>
              <Form.Control
                type="color"
                value={cardData.buttonSecondaryHoverColor || '#00D1DB'}
                onChange={(e) => updateCardData('buttonSecondaryHoverColor', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </div>

      {/* Visual Effects */}
      <div className="mb-4">
        <h5 className="mb-3">✨ Efectos Visuales (Premium)</h5>
        
        <Row>
          <Col md={6}>
            <Form.Check
              type="switch"
              id="hover-effect"
              label="Efecto Hover"
              checked={cardData.enableHoverEffect || false}
              onChange={(e) => updateCardData('enableHoverEffect', e.target.checked)}
              className="mb-3"
            />
            <Form.Check
              type="switch"
              id="glassmorphism"
              label="Glassmorphism"
              checked={cardData.enableGlassmorphism || false}
              onChange={(e) => updateCardData('enableGlassmorphism', e.target.checked)}
              className="mb-3"
            />
          </Col>
          <Col md={6}>
            <Form.Check
              type="switch"
              id="animations"
              label="Animaciones Sutiles"
              checked={cardData.enableSubtleAnimations || false}
              onChange={(e) => updateCardData('enableSubtleAnimations', e.target.checked)}
              className="mb-3"
            />
            <Form.Check
              type="switch"
              id="patterns"
              label="Patrones de Fondo"
              checked={cardData.enableBackgroundPatterns || false}
              onChange={(e) => updateCardData('enableBackgroundPatterns', e.target.checked)}
              className="mb-3"
            />
          </Col>
        </Row>
      </div>

      <div className="bg-success bg-opacity-10 p-3 rounded">
        <small className="text-success">
          <strong>🎨 Pro Tip:</strong> Las paletas con IA están optimizadas para máximo impacto visual. 
          Los efectos premium están disponibles en planes pagos.
        </small>
      </div>
    </div>
  );
}