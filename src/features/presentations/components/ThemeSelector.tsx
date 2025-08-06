'use client';

import React, { useState } from 'react';
import { Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { usePresentationThemes } from '../hooks/usePresentationThemes';
import type { PresentationTheme } from '../types/themes';

interface ThemeSelectorProps {
  onThemeChange?: (theme: PresentationTheme) => void;
  className?: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onThemeChange, className = '' }) => {
  const {
    selectedTheme,
    selectTheme,
    customizeColors,
    canAccessTheme,
    professionalThemes,
    creativeThemes,
    executiveThemes,
    techThemes,
    finalTheme
  } = usePresentationThemes();

  const [activeCategory, setActiveCategory] = useState<string>('professional');

  const handleThemeSelect = (theme: PresentationTheme) => {
    if (!canAccessTheme(theme)) {
      // Show upgrade message
      return;
    }

    const success = selectTheme(theme.id);
    if (success && onThemeChange) {
      onThemeChange(theme);
    }
  };

  const renderThemeCard = (theme: PresentationTheme) => {
    const isSelected = selectedTheme?.id === theme.id;
    const hasAccess = canAccessTheme(theme);

    return (
      <Col key={theme.id} xs={6} md={4} lg={3} className="mb-3">
        <div
          className={`theme-card ${isSelected ? 'selected' : ''} ${!hasAccess ? 'locked' : ''}`}
          onClick={() => handleThemeSelect(theme)}
          style={{
            background: theme.colors.background,
            borderRadius: theme.slide.borderRadius,
            padding: '1.5rem',
            cursor: hasAccess ? 'pointer' : 'not-allowed',
            border: isSelected 
              ? `3px solid ${theme.colors.accent}` 
              : '2px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            minHeight: '140px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {/* Theme Preview */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2rem', 
              marginBottom: '0.5rem',
              filter: !hasAccess ? 'grayscale(100%)' : 'none'
            }}>
              {theme.emoji}
            </div>
            <div style={{ 
              color: theme.colors.text.primary,
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.25rem',
              opacity: !hasAccess ? 0.5 : 1
            }}>
              {theme.name}
            </div>
            <div style={{ 
              color: theme.colors.text.secondary,
              fontSize: '0.75rem',
              lineHeight: '1.2',
              opacity: !hasAccess ? 0.5 : 0.8
            }}>
              {theme.description}
            </div>
          </div>

          {/* Color Preview */}
          <div style={{ 
            display: 'flex', 
            gap: '4px', 
            justifyContent: 'center',
            marginTop: '0.75rem'
          }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: theme.colors.primary,
              opacity: !hasAccess ? 0.5 : 1
            }} />
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: theme.colors.secondary,
              opacity: !hasAccess ? 0.5 : 1
            }} />
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: theme.colors.accent,
              opacity: !hasAccess ? 0.5 : 1
            }} />
          </div>

          {/* Premium Badge */}
          {theme.isPremium && (
            <Badge 
              bg={hasAccess ? 'warning' : 'secondary'} 
              className="position-absolute"
              style={{ top: '8px', right: '8px', fontSize: '0.6rem' }}
            >
              {hasAccess ? 'PREMIUM' : '🔒'}
            </Badge>
          )}

          {/* Selected Indicator */}
          {isSelected && (
            <div 
              className="position-absolute"
              style={{
                top: '8px',
                left: '8px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: theme.colors.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.colors.text.onDark,
                fontSize: '0.75rem'
              }}
            >
              ✓
            </div>
          )}

          {/* Glassmorphism overlay */}
          {theme.effects.glassmorphism && hasAccess && (
            <div 
              className="position-absolute"
              style={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: theme.slide.borderRadius,
                pointerEvents: 'none'
              }}
            />
          )}
        </div>

        <style jsx>{`
          .theme-card:hover:not(.locked) {
            transform: translateY(-5px);
            box-shadow: ${theme.slide.shadow};
          }
          
          .theme-card.selected {
            transform: translateY(-3px);
            box-shadow: ${theme.slide.shadow};
          }

          .theme-card.locked {
            opacity: 0.6;
          }
        `}</style>
      </Col>
    );
  };

  const categoryThemes = {
    professional: professionalThemes,
    creative: creativeThemes,
    executive: executiveThemes,
    tech: techThemes
  };

  const categoryLabels = {
    professional: { emoji: '💼', name: 'Profesionales' },
    creative: { emoji: '🎨', name: 'Creativos' },
    executive: { emoji: '🏆', name: 'Ejecutivos' },
    tech: { emoji: '⚡', name: 'Tecnología' }
  };

  return (
    <div className={`theme-selector ${className}`}>
      <style jsx>{`
        .theme-selector {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .category-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .category-tab {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0.75rem 1.5rem;
          color: #e0e0e0;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .category-tab:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #00f6ff;
          border-color: rgba(0, 246, 255, 0.3);
        }

        .category-tab.active {
          background: linear-gradient(135deg, #00f6ff 0%, #0099cc 100%);
          color: white;
          border-color: #00f6ff;
        }

        .themes-grid {
          margin-top: 1.5rem;
        }

        .customization-panel {
          margin-top: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .color-picker {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .color-picker:hover {
          transform: scale(1.1);
        }
      `}</style>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1" style={{ color: '#00f6ff' }}>
            🎨 Temas para Presentaciones
          </h4>
          <p className="text-muted mb-0">
            Selecciona el tema perfecto para tu presentación hipnotizante
          </p>
        </div>
        {selectedTheme && (
          <Badge bg="info" className="px-3 py-2">
            Tema: {selectedTheme.name} {selectedTheme.emoji}
          </Badge>
        )}
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {Object.entries(categoryLabels).map(([key, label]) => (
          <div
            key={key}
            className={`category-tab ${activeCategory === key ? 'active' : ''}`}
            onClick={() => setActiveCategory(key)}
          >
            {label.emoji} {label.name}
            <Badge 
              bg="secondary" 
              className="ms-2"
              style={{ fontSize: '0.7rem' }}
            >
              {categoryThemes[key as keyof typeof categoryThemes]?.length || 0}
            </Badge>
          </div>
        ))}
      </div>

      {/* Themes Grid */}
      <div className="themes-grid">
        <Row>
          {categoryThemes[activeCategory as keyof typeof categoryThemes]?.map(renderThemeCard)}
        </Row>
      </div>

      {/* Quick Customization Panel */}
      {selectedTheme && (
        <div className="customization-panel">
          <h6 className="mb-3" style={{ color: '#e0e0e0' }}>
            🎛️ Personalización Rápida
          </h6>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: '#b0b0b0', fontSize: '0.875rem' }}>
                  Color Principal
                </Form.Label>
                <div className="d-flex gap-2">
                  <input
                    type="color"
                    className="color-picker"
                    value={finalTheme?.colors.primary || selectedTheme.colors.primary}
                    onChange={(e) => customizeColors({ primary: e.target.value })}
                  />
                  <input
                    type="color"
                    className="color-picker"
                    value={finalTheme?.colors.accent || selectedTheme.colors.accent}
                    onChange={(e) => customizeColors({ accent: e.target.value })}
                  />
                </div>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: '#b0b0b0', fontSize: '0.875rem' }}>
                  Efectos Visuales
                </Form.Label>
                <div className="d-flex gap-3 align-items-center">
                  <Form.Check
                    type="switch"
                    id="glassmorphism-switch"
                    label="Glassmorphism"
                    checked={finalTheme?.effects.glassmorphism || false}
                    onChange={(e) => customizeEffects({ glassmorphism: e.target.checked })}
                    style={{ color: '#b0b0b0', fontSize: '0.85rem' }}
                  />
                  <Form.Check
                    type="switch"
                    id="particles-switch"
                    label="Partículas"
                    checked={finalTheme?.effects.particles || false}
                    onChange={(e) => customizeEffects({ particles: e.target.checked })}
                    style={{ color: '#b0b0b0', fontSize: '0.85rem' }}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
        </div>
      )}

      {/* Selected Theme Info */}
      {selectedTheme && (
        <div className="mt-3 p-3" style={{ 
          background: 'rgba(0, 246, 255, 0.1)', 
          borderRadius: '10px',
          border: '1px solid rgba(0, 246, 255, 0.2)'
        }}>
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: '1.2rem' }}>{selectedTheme.emoji}</span>
            <div>
              <div style={{ color: '#00f6ff', fontWeight: '600', fontSize: '0.95rem' }}>
                {selectedTheme.name}
              </div>
              <div style={{ color: '#b0b0b0', fontSize: '0.8rem' }}>
                {selectedTheme.description}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;