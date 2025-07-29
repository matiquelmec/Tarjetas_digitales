'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Container } from 'react-bootstrap';
import BusinessCard from '../../../components/BusinessCard';

interface CardData {
  id: string;
  title: string;
  name: string;
  profession: string;
  about?: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  photoUrl?: string;
  customization: any;
  views: number;
  clicks: number;
}

export default function PublicCardPage() {
  const params = useParams();
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchCard(params.id as string);
    }
  }, [params.id]);

  const fetchCard = async (cardId: string) => {
    try {
      const response = await fetch(`/api/cards/${cardId}`);
      if (response.ok) {
        const data = await response.json();
        setCard(data);
      } else if (response.status === 404) {
        setError('Card not found');
      } else {
        setError('Error loading card');
      }
    } catch (error) {
      console.error('Error fetching card:', error);
      setError('Error loading card');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: '#121212' }}>
        <div className="text-white text-center">
          <div className="spinner-border text-light mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <h5>Cargando tarjeta digital...</h5>
        </div>
      </Container>
    );
  }

  if (error || !card) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: '#121212' }}>
        <div className="text-white text-center">
          <div style={{ fontSize: '4rem' }} className="mb-3">💼</div>
          <h2>{error || 'Tarjeta no encontrada'}</h2>
          <p className="text-white-50">La tarjeta que buscas no existe o ha sido eliminada.</p>
          <a href="/" className="btn btn-primary mt-3">
            Volver al inicio
          </a>
        </div>
      </Container>
    );
  }

  const customization = card.customization || {};
  const pageBackgroundColor = customization.pageBackgroundColor || '#121212';

  // Update page title and meta tags
  useEffect(() => {
    if (card) {
      document.title = `${card.name} - ${card.profession} | Tarjeta Digital`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `Conoce a ${card.name}, ${card.profession}. ${card.about || 'Tarjeta digital profesional.'}`
        );
      }
    }
  }, [card]);

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background: ${pageBackgroundColor};
        }
      `}</style>
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: pageBackgroundColor }}>
      <BusinessCard
        name={card.name}
        title={card.profession}
        about={card.about || ''}
        location=""
        whatsapp={card.phone || ''}
        email={card.email || ''}
        photoUrl={card.photoUrl || ''}
        cardBackgroundColor={customization.cardBackgroundColor || '#1F1F1F'}
        cardTextColor={customization.cardTextColor || '#EAEAEA'}
        enableHoverEffect={customization.enableHoverEffect || false}
        enableGlassmorphism={customization.enableGlassmorphism || false}
        enableSubtleAnimations={customization.enableSubtleAnimations || false}
        enableBackgroundPatterns={customization.enableBackgroundPatterns || false}
        whatsappShareUrl=""
        appointmentLink={card.website || ''}
        professionalDetails=""
        linkedin={card.linkedin || ''}
        instagram={card.instagram || ''}
        twitter={card.twitter || ''}
        facebook=""
        buttonSecondaryColor={customization.buttonSecondaryColor || '#00F6FF'}
        buttonNormalBackgroundColor={customization.buttonNormalBackgroundColor || '#1F1F1F'}
        buttonSecondaryHoverColor={customization.buttonSecondaryHoverColor || '#00D1DB'}
      />
      </Container>
    </>
  );
}