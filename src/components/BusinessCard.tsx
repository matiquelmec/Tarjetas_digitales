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
  .animated-gradient-background {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradientAnimation 15s ease infinite;
  }
  .btn-outline-secondary-custom {
    color: var(--button-secondary-color) !important;
    border-color: var(--button-secondary-color) !important;
    background-color: var(--button-normal-bg-color) !important;
  }
  .btn-outline-secondary-custom:hover {
    color: var(--button-hover-text-color) !important;
    background-color: var(--button-secondary-hover-color) !important;
    border-color: var(--button-secondary-hover-color) !important;
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
    maxWidth: '450px',
    borderRadius: '20px',
    backgroundColor: cardBackgroundColor,
    color: cardTextColor,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
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
    cardStyles.borderRadius = '10px';
  }

  if (enableSubtleAnimations) {
    cardStyles.animation = 'fadeIn 1s ease-out';
  }

  return (
    <>
      <style>{staticStyles}</style>
      <Card className={`text-center p-4 business-card-custom ${enableBackgroundPatterns ? 'animated-gradient-background' : ''}`} style={cardStyles}>
        <Card.Body>
          <Stack gap={4}>
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
                  border: `4px solid ${cardTextColor}33`
                }}
              />
              <Card.Title as="h1" className="mb-1" style={{ fontSize: '2em', fontWeight: 700 }}>
                {name}
              </Card.Title>
              <Card.Subtitle as="h2" style={{ fontSize: '1.2em', fontWeight: 400, opacity: 0.9 }}>
                {title}
              </Card.Subtitle>
            </div>

            <div className="about-section text-start pt-4" style={{ borderTop: `1px solid ${cardTextColor}33` }}>
              <h3 style={{ fontSize: '1.1em', fontWeight: 600, opacity: 0.8 }}>SOBRE MÍ</h3>
              <p className="mb-0" style={{ opacity: 0.9, textAlign: 'justify' }}>{about}</p>
            </div>

            <Stack gap={3} className="actions-section pt-4" style={{ borderTop: `1px solid ${cardTextColor}33` }}>
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
              <div className="extra-info text-start pt-4" style={{ borderTop: `1px solid ${cardTextColor}33`, fontSize: '0.9em', opacity: 0.8 }}>
                  <h3 style={{ fontSize: '1.1em', fontWeight: 600, opacity: 0.8 }}>DETALLES PROFESIONALES</h3>
                  <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{professionalDetails}</p>
              </div>
            )}

            {location && (
              <div className="location-section text-start pt-4" style={{ borderTop: `1px solid ${cardTextColor}33`, fontSize: '0.9em', opacity: 0.8 }}>
                <h3 style={{ fontSize: '1.1em', fontWeight: 600, opacity: 0.8 }}>UBICACIÓN</h3>
                <p className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>{location}</p>
                <Button href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`} target="_blank" rel="noopener noreferrer" className="btn-outline-secondary-custom">
                  Ver en Mapa
                </Button>
              </div>
            )}

            <div className="share-section text-center pt-4" style={{ borderTop: `1px solid ${cardTextColor}33` }}>
              <h3 style={{ fontSize: '1.1em', fontWeight: 600, opacity: 0.8 }}>COMPARTE ESTA TARJETA</h3>
              <div className="d-flex justify-content-center align-items-center my-3">
                <QrCodeDisplay value={qrCodeValue} size={160} level="H" />
              </div>
              <Button href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#25D366', borderColor: '#25D366', color: 'white', fontWeight: 'bold' }}>
                Compartir por WhatsApp
              </Button>
            </div>
          </Stack>
        </Card.Body>
      </Card>
    </>
  );
}