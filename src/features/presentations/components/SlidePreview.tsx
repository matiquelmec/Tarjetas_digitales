'use client';

import React from 'react';

// Updated types compatible with AI service
interface Slide {
  id: string;
  type: 'title' | 'content' | 'image' | 'chart' | 'bullets' | 'quote';
  content: {
    title?: string;
    subtitle?: string;
    text?: string;
    bullets?: string[];
    imageUrl?: string;
    imageCaption?: string;
    quote?: string;
    author?: string;
    chartType?: 'bar' | 'pie' | 'line';
    chartData?: any;
  };
  notes?: string;
  transition?: 'fade' | 'slide' | 'zoom';
}

interface Theme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  fontSize?: {
    title: string;
    subtitle: string;
    body: string;
  };
}

interface SlidePreviewProps {
  slide: Slide;
  theme: Theme | string; // Can be theme object or theme name
  isActive?: boolean;
  isPreview?: boolean;
  className?: string;
  onClick?: () => void;
}

const SlidePreview: React.FC<SlidePreviewProps> = ({ 
  slide, 
  theme, 
  isActive = false,
  isPreview = false,
  className = '',
  onClick 
}) => {
  // Convert theme to standardized format
  const getThemeConfig = (themeInput: Theme | string): Theme => {
    if (typeof themeInput === 'string') {
      // Default themes
      const defaultThemes: Record<string, Theme> = {
        stellar: {
          name: 'stellar',
          primaryColor: '#00f6ff',
          secondaryColor: '#0072ff', 
          backgroundColor: '#0f0c29',
          fontFamily: 'Inter',
          fontSize: {
            title: '48px',
            subtitle: '24px',
            body: '18px'
          }
        },
        professional: {
          name: 'professional',
          primaryColor: '#2563eb',
          secondaryColor: '#1d4ed8',
          backgroundColor: '#ffffff',
          fontFamily: 'Inter',
          fontSize: {
            title: '42px',
            subtitle: '22px',
            body: '16px'
          }
        },
        dark: {
          name: 'dark',
          primaryColor: '#f59e0b',
          secondaryColor: '#d97706',
          backgroundColor: '#1f2937',
          fontFamily: 'Inter',
          fontSize: {
            title: '44px',
            subtitle: '22px',
            body: '16px'
          }
        }
      };
      return defaultThemes[themeInput] || defaultThemes.stellar;
    }
    return themeInput;
  };

  const themeConfig = getThemeConfig(theme);
  const textColor = themeConfig.backgroundColor === '#ffffff' || 
                   themeConfig.backgroundColor === 'white' ? '#1f2937' : '#ffffff';
  const renderSlideContent = () => {
    const { content } = slide;
    
    switch (slide.type) {
      case 'title':
        return (
          <div className="slide-content title-slide">
            {content.title && (
              <h1 className="slide-title" style={{ 
                color: textColor,
                fontFamily: themeConfig.fontFamily,
                fontSize: isPreview ? '2rem' : themeConfig.fontSize?.title || '48px',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {content.title}
              </h1>
            )}
            {content.subtitle && (
              <h2 className="slide-subtitle" style={{ 
                color: textColor,
                fontFamily: themeConfig.fontFamily,
                fontSize: isPreview ? '1.25rem' : themeConfig.fontSize?.subtitle || '24px',
                textAlign: 'center',
                fontWeight: 300
              }}>
                {content.subtitle}
              </h2>
            )}
          </div>
        );

      case 'content':
        return (
          <div className="slide-content content-slide">
            {content.title && (
              <h2 className="slide-title" style={{ 
                color: theme.colors.text,
                fontFamily: theme.fonts.heading,
                fontSize: '1.75rem',
                marginBottom: '1rem'
              }}>
                {content.title}
              </h2>
            )}
            {content.text && (
              <p className="slide-text" style={{ 
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>
                {content.text}
              </p>
            )}
            {content.bullets && (
              <ul className="slide-bullets" style={{ 
                color: textColor,
                fontFamily: themeConfig.fontFamily,
                fontSize: isPreview ? '1rem' : themeConfig.fontSize?.body || '18px',
                paddingLeft: '1.5rem'
              }}>
                {content.bullets.map((point, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="slide-content image-slide">
            {content.title && (
              <h2 className="slide-title" style={{ 
                color: theme.colors.text,
                fontFamily: theme.fonts.heading,
                fontSize: '1.75rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {content.title}
              </h2>
            )}
            {content.image && (
              <div className="slide-image" style={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                backgroundColor: theme.colors.secondary,
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <img 
                  src={content.image} 
                  alt={content.title || 'Slide image'} 
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </div>
            )}
            {content.text && (
              <p className="slide-caption" style={{ 
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
                fontSize: '0.9rem',
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                {content.text}
              </p>
            )}
          </div>
        );

      case 'bullets':
        return (
          <div className="slide-content bullets-slide">
            {content.title && (
              <h2 className="slide-title" style={{ 
                color: textColor,
                fontFamily: themeConfig.fontFamily,
                fontSize: isPreview ? '1.75rem' : themeConfig.fontSize?.title || '42px',
                marginBottom: '1rem'
              }}>
                {content.title}
              </h2>
            )}
            {content.bullets && (
              <ul className="slide-bullets" style={{ 
                color: textColor,
                fontFamily: themeConfig.fontFamily,
                fontSize: isPreview ? '1rem' : themeConfig.fontSize?.body || '18px',
                paddingLeft: '1.5rem',
                listStyle: 'none'
              }}>
                {content.bullets.map((point, index) => (
                  <li key={index} style={{ 
                    marginBottom: '0.75rem',
                    position: 'relative',
                    paddingLeft: '1.5rem'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      color: themeConfig.primaryColor,
                      fontWeight: 'bold'
                    }}>
                      •
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case 'quote':
        return (
          <div className="slide-content quote-slide" style={{ textAlign: 'center' }}>
            {content.quote && (
              <blockquote style={{
                color: textColor,
                fontFamily: themeConfig.fontFamily,
                fontSize: isPreview ? '1.5rem' : themeConfig.fontSize?.title || '36px',
                fontStyle: 'italic',
                margin: '0 0 1rem 0',
                position: 'relative',
                padding: '0 2rem'
              }}>
                <span style={{
                  color: themeConfig.primaryColor,
                  fontSize: isPreview ? '3rem' : '4rem',
                  position: 'absolute',
                  left: 0,
                  top: '-10px',
                  lineHeight: 1
                }}>
                  "
                </span>
                {content.quote}
                <span style={{
                  color: themeConfig.primaryColor,
                  fontSize: isPreview ? '3rem' : '4rem',
                  position: 'absolute',
                  right: 0,
                  bottom: '-20px',
                  lineHeight: 1
                }}>
                  "
                </span>
              </blockquote>
            )}
            {content.author && (
              <cite style={{
                color: textColor,
                fontFamily: themeConfig.fontFamily,
                fontSize: isPreview ? '1rem' : themeConfig.fontSize?.body || '18px',
                fontStyle: 'normal',
                opacity: 0.8
              }}>
                — {content.author}
              </cite>
            )}
          </div>
        );

      case 'chart':
        return (
          <div className="slide-content chart-slide">
            {content.title && (
              <h2 className="slide-title" style={{ 
                color: textColor,
                fontFamily: themeConfig.fontFamily,
                fontSize: isPreview ? '1.75rem' : themeConfig.fontSize?.title || '42px',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {content.title}
              </h2>
            )}
            <div style={{
              height: '200px',
              backgroundColor: themeConfig.secondaryColor + '20',
              border: `2px dashed ${themeConfig.primaryColor}`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: textColor,
              fontFamily: themeConfig.fontFamily,
              fontSize: isPreview ? '1rem' : '18px'
            }}>
              📊 Gráfico {content.chartType || 'bar'}
            </div>
          </div>
        );

      default:
        return (
          <div className="slide-content default-slide">
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100px',
              color: textColor,
              fontFamily: themeConfig.fontFamily,
              fontSize: '0.9rem'
            }}>
              {slide.type} slide
            </div>
          </div>
        );
    }
  };

  const slideStyle: React.CSSProperties = {
    width: '100%',
    minHeight: isPreview ? '400px' : '300px',
    backgroundColor: themeConfig.backgroundColor,
    border: `2px solid ${isActive ? themeConfig.primaryColor : themeConfig.secondaryColor}`,
    borderRadius: '12px',
    padding: '20px',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    boxShadow: isActive 
      ? `0 8px 25px ${themeConfig.primaryColor}30` 
      : `0 4px 15px ${themeConfig.secondaryColor}20`,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    transform: isActive ? 'translateY(-2px)' : 'none'
  };

  return (
    <div 
      className={`slide-preview ${className} ${isActive ? 'active' : ''}`}
      style={slideStyle}
      onClick={onClick}
    >
      {renderSlideContent()}
      
      {/* Slide type indicator */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        right: '12px',
        fontSize: '0.75rem',
        color: textColor,
        opacity: 0.6,
        backgroundColor: themeConfig.primaryColor + '20',
        padding: '2px 6px',
        borderRadius: '4px',
        fontFamily: themeConfig.fontFamily
      }}>
        {slide.type}
      </div>
    </div>
  );
};

export default SlidePreview;