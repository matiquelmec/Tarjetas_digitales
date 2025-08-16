'use client';

import React, { useState } from 'react';
import { Row, Col, Form, Badge } from 'react-bootstrap';

// Simplified theme type for now
interface SimpleTheme {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'professional' | 'creative' | 'executive' | 'tech';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

interface ThemeSelectorProps {
  onThemeChange?: (theme: SimpleTheme) => void;
  className?: string;
}

// Sample themes
const SAMPLE_THEMES: SimpleTheme[] = [
  {
    id: 'professional-blue',
    name: 'Professional Blue',
    description: 'Clean and professional',
    emoji: '💼',
    category: 'professional',
    colors: {
      primary: '#0066CC',
      secondary: '#4A90E2',
      accent: '#FF6B35',
      background: '#FFFFFF',
      text: '#2C3E50'
    },
    fonts: {
      heading: 'Roboto, sans-serif',
      body: 'Open Sans, sans-serif'
    },
  },
  {
    id: 'creative-gradient',
    name: 'Creative Gradient',
    description: 'Bold and creative',
    emoji: '🎨',
    category: 'creative',
    colors: {
      primary: '#667EEA',
      secondary: '#764BA2',
      accent: '#F093FB',
      background: '#4B79A1',
      text: '#FFFFFF'
    },
    fonts: {
      heading: 'Montserrat, sans-serif',
      body: 'Source Sans Pro, sans-serif'
    },
  },
  {
    id: 'tech-dark',
    name: 'Tech Dark',
    description: 'Modern tech style',
    emoji: '⚡',
    category: 'tech',
    colors: {
      primary: '#00D4FF',
      secondary: '#5A67D8',
      accent: '#10B981',
      background: '#1A202C',
      text: '#F7FAFC'
    },
    fonts: {
      heading: 'JetBrains Mono, monospace',
      body: 'Inter, sans-serif'
    },
  }
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onThemeChange, className = '' }) => {
  const [selectedTheme, setSelectedTheme] = useState<SimpleTheme | null>(SAMPLE_THEMES[0]);
  const [activeCategory, setActiveCategory] = useState<string>('professional');

  const handleThemeSelect = (theme: SimpleTheme) => {
    setSelectedTheme(theme);
    if (onThemeChange) {
      onThemeChange(theme);
    }
  };

  const canAccessTheme = (theme: SimpleTheme): boolean => {
    // Simplified: assume user can access free themes
    return true; // Todos los temas disponibles
  };

  const getThemesByCategory = (category: string): SimpleTheme[] => {
    return SAMPLE_THEMES.filter(theme => theme.category === category);
  };

  const renderThemeCard = (theme: SimpleTheme) => {
    const isSelected = selectedTheme?.id === theme.id;
    const hasAccess = canAccessTheme(theme);

    return (
      <Col key={theme.id} xs={6} md={4} lg={3} className="mb-3">
        <div
          className={`theme-card ${isSelected ? 'selected' : ''} ${!hasAccess ? 'locked' : ''}`}
          onClick={() => handleThemeSelect(theme)}
          style={{
            background: theme.colors.background,
            borderRadius: '12px',
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
            justifyContent: 'space-between',
            boxShadow: isSelected 
              ? `0 8px 25px ${theme.colors.accent}20`
              : '0 4px 12px rgba(0, 0, 0, 0.1)'
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
              color: theme.colors.text,
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.25rem',
              opacity: !hasAccess ? 0.5 : 1
            }}>
              {theme.name}
            </div>
            <div style={{ 
              color: theme.colors.text,
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
              width: '16px', 
              height: '16px', 
              borderRadius: '50%', 
              backgroundColor: theme.colors.primary,
              opacity: !hasAccess ? 0.5 : 1
            }} />
            <div style={{ 
              width: '16px', 
              height: '16px', 
              borderRadius: '50%', 
              backgroundColor: theme.colors.secondary,
              opacity: !hasAccess ? 0.5 : 1
            }} />
            <div style={{ 
              width: '16px', 
              height: '16px', 
              borderRadius: '50%', 
              backgroundColor: theme.colors.accent,
              opacity: !hasAccess ? 0.5 : 1
            }} />
          </div>

          {/* Premium Badge */}
          {false && (
            <Badge 
              bg="warning" 
              style={{ 
                position: 'absolute',
                top: '8px',
                right: '8px',
                fontSize: '0.6rem'
              }}
            >
              PRO
            </Badge>
          )}

          {/* Lock Overlay */}
          {!hasAccess && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px'
            }}>
              <div style={{ 
                color: '#FFFFFF',
                fontSize: '2rem'
              }}>
                🔒
              </div>
            </div>
          )}
        </div>
      </Col>
    );
  };

  const categories = [
    { key: 'professional', name: 'Professional', icon: '💼' },
    { key: 'creative', name: 'Creative', icon: '🎨' },
    { key: 'tech', name: 'Tech', icon: '⚡' },
    { key: 'executive', name: 'Executive', icon: '👔' }
  ];

  return (
    <div className={`theme-selector ${className}`}>
      <div className="theme-selector-header mb-4">
        <h5 className="mb-3">Choose a Theme</h5>
        
        {/* Category Tabs */}
        <div className="d-flex gap-2 mb-3">
          {categories.map(category => (
            <button
              key={category.key}
              className={`btn btn-sm ${activeCategory === category.key ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveCategory(category.key)}
              style={{ fontSize: '0.8rem' }}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Themes Grid */}
      <Row className="themes-grid">
        {getThemesByCategory(activeCategory).map(renderThemeCard)}
      </Row>

      {/* Current Selection Info */}
      {selectedTheme && (
        <div className="current-selection mt-4 p-3 bg-light rounded">
          <div className="d-flex align-items-center gap-3">
            <div style={{ fontSize: '1.5rem' }}>
              {selectedTheme.emoji}
            </div>
            <div>
              <div className="fw-bold">
                {selectedTheme.name}
                {false && (
                  <Badge bg="warning" className="ms-2" style={{ fontSize: '0.6rem' }}>
                    PRO
                  </Badge>
                )}
              </div>
              <div className="text-muted small">
                {selectedTheme.description}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .theme-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
        }
        
        .theme-card.selected {
          transform: translateY(-2px);
        }
        
        .theme-card.locked {
          filter: grayscale(50%);
        }
        
        .theme-card.locked:hover {
          transform: none;
        }
      `}</style>
    </div>
  );
};

export default ThemeSelector;