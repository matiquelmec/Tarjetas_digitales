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
        <div className="text-white">Loading...</div>
      </Container>
    );
  }

  if (error || !card) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: '#121212' }}>
        <div className="text-white text-center">
          <h2>{error || 'Card not found'}</h2>
          <p>The card you're looking for doesn't exist or has been removed.</p>
        </div>
      </Container>
    );
  }

  const customization = card.customization || {};
  const pageBackgroundColor = customization.pageBackgroundColor || '#121212';

  return (
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
  );
}