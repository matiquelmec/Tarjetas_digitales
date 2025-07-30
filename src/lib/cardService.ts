import { prisma } from './db';
import { Card, User } from '@prisma/client';

export interface CardData {
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
  customUrl?: string;
  customization: any;
}

export class CardService {
  static async createCard(userId: string, cardData: CardData): Promise<Card> {
    // First, ensure the user exists in the database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return await prisma.card.create({
      data: {
        ...cardData,
        userId,
      },
    });
  }

  static async getUserCards(userId: string): Promise<Card[]> {
    return await prisma.card.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getCard(cardId: string): Promise<Card | null> {
    return await prisma.card.findUnique({
      where: { id: cardId },
      include: { user: true },
    });
  }

  static async updateCard(cardId: string, userId: string, cardData: Partial<CardData>): Promise<Card> {
    return await prisma.card.update({
      where: { 
        id: cardId,
        userId // Ensure user owns this card
      },
      data: cardData,
    });
  }

  static async deleteCard(cardId: string, userId: string): Promise<Card> {
    return await prisma.card.delete({
      where: { 
        id: cardId,
        userId // Ensure user owns this card
      },
    });
  }

  static async incrementViews(cardId: string): Promise<void> {
    await prisma.card.update({
      where: { id: cardId },
      data: {
        views: { increment: 1 },
      },
    });
  }

  static async incrementClicks(cardId: string): Promise<void> {
    await prisma.card.update({
      where: { id: cardId },
      data: {
        clicks: { increment: 1 },
      },
    });
  }

  static async getPublicCard(cardId: string): Promise<Card | null> {
    const card = await prisma.card.findFirst({
      where: { 
        id: cardId,
        isActive: true 
      },
      include: { user: true },
    });

    if (card) {
      await this.incrementViews(cardId);
    }

    return card;
  }
}