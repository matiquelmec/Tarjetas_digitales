import { Plan } from '@prisma/client';
import { prisma } from './db';

export interface PlanLimits {
  maxCards: number;
  hasWatermark: boolean;
  hasAnalytics: boolean;
  hasCustomDomain: boolean;
  hasExport: boolean;
  hasPrioritySupport: boolean;
  // Premium visual effects
  canUseHoverEffect: boolean;
  canUseGlassmorphism: boolean;
  canUseSubtleAnimations: boolean;
  canUseBackgroundPatterns: boolean;
  canUseAIPalette: boolean;
  canUseCustomTemplates: boolean;
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  FREE: {
    maxCards: 1,
    hasWatermark: true,
    hasAnalytics: false,
    hasCustomDomain: false,
    hasExport: false,
    hasPrioritySupport: false,
    // Premium visual effects
    canUseHoverEffect: false,
    canUseGlassmorphism: false,
    canUseSubtleAnimations: false,
    canUseBackgroundPatterns: false,
    canUseAIPalette: false,
    canUseCustomTemplates: false,
  },
  PROFESSIONAL: {
    maxCards: 5,
    hasWatermark: false,
    hasAnalytics: true,
    hasCustomDomain: true,
    hasExport: true,
    hasPrioritySupport: true,
    // Premium visual effects
    canUseHoverEffect: true,
    canUseGlassmorphism: true,
    canUseSubtleAnimations: true,
    canUseBackgroundPatterns: true,
    canUseAIPalette: true,
    canUseCustomTemplates: true,
  },
  BUSINESS: {
    maxCards: 25,
    hasWatermark: false,
    hasAnalytics: true,
    hasCustomDomain: true,
    hasExport: true,
    hasPrioritySupport: true,
    // Premium visual effects
    canUseHoverEffect: true,
    canUseGlassmorphism: true,
    canUseSubtleAnimations: true,
    canUseBackgroundPatterns: true,
    canUseAIPalette: true,
    canUseCustomTemplates: true,
  },
  ENTERPRISE: {
    maxCards: -1, // Unlimited
    hasWatermark: false,
    hasAnalytics: true,
    hasCustomDomain: true,
    hasExport: true,
    hasPrioritySupport: true,
    // Premium visual effects
    canUseHoverEffect: true,
    canUseGlassmorphism: true,
    canUseSubtleAnimations: true,
    canUseBackgroundPatterns: true,
    canUseAIPalette: true,
    canUseCustomTemplates: true,
  },
};

export class PlanLimitService {
  static async canCreateCard(userId: string): Promise<{ allowed: boolean; reason?: string }> {
    console.log('PlanLimitService.canCreateCard - Starting with userId:', userId);
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { _count: { select: { cards: true } } }
    });

    console.log('PlanLimitService.canCreateCard - User lookup result:', {
      found: !!user,
      userId: userId,
      userPlan: user?.plan,
      cardCount: user?._count?.cards
    });

    if (!user) {
      console.error('PlanLimitService.canCreateCard - User not found:', userId);
      
      // Intentar buscar por email si userId podría ser un email
      if (userId.includes('@')) {
        console.log('PlanLimitService - Attempting to find user by email:', userId);
        const userByEmail = await prisma.user.findUnique({
          where: { email: userId },
          include: { _count: { select: { cards: true } } }
        });
        
        if (userByEmail) {
          console.log('PlanLimitService - Found user by email:', userByEmail.id);
          // Continuar con la lógica usando el usuario encontrado por email
          const limits = PLAN_LIMITS[userByEmail.plan];
          const currentCardCount = userByEmail._count.cards;

          if (limits.maxCards === -1) {
            return { allowed: true };
          }

          if (currentCardCount >= limits.maxCards) {
            return { 
              allowed: false, 
              reason: `Your ${userByEmail.plan} plan allows a maximum of ${limits.maxCards} card${limits.maxCards > 1 ? 's' : ''}. Please upgrade to create more cards.`
            };
          }

          return { allowed: true };
        } else {
          // Si no encontramos por email, intentar crear el usuario
          console.log('PlanLimitService - User not found by email, attempting to create:', userId);
          try {
            const newUser = await prisma.user.create({
              data: {
                email: userId,
                name: '',
                image: '',
                plan: 'FREE',
              },
              include: { _count: { select: { cards: true } } }
            });
            
            console.log('PlanLimitService - User created successfully:', newUser.id);
            
            // Continuar con la lógica para el nuevo usuario
            const limits = PLAN_LIMITS[newUser.plan];
            const currentCardCount = newUser._count.cards;

            if (limits.maxCards === -1) {
              return { allowed: true };
            }

            if (currentCardCount >= limits.maxCards) {
              return { 
                allowed: false, 
                reason: `Your ${newUser.plan} plan allows a maximum of ${limits.maxCards} card${limits.maxCards > 1 ? 's' : ''}. Please upgrade to create more cards.`
              };
            }

            return { allowed: true };
          } catch (createError) {
            console.error('PlanLimitService - Failed to create user:', createError);
            return { allowed: false, reason: 'Unable to create user account. Please try logging out and logging back in.' };
          }
        }
      }
      
      return { allowed: false, reason: 'User not found in database. Please try logging out and logging back in.' };
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