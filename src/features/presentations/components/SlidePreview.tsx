'use client';

import React from 'react';

// Simplified types for now
interface Slide {
  id: string;
  type: 'title' | 'content' | 'image' | 'chart' | 'comparison' | 'closing';
  content: {
    title?: string;
    subtitle?: string;
    text?: string;
    bulletPoints?: string[];
    image?: string;
  };
}

interface SimpleTheme {
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

interface SlidePreviewProps {
  slide: Slide;
  theme: SimpleTheme;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

const SlidePreview: React.FC<SlidePreviewProps> = ({ 
  slide, 
  theme, 
  isActive = false, 
  className = '',
  onClick 
}) => {
  const renderSlideContent = () => {
    const { content } = slide;
    
    switch (slide.type) {
      case 'title':
        return (
          <div className="slide-content title-slide">
            {content.title && (
              <h1 className="slide-title" style={{ 
                color: theme.colors.text,
                fontFamily: theme.fonts.heading,
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {content.title}
              </h1>
            )}
            {content.subtitle && (
              <h2 className="slide-subtitle" style={{ 
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
                fontSize: '1.25rem',
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
            {content.bulletPoints && (
              <ul className="slide-bullets" style={{ 
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
                fontSize: '1rem',
                paddingLeft: '1.5rem'
              }}>
                {content.bulletPoints.map((point, index) => (
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

      default:
        return (
          <div className="slide-content default-slide">
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100px',
              color: theme.colors.text,
              fontFamily: theme.fonts.body,
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
    minHeight: '300px',
    backgroundColor: theme.colors.background,
    border: `2px solid ${isActive ? theme.colors.accent : theme.colors.secondary}`,
    borderRadius: '8px',
    padding: '20px',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    boxShadow: isActive 
      ? `0 4px 12px ${theme.colors.accent}20` 
      : `0 2px 8px ${theme.colors.secondary}20`,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  return (
    <div 
      className={`slide-preview ${className} ${isActive ? 'active' : ''}`}
      style={slideStyle}
      onClick={onClick}
    >
      {renderSlideContent()}
      
      {/* Slide number indicator */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        right: '12px',
        fontSize: '0.75rem',
        color: theme.colors.text,
        opacity: 0.6
      }}>
        {slide.type}
      </div>
    </div>
  );
};

export default SlidePreview;