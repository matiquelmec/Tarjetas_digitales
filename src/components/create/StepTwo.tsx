'use client';

import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import { useUniversalContrast } from '@/hooks/useUniversalContrast';

interface StepTwoProps {
  cardData: any;
  updateCardData: (field: string, value: any) => void;
}

export function StepTwo({ cardData, updateCardData }: StepTwoProps) {
  const { applyAndUpdate } = useUniversalContrast();

  const applyPalette = (palette: any) => {
    // Aplicar paleta con reglas universales de contraste
    applyAndUpdate(palette, updateCardData);
  };

  return (
    <div>

      {/* Smart Theme System */}
      <div className="mb-4">
        <h5 className="mb-3">🎨 Temas Profesionales</h5>
        <p className="text-muted mb-3">Selecciona un tema que refleje tu personalidad profesional</p>
        
        <div className="mb-4">
          <div className="d-flex gap-3 flex-wrap">
            {[
              {
                name: 'Corporate Executive',
                emoji: '💼',
                description: 'Autoridad y confianza institucional',
                isFree: false,
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
                  cardTextColor: '#ffffff',
                  buttonSecondaryColor: '#7986cb', // Más claro para mejor contraste
                  buttonSecondaryHoverColor: '#5c6bc0',
                  buttonNormalBackgroundColor: 'rgba(121,134,203,0.2)' // Más opaco
                }
              },
              {
                name: 'Medical Trust',
                emoji: '🏥',
                description: 'Salud, tranquilidad y profesionalismo médico',
                isFree: false,
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%)',
                  cardTextColor: '#ffffff',
                  buttonSecondaryColor: '#a5d6a7', // Mejor contraste
                  buttonSecondaryHoverColor: '#81c784',
                  buttonNormalBackgroundColor: 'rgba(165,214,167,0.25)' // Más visible
                }
              },
              {
                name: 'Legal Authority',
                emoji: '⚖️',
                description: 'Justicia, seriedad y tradición',
                isFree: false,
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 50%, #8e24aa 100%)',
                  cardTextColor: '#ffffff',
                  buttonSecondaryColor: '#ce93d8', // Más claro para mejor legibilidad
                  buttonSecondaryHoverColor: '#ba68c8',
                  buttonNormalBackgroundColor: 'rgba(206,147,216,0.25)'
                }
              },
              {
                name: 'Financial Gold',
                emoji: '💰',
                description: 'Prosperidad, estabilidad y valor',
                isFree: false,
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #e65100 0%, #f57900 50%, #ff9800 100%)',
                  cardTextColor: '#ffffff',
                  buttonSecondaryColor: '#ffcc02', // Amarillo más brillante para mejor contraste
                  buttonSecondaryHoverColor: '#ffb300',
                  buttonNormalBackgroundColor: 'rgba(255,204,2,0.2)'
                }
              },
              {
                name: 'Tech Innovation',
                emoji: '⚡',
                description: 'Futuro, precisión e innovación',
                isFree: true,
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #0d1421 0%, #1a252f 50%, #263238 100%)',
                  cardTextColor: '#e8f5e8', // Verde muy suave para mejor legibilidad
                  buttonSecondaryColor: '#64ffda', // Cian brillante para mejor contraste
                  buttonSecondaryHoverColor: '#4fc3f7',
                  buttonNormalBackgroundColor: 'rgba(100,255,218,0.15)'
                }
              }
            ].map((theme, index) => (
              <div
                key={index}
                data-theme={theme.name}
                className="theme-card d-flex flex-column align-items-center text-center"
                style={{
                  width: '120px',
                  padding: '12px',
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
                  // Apply theme colors with universal contrast rules
                  applyAndUpdate(theme.colors, updateCardData);
                  
                  // Visual feedback
                  const element = document.querySelector(`[data-theme="${theme.name}"]`) as HTMLElement;
                  if (element) {
                    element.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                      element.style.transform = 'scale(1)';
                    }, 150);
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                }}
                title={theme.description || theme.name}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{theme.emoji}</div>
                <small style={{ fontSize: '11px', fontWeight: '600', lineHeight: '1.2' }}>
                  {theme.name} {theme.isFree ? <span className="badge bg-success ms-1" style={{ fontSize: '8px' }}>GRATIS</span> : <span className="badge bg-warning ms-1" style={{ fontSize: '8px' }}>PREMIUM</span>}
                </small>
                
                {/* 5-Color Preview Bar */}
                <div style={{ marginTop: '8px', display: 'flex', gap: '2px', justifyContent: 'center' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.colors.buttonSecondaryColor }}></div>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.colors.buttonSecondaryHoverColor }}></div>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.colors.buttonNormalBackgroundColor || 'rgba(255,255,255,0.3)' }}></div>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.colors.cardTextColor }}></div>
                  <div style={{ width: '8px', height: '6px', borderRadius: '3px', background: 'linear-gradient(90deg, transparent 0%, ' + (theme.colors.cardBackgroundColor.includes('gradient') ? theme.colors.buttonSecondaryColor : theme.colors.cardBackgroundColor) + ' 100%)' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="d-flex gap-3 flex-wrap">
            {[
              {
                name: 'Artist Canvas',
                emoji: '🎨',
                description: 'Creatividad, inspiración y expresión artística',
                isFree: false,
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #f8bbd9 0%, #e1bee7 100%)',
                  cardTextColor: '#2d1b4e', // Morado más oscuro para excelente contraste
                  buttonSecondaryColor: '#ad1457', // Rosa más oscuro para mejor legibilidad
                  buttonSecondaryHoverColor: '#880e4f',
                  buttonNormalBackgroundColor: 'rgba(45,27,78,0.15)'
                }
              },
              {
                name: 'Nature Harmony',
                emoji: '🌿',
                description: 'Naturaleza, equilibrio y sostenibilidad',
                isFree: true,
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                  cardTextColor: '#ffffff',
                  buttonSecondaryColor: '#c8e6c9', // Verde más claro para mejor contraste
                  buttonSecondaryHoverColor: '#a5d6a7',
                  buttonNormalBackgroundColor: 'rgba(200,230,201,0.2)'
                }
              },
              {
                name: 'Ocean Depth',
                emoji: '🌊',
                description: 'Profundidad, calma y fluidez oceánica',
                isFree: true,
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #0277bd 0%, #29b6f6 100%)',
                  cardTextColor: '#ffffff',
                  buttonSecondaryColor: '#b3e5fc', // Azul muy claro para óptimo contraste
                  buttonSecondaryHoverColor: '#81d4fa',
                  buttonNormalBackgroundColor: 'rgba(179,229,252,0.2)'
                }
              },
              {
                name: 'Sunset Warmth',
                emoji: '🌅',
                description: 'Calidez, energía y optimismo radiante',
                isFree: true,
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #f57c00 0%, #ffab40 100%)',
                  cardTextColor: '#ffffff',
                  buttonSecondaryColor: '#fff3e0', // Beige muy claro para máximo contraste
                  buttonSecondaryHoverColor: '#ffe0b2',
                  buttonNormalBackgroundColor: 'rgba(255,243,224,0.25)'
                }
              },
              {
                name: 'Midnight Elegance',
                emoji: '🌙',
                description: 'Sofisticación, misterio y elegancia nocturna',
                isFree: false,
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #263238 0%, #37474f 100%)',
                  cardTextColor: '#ffffff',
                  buttonSecondaryColor: '#e1bee7', // Lila claro para excelente contraste
                  buttonSecondaryHoverColor: '#ce93d8',
                  buttonNormalBackgroundColor: 'rgba(225,190,231,0.2)'
                }
              }
            ].map((theme, index) => (
              <div
                key={index}
                data-theme={theme.name}
                className="theme-card d-flex flex-column align-items-center text-center"
                style={{
                  width: '120px',
                  padding: '12px',
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
                  // Apply theme colors with universal contrast rules
                  applyAndUpdate(theme.colors, updateCardData);
                  
                  // Visual feedback
                  const element = document.querySelector(`[data-theme="${theme.name}"]`) as HTMLElement;
                  if (element) {
                    element.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                      element.style.transform = 'scale(1)';
                    }, 150);
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                }}
                title={theme.description || theme.name}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{theme.emoji}</div>
                <small style={{ fontSize: '11px', fontWeight: '600', lineHeight: '1.2' }}>
                  {theme.name} {theme.isFree ? <span className="badge bg-success ms-1" style={{ fontSize: '8px' }}>GRATIS</span> : <span className="badge bg-warning ms-1" style={{ fontSize: '8px' }}>PREMIUM</span>}
                </small>
                
                {/* 5-Color Preview Bar */}
                <div style={{ marginTop: '8px', display: 'flex', gap: '2px', justifyContent: 'center' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.colors.buttonSecondaryColor }}></div>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.colors.buttonSecondaryHoverColor }}></div>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.colors.buttonNormalBackgroundColor || 'rgba(255,255,255,0.3)' }}></div>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.colors.cardTextColor }}></div>
                  <div style={{ width: '8px', height: '6px', borderRadius: '3px', background: 'linear-gradient(90deg, transparent 0%, ' + (theme.colors.cardBackgroundColor.includes('gradient') ? theme.colors.buttonSecondaryColor : theme.colors.cardBackgroundColor) + ' 100%)' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Manual Customization */}
      <div className="mb-4">
        <h5 className="mb-3">⚙️ Personalización Manual <span className="badge bg-success ms-2">GRATIS</span></h5>
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
                  value={(() => {
                    const color = cardData.cardBackgroundColor || '#2c2c2c';
                    if (color.startsWith('#')) return color;
                    
                    // Convert rgba to hex
                    if (color.startsWith('rgba')) {
                      const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
                      if (rgbaMatch) {
                        const r = parseInt(rgbaMatch[1]).toString(16).padStart(2, '0');
                        const g = parseInt(rgbaMatch[2]).toString(16).padStart(2, '0');
                        const b = parseInt(rgbaMatch[3]).toString(16).padStart(2, '0');
                        return `#${r}${g}${b}`;
                      }
                    }
                    
                    // Extract from gradient
                    if (color.includes('gradient')) {
                      const match = color.match(/#[0-9a-fA-F]{6}/);
                      return match ? match[0] : '#2c2c2c';
                    }
                    
                    return '#2c2c2c';
                  })()}
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
                  value={(() => {
                    const color = cardData.cardTextColor || '#ffffff';
                    if (color.startsWith('#')) return color;
                    if (color.includes('gradient') || color.startsWith('rgba') || color.startsWith('rgb')) {
                      const match = color.match(/#[0-9a-fA-F]{6}/);
                      return match ? match[0] : '#ffffff';
                    }
                    return '#ffffff';
                  })()}
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
                  value={(() => {
                    const color = cardData.buttonSecondaryColor || '#00F6FF';
                    if (color.startsWith('#')) return color;
                    if (color.includes('gradient') || color.startsWith('rgba')) {
                      const match = color.match(/#[0-9a-fA-F]{6}/);
                      return match ? match[0] : '#00F6FF';
                    }
                    return '#00F6FF';
                  })()} 
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
                  value={(() => {
                    const color = cardData.buttonSecondaryHoverColor || '#00D1DB';
                    if (color.startsWith('#')) return color;
                    if (color.includes('gradient') || color.startsWith('rgba')) {
                      const match = color.match(/#[0-9a-fA-F]{6}/);
                      return match ? match[0] : '#00D1DB';
                    }
                    return '#00D1DB';
                  })()} 
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
                  value={(() => {
                    const color = cardData.buttonNormalBackgroundColor || '#1F1F1F';
                    if (color.startsWith('#')) return color;
                    
                    // Convert rgba to hex approximation
                    if (color.startsWith('rgba')) {
                      const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
                      if (rgbaMatch) {
                        const r = parseInt(rgbaMatch[1]).toString(16).padStart(2, '0');
                        const g = parseInt(rgbaMatch[2]).toString(16).padStart(2, '0');
                        const b = parseInt(rgbaMatch[3]).toString(16).padStart(2, '0');
                        return `#${r}${g}${b}`;
                      }
                    }
                    
                    // Extract hex from gradient
                    if (color.includes('gradient')) {
                      const match = color.match(/#[0-9a-fA-F]{6}/);
                      return match ? match[0] : '#1F1F1F';
                    }
                    
                    return '#1F1F1F';
                  })()} 
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
        <h5 className="mb-3">✨ Colección de Gradientes <span className="badge bg-warning">PREMIUM</span></h5>
        <p className="text-muted mb-3">Gradientes exclusivos optimizados para efectos Glassmorphism</p>
        
        {/* Executive Collection */}
        <div className="mb-4">
          <h6 className="mb-3 d-flex align-items-center gap-2">
            <span>🏆</span> Colección Ejecutiva <span className="badge bg-warning ms-2">PREMIUM</span>
          </h6>
          <div className="d-flex gap-3 flex-wrap">
            {[
              {
                name: 'Diamond',
                gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                emoji: '💎',
                description: 'Elegancia cristalina con destellos azul diamante'
              },
              {
                name: 'Platinum',
                gradient: 'linear-gradient(135deg, #4a4a4a 0%, #5a5a5a 50%, #2a2a2a 100%)',
                emoji: '🔱',
                description: 'Lujo metálico plateado con elegancia oscura'  
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
                description: 'Verde esmeralda',
                colors: {
                  cardBackgroundColor: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  cardTextColor: '#ffffff',
                  buttonSecondaryColor: '#ffffff',
                  buttonSecondaryHoverColor: '#f8f9fa',
                  buttonNormalBackgroundColor: 'rgba(255,255,255,0.25)'
                }
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
                onClick={() => {
                  if (bg.colors) {
                    // Aplicar tema completo con reglas universales de contraste
                    applyAndUpdate(bg.colors, updateCardData);
                  } else {
                    // Solo aplicar gradiente
                    updateCardData('cardBackgroundColor', bg.gradient);
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                }}
                title={bg.description || bg.name}
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
            <span>🌌</span> Colección Cósmica <span className="badge bg-warning ms-2">PREMIUM</span>
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
                gradient: 'linear-gradient(135deg, #0c4a6e 0%, #1e3a8a 30%, #312e81 60%, #1f2937 100%)',
                emoji: '🌈',
                description: 'Luces boreales sobre cielo nocturno ártico'
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
                title={bg.description || bg.name}
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
            <span>🌿</span> Colección Natural <span className="badge bg-warning ms-2">PREMIUM</span>
          </h6>
          <div className="d-flex gap-3 flex-wrap">
            {[
              {
                name: 'Sunset',
                gradient: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 30%, #ea580c 60%, #451a03 100%)',
                emoji: '🌅',
                description: 'Atardecer ardiente con crepúsculo'
              },
              {
                name: 'Ocean',
                gradient: 'linear-gradient(135deg, #667db6 0%, #0082c8 50%, #41b883 100%)',
                emoji: '🌊',
                description: 'Azul oceánico'
              },
              {
                name: 'Forest',
                gradient: 'linear-gradient(135deg, #1b4332 0%, #2d5016 50%, #081c15 100%)',
                emoji: '🌲',
                description: 'Bosque profundo y frondoso'
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
                title={bg.description || bg.name}
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

        <div className="bg-success bg-opacity-20 p-3 rounded mt-4" style={{ border: '1px solid rgba(25, 135, 84, 0.3)' }}>
          <small className="text-light" style={{ color: '#ffffff !important' }}>
            <strong style={{ color: '#00ff88' }}>✨ Pro Tip Exclusivo:</strong> Los gradientes premium están específicamente diseñados para maximizar el efecto Glassmorphism. 
            Combínalos con efectos visuales para crear tarjetas que <strong>hipnoticen</strong> a tus contactos.
          </small>
        </div>
      </div>

      {/* Font Selection */}
      <div className="mb-4">
        <h5 className="mb-3">✍️ Tipografía Profesional <small className="text-muted">(1 gratuita + 5 premium)</small></h5>
        <p className="text-muted mb-3">Elige la fuente que mejor represente tu personalidad profesional</p>
        
        <div className="mb-4">
          <div className="d-flex gap-3 flex-wrap">
            {[
              {
                name: 'Playfair Display',
                key: 'Playfair Display',
                personality: 'Executive Authority',
                isFree: false,
                emoji: '👔',
                description: 'Liderazgo y sofisticación',
                ideal: 'CEOs, Directores, Abogados',
                preview: 'Elegancia Clásica'
              },
              {
                name: 'Montserrat',
                key: 'Montserrat',  
                personality: 'Modern Professional',
                isFree: true,
                emoji: '🚀',
                description: 'Innovación y claridad',
                ideal: 'Tech, Marketing, Startups',
                preview: 'Modernidad Accesible'
              },
              {
                name: 'Merriweather',
                key: 'Merriweather',
                personality: 'Trusted Expert',
                isFree: false,
                emoji: '🎓',
                description: 'Confiabilidad y experiencia',
                ideal: 'Médicos, Académicos',
                preview: 'Conocimiento Profundo'
              },
              {
                name: 'Poppins',
                key: 'Poppins',
                personality: 'Creative Leader',
                isFree: false,
                emoji: '🎨',
                description: 'Creatividad y dinamismo',
                ideal: 'Creativos, Coaches',
                preview: 'Energía Positiva'
              },
              {
                name: 'Source Sans Pro',
                key: 'Source Sans Pro',
                personality: 'Technical Precision',
                isFree: false,
                emoji: '⚙️',
                description: 'Precisión y competencia',
                ideal: 'Ingenieros, Arquitectos',
                preview: 'Exactitud Profesional'
              },
              {
                name: 'Crimson Text',
                key: 'Crimson Text',
                personality: 'Distinguished Scholar',
                isFree: false,
                emoji: '📚',
                description: 'Distinción académica',
                ideal: 'Profesores, Investigadores',
                preview: 'Sabiduría Intelectual'
              }
            ].map((font, index) => (
              <div
                key={index}
                onClick={() => updateCardData('fontFamily', font.key)}
                style={{
                  cursor: 'pointer',
                  minWidth: '280px',
                  height: '120px',
                  borderRadius: '12px',
                  border: cardData.fontFamily === font.key 
                    ? '3px solid #00F6FF' 
                    : '2px solid rgba(255,255,255,0.2)',
                  background: cardData.fontFamily === font.key
                    ? 'linear-gradient(135deg, rgba(0,246,255,0.1) 0%, rgba(0,246,255,0.05) 100%)'
                    : 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  transform: cardData.fontFamily === font.key ? 'scale(1.02)' : 'scale(1)'
                }}
                className="d-flex flex-column"
              >
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '12px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
                    {font.emoji}
                  </div>
                  <div 
                    style={{ 
                      fontFamily: font.key,
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: 'white',
                      marginBottom: '2px',
                      lineHeight: '1.2'
                    }}
                  >
                    {font.preview}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#00F6FF',
                    fontWeight: '600',
                    marginBottom: '1px'
                  }}>
                    {font.personality} {font.isFree ? <span className="badge bg-success ms-1" style={{ fontSize: '7px' }}>GRATIS</span> : <span className="badge bg-warning ms-1" style={{ fontSize: '7px' }}>PREMIUM</span>}
                  </div>
                  <div style={{ 
                    fontSize: '9px', 
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: '1.2'
                  }}>
                    {font.description}
                  </div>
                </div>
                <div
                  style={{
                    padding: '6px 8px',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'rgba(255,255,255,0.8)',
                    textAlign: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <div style={{ fontSize: '8px', fontWeight: '500' }}>
                    Ideal: {font.ideal}
                  </div>
                </div>
                {cardData.fontFamily === font.key && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#00F6FF',
                      color: '#000',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-success bg-opacity-20 p-3 rounded mt-4" style={{ border: '1px solid rgba(25, 135, 84, 0.3)' }}>
          <small className="text-light" style={{ color: '#ffffff !important' }}>
            <strong style={{ color: '#00ff88' }}>💡 Psicología de las Fuentes:</strong> La tipografía transmite personalidad antes que las palabras. Una fuente bien elegida 
            puede <strong>aumentar la percepción de competencia</strong> hasta un 40% según estudios de neuromarketing.
          </small>
        </div>
      </div>

      {/* Visual Effects */}
      <div className="mb-4">
        <h5 className="mb-3">✨ Efectos Visuales <span className="badge bg-warning">PREMIUM</span></h5>
        
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
            <Form.Check
              type="switch"
              id="particles"
              label="🌟 Sistema de Partículas (NUEVO)"
              checked={cardData.enableParticles || false}
              onChange={(e) => updateCardData('enableParticles', e.target.checked)}
              className="mb-3"
            />
          </Col>
        </Row>

        {/* Controles avanzados de partículas */}
        {cardData.enableParticles && (
          <div className="mt-4 p-3 bg-info bg-opacity-10 rounded">
            <h6 className="mb-3 text-info">🌟 Configuración de Partículas</h6>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Partículas</Form.Label>
                  <Form.Select
                    value={cardData.particleType || 'floating'}
                    onChange={(e) => updateCardData('particleType', e.target.value)}
                  >
                    <option value="floating">🎈 Flotantes (Suave)</option>
                    <option value="constellation">⭐ Constelación (Tech)</option>
                    <option value="professional">💼 Profesional (Geométrico)</option>
                    <option value="creative">🎨 Creativo (Orgánico)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Densidad de Partículas</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted">Pocas</span>
                    <Form.Range
                      min={1}
                      max={5}
                      step={1}
                      value={cardData.particleDensity || 3}
                      onChange={(e) => updateCardData('particleDensity', parseInt(e.target.value))}
                      className="flex-grow-1"
                    />
                    <span className="text-muted">Muchas</span>
                  </div>
                  <small className="text-muted">
                    Nivel {cardData.particleDensity || 3} - {
                      (cardData.particleDensity || 3) <= 2 ? 'Minimalista' :
                      (cardData.particleDensity || 3) <= 3 ? 'Equilibrado' : 'Dramático'
                    }
                  </small>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="bg-success bg-opacity-20 p-3 rounded" style={{ border: '1px solid rgba(25, 135, 84, 0.3)' }}>
              <small className="text-light" style={{ color: '#ffffff !important' }}>
                <strong style={{ color: '#00ff88' }}>💡 Tip:</strong> Las partículas se adaptan automáticamente a los colores de tu tema para máxima armonía visual.
              </small>
            </div>
          </div>
        )}
      </div>

      <div className="bg-success bg-opacity-20 p-3 rounded" style={{ border: '1px solid rgba(25, 135, 84, 0.3)' }}>
        <small className="text-light" style={{ color: '#ffffff !important' }}>
          <strong style={{ color: '#00ff88' }}>🎨 Pro Tip:</strong> Las paletas con IA están optimizadas para máximo impacto visual. 
          Los efectos premium están disponibles en planes pagos.
        </small>
      </div>
    </div>
  );
}