'use client';

import { Card, Stack, Button } from 'react-bootstrap';
import { useEffect, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';

const QrCodeDisplay = dynamic(() => import('./QrCodeDisplay'), { ssr: false });

interface BusinessCardProps {
  name: string;
  title: string;
  about: string;
  location: string;
  whatsapp: string;
  email: string;
  photoUrl: string;
  cardBackgroundColor: string;
  cardTextColor: string;
  enableHoverEffect: boolean;
  enableGlassmorphism: boolean;
  enableSubtleAnimations: boolean;
  enableBackgroundPatterns: boolean;
  whatsappShareUrl: string;
  appointmentLink: string;
  professionalDetails: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  facebook: string;
  buttonSecondaryColor: string;
  buttonNormalBackgroundColor: string;
  buttonSecondaryHoverColor: string;
}

const staticStyles = `
  @keyframes gradientAnimation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animated-gradient-background {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradientAnimation 15s ease infinite;
  }
  .btn-outline-secondary-custom {
    color: var(--button-secondary-color) !important;
    border-color: var(--button-secondary-color) !important;
    background-color: var(--button-normal-bg-color) !important;
    padding: 12px 20px;
    border-radius: 10px;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  .btn-outline-secondary-custom:hover {
    color: var(--button-hover-text-color) !important;
    background-color: var(--button-secondary-hover-color) !important;
    border-color: var(--button-secondary-hover-color) !important;
    transform: translateY(-2px);
  }
  
  /* Responsive Design */
  @media (max-width: 576px) {
    .business-card-custom {
      max-width: 100% !important;
      padding: 30px 20px !important;
      margin: 10px !important;
    }
    .business-card-custom h1 {
      font-size: 1.8em !important;
    }
    .business-card-custom h2 {
      font-size: 1.1em !important;
    }
    .business-card-custom p {
      font-size: 0.9em !important;
    }
    .business-card-custom img {
      width: 100px !important;
      height: 100px !important;
    }
  }
`;

export default function BusinessCard({ name, title, about, location, whatsapp, email, photoUrl, cardBackgroundColor, cardTextColor, enableHoverEffect, enableGlassmorphism, enableSubtleAnimations, enableBackgroundPatterns, whatsappShareUrl, appointmentLink, professionalDetails, linkedin, instagram, twitter, facebook, buttonSecondaryColor, buttonNormalBackgroundColor, buttonSecondaryHoverColor }: BusinessCardProps) {
  const [qrCodeValue, setQrCodeValue] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setQrCodeValue(window.location.href);
    }
  }, []);

  const getContrastTextColor = (hexcolor: string) => {
    if (!hexcolor || hexcolor.toLowerCase() === 'transparent') return '#000000';
    const r = parseInt(hexcolor.substring(1, 3), 16);
    const g = parseInt(hexcolor.substring(3, 5), 16);
    const b = parseInt(hexcolor.substring(5, 7), 16);
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  const cardStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '480px',
    borderRadius: '20px',
    backgroundColor: cardBackgroundColor,
    color: cardTextColor,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
    padding: '40px',
    margin: '0 auto',
    '--button-secondary-color': buttonSecondaryColor,
    '--button-normal-bg-color': buttonNormalBackgroundColor,
    '--button-secondary-hover-color': buttonSecondaryHoverColor,
    '--button-hover-text-color': getContrastTextColor(buttonSecondaryHoverColor),
  } as React.CSSProperties;

  if (enableHoverEffect) {
    cardStyles.transform = 'translateY(-5px)';
    cardStyles.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
  }

  if (enableGlassmorphism) {
    cardStyles.backgroundColor = 'rgba(255, 255, 255, 0.15)';
    cardStyles.backdropFilter = 'blur(10px)';
    cardStyles.border = '1px solid rgba(255, 255, 255, 0.2)';
    // Mantener borderRadius consistente en 20px
  }

  if (enableSubtleAnimations) {
    cardStyles.animation = 'fadeIn 1s ease-out';
  }

  return (
    <>
      <style>{staticStyles}</style>
      <Card className={`text-center business-card-custom ${enableBackgroundPatterns ? 'animated-gradient-background' : ''}`} style={cardStyles}>
        <Card.Body style={{ padding: 0 }}>
          <Stack gap={3}>
            <div className="header-section text-center">
              <img
                src={photoUrl}
                alt="Foto del Profesional"
                className="mb-3"
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  objectFit: 'cover', 
                  borderRadius: '50%', 
                  border: `4px solid ${cardTextColor}33`,
                  display: 'block',
                  margin: '0 auto 20px auto'
                }}
              />
              <Card.Title as="h1" className="mb-2" style={{ fontSize: '2.2em', fontWeight: 700, lineHeight: 1.2 }}>
                {name}
              </Card.Title>
              <Card.Subtitle as="h2" style={{ fontSize: '1.3em', fontWeight: 400, opacity: 0.9, marginBottom: '0' }}>
                {title}
              </Card.Subtitle>
            </div>

            {about && (
              <div className="about-section text-start" style={{ 
                borderTop: `1px solid ${cardTextColor}33`,
                paddingTop: '20px',
                marginTop: '20px'
              }}>
                <h3 style={{ fontSize: '1.1em', fontWeight: 600, opacity: 0.8, marginBottom: '15px' }}>SOBRE MÍ</h3>
                <p className="mb-0" style={{ 
                  opacity: 0.9, 
                  textAlign: 'justify', 
                  fontSize: '0.95em',
                  lineHeight: 1.5
                }}>{about}</p>
              </div>
            )}

            <Stack gap={2} className="actions-section" style={{ 
              borderTop: `1px solid ${cardTextColor}33`,
              paddingTop: '20px',
              marginTop: '20px'
            }}>
              {appointmentLink && (
                <Button href={appointmentLink} target="_blank" rel="noopener noreferrer" className="btn-outline-secondary-custom">
                  Agendar una Cita
                </Button>
              )}
              {whatsapp && (
                <Button href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-outline-secondary-custom">
                  Contactar por WhatsApp
                </Button>
              )}
              {email && (
                <Button href={`mailto:${email}`} className="btn-outline-secondary-custom">
                  Enviar Email
                </Button>
              )}
              {linkedin && (
                <Button href={linkedin} target="_blank" rel="noopener noreferrer" className="btn-outline-secondary-custom">
                  LinkedIn
                </Button>
              )}
              {instagram && (
                <Button href={instagram} target="_blank" rel="noopener noreferrer" className="btn-outline-secondary-custom">
                  Instagram
                </Button>
              )}
              {twitter && (
                <Button href={twitter} target="_blank" rel="noopener noreferrer" className="btn-outline-secondary-custom">
                  X (Twitter)
                </Button>
              )}
              {facebook && (
                <Button href={facebook} target="_blank" rel="noopener noreferrer" className="btn-outline-secondary-custom">
                  Facebook
                </Button>
              )}
            </Stack>

            {professionalDetails && (
              <div className="extra-info text-start" style={{ 
                borderTop: `1px solid ${cardTextColor}33`, 
                paddingTop: '20px',
                marginTop: '20px'
              }}>
                <h3 style={{ fontSize: '1.1em', fontWeight: 600, opacity: 0.8, marginBottom: '15px' }}>DETALLES PROFESIONALES</h3>
                <p className="mb-0" style={{ 
                  whiteSpace: 'pre-wrap', 
                  fontSize: '0.95em',
                  lineHeight: 1.5,
                  opacity: 0.9
                }}>{professionalDetails}</p>
              </div>
            )}

            {location && (
              <div className="location-section text-start" style={{ 
                borderTop: `1px solid ${cardTextColor}33`,
                paddingTop: '20px',
                marginTop: '20px'
              }}>
                <h3 style={{ fontSize: '1.1em', fontWeight: 600, opacity: 0.8, marginBottom: '15px' }}>UBICACIÓN</h3>
                <p className="mb-3" style={{ 
                  whiteSpace: 'pre-wrap', 
                  fontSize: '0.95em',
                  lineHeight: 1.5,
                  opacity: 0.9
                }}>{location}</p>
                <Button href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`} target="_blank" rel="noopener noreferrer" className="btn-outline-secondary-custom">
                  Ver en Mapa
                </Button>
              </div>
            )}

            <div className="share-section text-center" style={{ 
              borderTop: `1px solid ${cardTextColor}33`,
              paddingTop: '20px',
              marginTop: '20px'
            }}>
              <h3 style={{ fontSize: '1.1em', fontWeight: 600, opacity: 0.8, marginBottom: '20px' }}>COMPARTE ESTA TARJETA</h3>
              <div className="d-flex justify-content-center align-items-center mb-3">
                <QrCodeDisplay value={qrCodeValue} size={140} level="H" />
              </div>
              <Button 
                href={whatsappShareUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  backgroundColor: '#25D366', 
                  borderColor: '#25D366', 
                  color: 'white', 
                  fontWeight: 500,
                  padding: '12px 24px',
                  borderRadius: '10px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Compartir por WhatsApp
              </Button>
            </div>
          </Stack>
        </Card.Body>
      </Card>
    </>
  );
}