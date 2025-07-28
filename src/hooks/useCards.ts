import { useState, useCallback } from 'react';

export interface CardFormData {
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
}

export function useCards() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveCard = useCallback(async (cardData: CardFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });

      if (!response.ok) {
        throw new Error('Failed to save card');
      }

      const savedCard = await response.json();
      return savedCard;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCard = useCallback(async (cardId: string, cardData: Partial<CardFormData>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });

      if (!response.ok) {
        throw new Error('Failed to update card');
      }

      const updatedCard = await response.json();
      return updatedCard;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    saveCard,
    updateCard,
    loading,
    error,
  };
}