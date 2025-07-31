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

      {/* Smart Theme System */}
      <div className="mb-4">
        <h5 className="mb-3">🎨 Temas Inteligentes</h5>
        <p className="text-muted mb-3">Selecciona un tema cohesivo que ajuste todos los colores automáticamente</p>
        
        {/* Professional Themes */}
        <div className="mb-4">
          <h6 className="mb-3">💼 Temas Profesionales</h6>
          <div className="d-flex gap-3 flex-wrap">
            {[
              {
                name: 'Corporate Blue',
                emoji: '💼',
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                  cardTextColor: '#ffffff',
                  buttonSecondaryColor: '#4a90e2',
                  buttonSecondaryHoverColor: '#357abd',
                  buttonNormalBackgroundColor: '#1a2f5c'
                }
              },
              {
                name: 'Nature Green',
                emoji: '🌿',
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
                  cardTextColor: '#ffffff',
                  buttonSecondaryColor: '#27ae60',
                  buttonSecondaryHoverColor: '#229954',
                  buttonNormalBackgroundColor: '#0f3d4a'
                }
              },
              {
                name: 'Creative Orange',
                emoji: '🔥',
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
                  cardTextColor: '#ffffff',
                  buttonSecondaryColor: '#e67e22',
                  buttonSecondaryHoverColor: '#d35400',
                  buttonNormalBackgroundColor: '#b8570e'
                }
              },
              {
                name: 'Luxury Purple',
                emoji: '💜',
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  cardTextColor: '#ffffff',
                  buttonSecondaryColor: '#9b59b6',
                  buttonSecondaryHoverColor: '#8e44ad',
                  buttonNormalBackgroundColor: '#5a3e7a'
                }
              },
              {
                name: 'Tech Neon',
                emoji: '⚡',
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
                  cardTextColor: '#00ff88',
                  buttonSecondaryColor: '#00ff88',
                  buttonSecondaryHoverColor: '#00cc6a',
                  buttonNormalBackgroundColor: '#0a0a0a'
                }
              }
            ].map((theme, index) => (
              <div
                key={index}
                className="theme-card d-flex flex-column align-items-center text-center"
                style={{
                  width: '90px',
                  padding: '10px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  border: '2px solid transparent',
                  background: theme.colors.cardBackgroundColor,
                  color: theme.colors.cardTextColor,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
                onClick={() => {
                  Object.entries(theme.colors).forEach(([key, value]) => {
                    updateCardData(key, value);
                  });
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{theme.emoji}</div>
                <small style={{ fontSize: '10px', fontWeight: '600' }}>{theme.name}</small>
                <div
                  style={{
                    width: '20px',
                    height: '3px',
                    background: theme.colors.buttonSecondaryColor,
                    borderRadius: '2px',
                    marginTop: '5px'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Creative Themes */}
        <div className="mb-4">
          <h6 className="mb-3">🎨 Temas Creativos</h6>
          <div className="d-flex gap-3 flex-wrap">
            {[
              {
                name: 'Cherry Blossom',
                emoji: '🌸',
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                  cardTextColor: '#2c3e50',
                  buttonSecondaryColor: '#e74c3c',
                  buttonSecondaryHoverColor: '#c0392b',
                  buttonNormalBackgroundColor: '#f4d7d3'
                }
              },
              {
                name: 'Deep Ocean',
                emoji: '🌊',
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #667db6 0%, #0082c8, #0082c8, #667db6 100%)',
                  cardTextColor: '#ffffff',
                  buttonSecondaryColor: '#3498db',
                  buttonSecondaryHoverColor: '#2980b9',
                  buttonNormalBackgroundColor: '#4a6ba3'
                }
              },
              {
                name: 'Golden Hour',
                emoji: '🍯',
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  cardTextColor: '#ffffff',
                  buttonSecondaryColor: '#f39c12',
                  buttonSecondaryHoverColor: '#e67e22',
                  buttonNormalBackgroundColor: '#d4486b'
                }
              },
              {
                name: 'Midnight',
                emoji: '🎭',
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                  cardTextColor: '#ecf0f1',
                  buttonSecondaryColor: '#1abc9c',
                  buttonSecondaryHoverColor: '#16a085',
                  buttonNormalBackgroundColor: '#2a3d4f'
                }
              },
              {
                name: 'Rainbow',
                emoji: '🌈',
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                  cardTextColor: '#ffffff',
                  buttonSecondaryColor: '#9b59b6',
                  buttonSecondaryHoverColor: '#8e44ad',
                  buttonNormalBackgroundColor: '#6a4c93'
                }
              }
            ].map((theme, index) => (
              <div
                key={index}
                className="theme-card d-flex flex-column align-items-center text-center"
                style={{
                  width: '90px',
                  padding: '10px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  border: '2px solid transparent',
                  background: theme.colors.cardBackgroundColor,
                  color: theme.colors.cardTextColor,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
                onClick={() => {
                  Object.entries(theme.colors).forEach(([key, value]) => {
                    updateCardData(key, value);
                  });
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{theme.emoji}</div>
                <small style={{ fontSize: '10px', fontWeight: '600' }}>{theme.name}</small>
                <div
                  style={{
                    width: '20px',
                    height: '3px',
                    background: theme.colors.buttonSecondaryColor,
                    borderRadius: '2px',
                    marginTop: '5px'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Manual Customization */}
      <div className="mb-4">
        <h5 className="mb-3">⚙️ Personalización Manual</h5>
        <p className="text-muted mb-3">Ajusta cada color individualmente para máximo control</p>
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center gap-2">
                <span>🎨</span> Color de Fondo
              </Form.Label>
              <div className="d-flex gap-2 align-items-center">
                <Form.Control
                  type="color"
                  value={typeof cardData.cardBackgroundColor === 'string' && cardData.cardBackgroundColor.startsWith('#') 
                    ? cardData.cardBackgroundColor 
                    : '#2c2c2c'}
                  onChange={(e) => updateCardData('cardBackgroundColor', e.target.value)}
                  style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                />
                <div className="flex-grow-1">
                  <div
                    style={{
                      height: '40px',
                      background: cardData.cardBackgroundColor || '#2c2c2c',
                      borderRadius: '6px',
                      border: '1px solid #dee2e6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '500',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    Preview
                  </div>
                </div>
              </div>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center gap-2">
                <span>📝</span> Color del Texto
              </Form.Label>
              <div className="d-flex gap-2 align-items-center">
                <Form.Control
                  type="color"
                  value={cardData.cardTextColor || '#ffffff'}
                  onChange={(e) => updateCardData('cardTextColor', e.target.value)}
                  style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                />
                <div className="flex-grow-1">
                  <div
                    style={{
                      height: '40px',
                      background: '#f8f9fa',
                      borderRadius: '6px',
                      border: '1px solid #dee2e6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: cardData.cardTextColor || '#ffffff',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    Texto Ejemplo
                  </div>
                </div>
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center gap-2">
                <span>🔘</span> Color de Botones
              </Form.Label>
              <div className="d-flex gap-2 align-items-center">
                <Form.Control
                  type="color"
                  value={cardData.buttonSecondaryColor || '#00F6FF'}
                  onChange={(e) => updateCardData('buttonSecondaryColor', e.target.value)}
                  style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                />
                <div className="flex-grow-1">
                  <button
                    style={{
                      height: '40px',
                      width: '100%',
                      background: cardData.buttonSecondaryColor || '#00F6FF',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = cardData.buttonSecondaryHoverColor || '#00D1DB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = cardData.buttonSecondaryColor || '#00F6FF';
                    }}
                  >
                    Botón Preview
                  </button>
                </div>
              </div>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center gap-2">
                <span>✨</span> Color Hover
              </Form.Label>
              <div className="d-flex gap-2 align-items-center">
                <Form.Control
                  type="color"
                  value={cardData.buttonSecondaryHoverColor || '#00D1DB'}
                  onChange={(e) => updateCardData('buttonSecondaryHoverColor', e.target.value)}
                  style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                />
                <div className="flex-grow-1">
                  <div
                    style={{
                      height: '40px',
                      background: cardData.buttonSecondaryHoverColor || '#00D1DB',
                      borderRadius: '6px',
                      border: '1px solid #dee2e6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    Hover Estado
                  </div>
                </div>
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center gap-2">
                <span>⬜</span> Color de Fondo de Botones
              </Form.Label>
              <div className="d-flex gap-2 align-items-center">
                <Form.Control
                  type="color"
                  value={cardData.buttonNormalBackgroundColor || '#1F1F1F'}
                  onChange={(e) => updateCardData('buttonNormalBackgroundColor', e.target.value)}
                  style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                />
                <div className="flex-grow-1">
                  <button
                    style={{
                      height: '40px',
                      width: '100%',
                      background: cardData.buttonNormalBackgroundColor || '#1F1F1F',
                      border: 'none',
                      borderRadius: '6px',
                      color: cardData.cardTextColor || '#ffffff',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Botón Fondo
                  </button>
                </div>
              </div>
            </Form.Group>
          </Col>
        </Row>
      </div>

      {/* Premium Gradient Collection */}
      <div className="mb-4">
        <h5 className="mb-3">✨ Colección Premium de Gradientes</h5>
        <p className="text-muted mb-3">Gradientes exclusivos optimizados para efectos Glassmorphism</p>
        
        {/* Executive Collection */}
        <div className="mb-4">
          <h6 className="mb-3 d-flex align-items-center gap-2">
            <span>🏆</span> Colección Ejecutiva
          </h6>
          <div className="d-flex gap-3 flex-wrap">
            {[
              {
                name: 'Diamond',
                gradient: 'linear-gradient(135deg, #e8f5e8 0%, #b8e6b8 50%, #4a8f4a 100%)',
                emoji: '💎',
                description: 'Elegancia cristalina'
              },
              {
                name: 'Platinum',
                gradient: 'linear-gradient(135deg, #f7f7f7 0%, #d1d1d1 50%, #8c8c8c 100%)',
                emoji: '🔱',
                description: 'Lujo metálico'  
              },
              {
                name: 'Sapphire',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #1e3c72 100%)',
                emoji: '💙',
                description: 'Azul profundo'
              },
              {
                name: 'Emerald',
                gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                emoji: '💚',
                description: 'Verde esmeralda'
              },
              {
                name: 'Ruby',
                gradient: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
                emoji: '❤️',
                description: 'Rojo intenso'
              }
            ].map((bg, index) => (
              <div
                key={index}
                className="gradient-card"
                style={{
                  width: '110px',
                  padding: '0',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  border: cardData.cardBackgroundColor === bg.gradient ? '3px solid #007bff' : '2px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
                onClick={() => updateCardData('cardBackgroundColor', bg.gradient)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                }}
              >
                <div
                  style={{
                    height: '80px',
                    background: bg.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem'
                  }}
                >
                  {bg.emoji}
                </div>
                <div
                  style={{
                    padding: '10px 8px',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: '700', marginBottom: '2px' }}>
                    {bg.name}
                  </div>
                  <div style={{ fontSize: '9px', opacity: 0.8 }}>
                    {bg.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cosmic Collection */}
        <div className="mb-4">
          <h6 className="mb-3 d-flex align-items-center gap-2">
            <span>🌌</span> Colección Cósmica
          </h6>
          <div className="d-flex gap-3 flex-wrap">
            {[
              {
                name: 'Galaxy',
                gradient: 'linear-gradient(135deg, #2b1055 0%, #7597de 50%, #c9d6ff 100%)',
                emoji: '🌌',
                description: 'Espacio profundo'
              },
              {
                name: 'Nebula',
                gradient: 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)',
                emoji: '☄️',
                description: 'Neón espacial'
              },
              {
                name: 'Aurora',
                gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #d299c2 100%)',
                emoji: '🌈',
                description: 'Luces boreales'
              },
              {
                name: 'Stellar',
                gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                emoji: '⭐',
                description: 'Noche estelar'
              },
              {
                name: 'Cosmic',
                gradient: 'linear-gradient(135deg, #8360c3 0%, #2ebf91 50%, #ffecd2 100%)',
                emoji: '🪐',
                description: 'Universo vibrante'
              }
            ].map((bg, index) => (
              <div
                key={index}
                className="gradient-card"
                style={{
                  width: '110px',
                  padding: '0',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  border: cardData.cardBackgroundColor === bg.gradient ? '3px solid #007bff' : '2px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
                onClick={() => updateCardData('cardBackgroundColor', bg.gradient)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                }}
              >
                <div
                  style={{
                    height: '80px',
                    background: bg.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem'
                  }}
                >
                  {bg.emoji}
                </div>
                <div
                  style={{
                    padding: '10px 8px',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: '700', marginBottom: '2px' }}>
                    {bg.name}
                  </div>
                  <div style={{ fontSize: '9px', opacity: 0.8 }}>
                    {bg.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nature Collection */}
        <div className="mb-4">
          <h6 className="mb-3 d-flex align-items-center gap-2">
            <span>🌿</span> Colección Natural
          </h6>
          <div className="d-flex gap-3 flex-wrap">
            {[
              {
                name: 'Sunset',
                gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
                emoji: '🌅',
                description: 'Atardecer cálido'
              },
              {
                name: 'Ocean',
                gradient: 'linear-gradient(135deg, #667db6 0%, #0082c8 50%, #41b883 100%)',
                emoji: '🌊',
                description: 'Azul oceánico'
              },
              {
                name: 'Forest',
                gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 50%, #dcedc8 100%)',
                emoji: '🌲',
                description: 'Verde natural'
              },
              {
                name: 'Desert',
                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
                emoji: '🏜️',
                description: 'Arena dorada'
              },
              {
                name: 'Volcano',
                gradient: 'linear-gradient(135deg, #f12711 0%, #f5af19 50%, #ff6b6b 100%)',
                emoji: '🌋',
                description: 'Fuego ardiente'
              }
            ].map((bg, index) => (
              <div
                key={index}
                className="gradient-card"
                style={{
                  width: '110px',
                  padding: '0',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  border: cardData.cardBackgroundColor === bg.gradient ? '3px solid #007bff' : '2px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
                onClick={() => updateCardData('cardBackgroundColor', bg.gradient)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                }}
              >
                <div
                  style={{
                    height: '80px',
                    background: bg.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem'
                  }}
                >
                  {bg.emoji}
                </div>
                <div
                  style={{
                    padding: '10px 8px',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: '700', marginBottom: '2px' }}>
                    {bg.name}
                  </div>
                  <div style={{ fontSize: '9px', opacity: 0.8 }}>
                    {bg.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 bg-opacity-10 p-3 rounded-3 mt-4">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span style={{ fontSize: '1.2rem' }}>✨</span>
            <strong className="text-info">Pro Tip Exclusivo</strong>
          </div>
          <small className="text-info">
            Los gradientes premium están específicamente diseñados para maximizar el efecto Glassmorphism. 
            Combínalos con efectos visuales para crear tarjetas que <strong>hipnoticen</strong> a tus contactos.
          </small>
        </div>
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