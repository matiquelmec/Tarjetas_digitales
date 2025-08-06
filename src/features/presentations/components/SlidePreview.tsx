'use client';

import React from 'react';
import type { Slide, PresentationTheme } from '../types';

interface SlidePreviewProps {
  slide: Slide;
  theme: PresentationTheme;
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
                color: typeof theme.colors === 'object' && 'text' in theme.colors ? (theme.colors as any).text.primary : '#ffffff',
                fontFamily: typeof theme.fonts === 'object' && 'heading' in theme.fonts ? (theme.fonts as any).heading.family : 'Arial',
                fontSize: '2rem',
                fontWeight: typeof theme.fonts === 'object' && 'heading' in theme.fonts ? (theme.fonts as any).heading.weight : 'normal',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {content.title}
              </h1>
            )}
            {content.subtitle && (
              <h2 className="slide-subtitle" style={{ 
                color: theme.colors.text.secondary,
                fontFamily: theme.fonts.body.family,
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
                color: theme.colors.text.primary,
                fontFamily: theme.fonts.heading.family,
                fontSize: '1.5rem',
                fontWeight: theme.fonts.heading.weight,
                marginBottom: '1rem'
              }}>
                {content.title}
              </h2>
            )}
            {content.body && (
              <div className="slide-body" style={{ 
                color: theme.colors.text.primary,
                fontFamily: theme.fonts.body.family,
                fontSize: '1rem',
                lineHeight: '1.6',
                marginBottom: '1rem'
              }}>
                {content.body}
              </div>
            )}
            {content.bullets && content.bullets.length > 0 && (
              <ul className="slide-bullets" style={{ 
                color: theme.colors.text.primary,
                fontFamily: theme.fonts.body.family,
                fontSize: '0.95rem',
                paddingLeft: '1.5rem'
              }}>
                {content.bullets.slice(0, 3).map((bullet, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>
                    {bullet}
                  </li>
                ))}
                {content.bullets.length > 3 && (
                  <li style={{ opacity: 0.6, fontStyle: 'italic' }}>
                    +{content.bullets.length - 3} más...
                  </li>
                )}
              </ul>
            )}
          </div>
        );
        
      case 'image':
        return (
          <div className="slide-content image-slide">
            {content.title && (
              <h2 className="slide-title" style={{ 
                color: theme.colors.text.primary,
                fontFamily: theme.fonts.heading.family,
                fontSize: '1.25rem',
                marginBottom: '0.75rem'
              }}>
                {content.title}
              </h2>
            )}
            <div className="image-placeholder" style={{
              width: '100%',
              height: '60px',
              background: `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.text.onDark,
              fontSize: '0.8rem',
              opacity: 0.8
            }}>
              {content.imageUrl ? '🖼️ Imagen' : '📷 Imagen IA'}
            </div>
          </div>
        );
        
      case 'chart':
        return (
          <div className="slide-content chart-slide">
            {content.title && (
              <h2 className="slide-title" style={{ 
                color: theme.colors.text.primary,
                fontFamily: theme.fonts.heading.family,
                fontSize: '1.25rem',
                marginBottom: '0.75rem'
              }}>
                {content.title}
              </h2>
            )}
            <div className="chart-placeholder" style={{
              width: '100%',
              height: '60px',
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.accent}`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.text.secondary,
              fontSize: '0.8rem'
            }}>
              📊 Gráfico
            </div>
          </div>
        );
        
      case 'quote':
        return (
          <div className="slide-content quote-slide">
            {content.quote && (
              <>
                <blockquote style={{
                  color: theme.colors.text.primary,
                  fontFamily: theme.fonts.heading.family,
                  fontSize: '1.1rem',
                  fontStyle: 'italic',
                  marginBottom: '0.75rem',
                  borderLeft: `3px solid ${theme.colors.accent}`,
                  paddingLeft: '1rem',
                  margin: '0 0 0.75rem 0'
                }}>
                  &ldquo;{content.quote.text}&rdquo;
                </blockquote>
                <cite style={{
                  color: theme.colors.text.secondary,
                  fontFamily: theme.fonts.body.family,
                  fontSize: '0.85rem',
                  display: 'block',
                  textAlign: 'right'
                }}>
                  — {content.quote.author}
                </cite>
              </>
            )}
          </div>
        );
        
      default:
        return (
          <div className="slide-content default-slide">
            <div style={{ 
              color: theme.colors.text.secondary,
              fontSize: '0.9rem',
              textAlign: 'center',
              opacity: 0.6
            }}>
              {slide.type} slide
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <style jsx>{`
        .slide-preview {
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: ${theme.slide.borderRadius};
          background: ${theme.colors.background};
          padding: ${theme.slide.padding};
          cursor: ${onClick ? 'pointer' : 'default'};
          transition: ${theme.effects.animations.transition};
          border: 2px solid ${isActive ? theme.colors.accent : 'rgba(255, 255, 255, 0.1)'};
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .slide-preview:hover {
          transform: ${onClick ? 'translateY(-5px)' : 'none'};
          box-shadow: ${theme.slide.shadow};
        }

        .slide-preview.active {
          border-color: ${theme.colors.accent};
          box-shadow: 0 0 20px ${theme.colors.accent}40;
        }

        .slide-content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          z-index: 2;
        }

        .title-slide {
          text-align: center;
        }

        .slide-title {
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }

        .slide-subtitle {
          margin: 0;
          line-height: 1.3;
        }

        .slide-body {
          margin-bottom: 1rem;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .slide-bullets {
          margin: 0;
          padding-left: 1.2rem;
        }

        .slide-bullets li {
          margin-bottom: 0.25rem;
        }

        /* Glassmorphism effect */
        ${theme.effects.glassmorphism ? `
          .slide-preview::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border-radius: ${theme.slide.borderRadius};
            z-index: 1;
          }
        ` : ''}

        /* Particles effect placeholder */
        ${theme.effects.particles ? `
          .slide-preview::after {
            content: '✨';
            position: absolute;
            top: 10px;
            right: 10px;
            opacity: 0.5;
            z-index: 3;
            animation: sparkle 2s ease-in-out infinite alternate;
          }

          @keyframes sparkle {
            0% { opacity: 0.3; transform: scale(1); }
            100% { opacity: 0.7; transform: scale(1.1); }
          }
        ` : ''}

        /* Slide number indicator */
        .slide-number {
          position: absolute;
          top: 8px;
          left: 8px;
          background: ${theme.colors.accent};
          color: ${theme.colors.text.onDark};
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          z-index: 4;
        }

        /* Active state animation */
        ${isActive ? `
          .slide-preview {
            animation: pulse 2s ease-in-out infinite alternate;
          }

          @keyframes pulse {
            0% { box-shadow: 0 0 20px ${theme.colors.accent}40; }
            100% { box-shadow: 0 0 30px ${theme.colors.accent}60; }
          }
        ` : ''}
      `}</style>

      <div
        className={`slide-preview ${isActive ? 'active' : ''} ${className}`}
        onClick={onClick}
        style={{
          background: theme.colors.background,
          borderRadius: theme.slide.borderRadius
        }}
      >
        {/* Slide Number */}
        <div className="slide-number">
          {slide.order + 1}
        </div>

        {/* Slide Content */}
        {renderSlideContent()}
      </div>
    </>
  );
};

export default SlidePreview;