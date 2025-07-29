import { Plan } from '@prisma/client';
import { prisma } from './db';

export interface PlanLimits {
  maxCards: number;
  hasWatermark: boolean;
  hasAnalytics: boolean;
  hasCustomDomain: boolean;
  hasExport: boolean;
  hasPrioritySupport: boolean;
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  FREE: {
    maxCards: 1,
    hasWatermark: true,
    hasAnalytics: false,
    hasCustomDomain: false,
    hasExport: false,
    hasPrioritySupport: false,
  },
  PROFESSIONAL: {
    maxCards: 5,
    hasWatermark: false,
    hasAnalytics: true,
    hasCustomDomain: true,
    hasExport: true,
    hasPrioritySupport: true,
  },
  BUSINESS: {
    maxCards: 25,
    hasWatermark: false,
    hasAnalytics: true,
    hasCustomDomain: true,
    hasExport: true,
    hasPrioritySupport: true,
  },
  ENTERPRISE: {
    maxCards: -1, // Unlimited
    hasWatermark: false,
    hasAnalytics: true,
    hasCustomDomain: true,
    hasExport: true,
    hasPrioritySupport: true,
  },
};

export class PlanLimitService {
  static async canCreateCard(userId: string): Promise<{ allowed: boolean; reason?: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { _count: { select: { cards: true } } }
    });

    if (!user) {
      return { allowed: false, reason: 'User not found' };
    }

    const limits = PLAN_LIMITS[user.plan];
    const currentCardCount = user._count.cards;

    if (limits.maxCards === -1) {
      return { allowed: true };
    }

    if (currentCardCount >= limits.maxCards) {
      return { 
        allowed: false, 
        reason: `Your ${user.plan} plan allows a maximum of ${limits.maxCards} card${limits.maxCards > 1 ? 's' : ''}. Please upgrade to create more cards.`
      };
    }

    return { allowed: true };
  }

  static getPlanLimits(plan: Plan): PlanLimits {
    return PLAN_LIMITS[plan];
  }

  static async getUserPlanLimits(userId: string): Promise<PlanLimits | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true }
    });

    if (!user) return null;

    return PLAN_LIMITS[user.plan];
  }
}