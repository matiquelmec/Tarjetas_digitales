import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptionsSafe } from '@/lib/auth-safe';
// import { authOptionsDebug } from '@/lib/auth-debug'; // Unused import
import { CardService } from '@/lib/cardService';
import { PlanLimitService } from '@/lib/planLimits';

export async function GET() {
  try {
    console.log('GET /api/cards - Starting request');
    const session = await getServerSession(authOptionsSafe);
    
    console.log('GET Session data:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    });
    
    if (!session?.user?.id) {
      console.log('GET Authorization failed - no session or user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cards = await CardService.getUserCards(session.user.id);
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/cards - Starting request');
    
    // Use the updated authOptionsSafe with JWT strategy
    const session = await getServerSession(authOptionsSafe);
    
    console.log('Session data:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    });
    
    if (!session?.user?.id) {
      console.log('Authorization failed - no session or user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check plan limits before creating card
    const limitCheck = await PlanLimitService.canCreateCard(session.user.id);
    if (!limitCheck.allowed) {
      return NextResponse.json({ 
        error: 'Plan limit exceeded',
        message: limitCheck.reason 
      }, { status: 403 });
    }

    const cardData = await request.json();

    // Validate premium features against user's plan
    const planLimits = await PlanLimitService.getUserPlanLimits(session.user.id);
    if (planLimits) {
      if (cardData.enableHoverEffect && !planLimits.canUseHoverEffect) {
        return NextResponse.json({ error: 'Hover effect is a premium feature.' }, { status: 403 });
      }
      if (cardData.enableGlassmorphism && !planLimits.canUseGlassmorphism) {
        return NextResponse.json({ error: 'Glassmorphism is a premium feature.' }, { status: 403 });
      }
      if (cardData.enableSubtleAnimations && !planLimits.canUseSubtleAnimations) {
        return NextResponse.json({ error: 'Subtle animations are a premium feature.' }, { status: 403 });
      }
      if (cardData.enableBackgroundPatterns && !planLimits.canUseBackgroundPatterns) {
        return NextResponse.json({ error: 'Background patterns are a premium feature.' }, { status: 403 });
      }
      if (cardData.enableAIPalette && !planLimits.canUseAIPalette) {
        return NextResponse.json({ error: 'AI palettes are a premium feature.' }, { status: 403 });
      }
    }

    const card = await CardService.createCard(session.user.id, cardData);
    
    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}