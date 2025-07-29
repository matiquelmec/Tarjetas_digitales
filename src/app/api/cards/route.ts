import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptionsSafe } from '@/lib/auth-safe';
import { authOptionsDebug } from '@/lib/auth-debug';
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
    
    // Try both auth configurations for comparison
    console.log('=== Testing authOptionsSafe ===');
    const sessionSafe = await getServerSession(authOptionsSafe);
    console.log('Safe session result:', {
      hasSession: !!sessionSafe,
      hasUser: !!sessionSafe?.user,
      userId: sessionSafe?.user?.id,
      userEmail: sessionSafe?.user?.email
    });
    
    console.log('=== Testing authOptionsDebug ===');
    const sessionDebug = await getServerSession(authOptionsDebug);
    console.log('Debug session result:', {
      hasSession: !!sessionDebug,
      hasUser: !!sessionDebug?.user,
      userId: sessionDebug?.user?.id,
      userEmail: sessionDebug?.user?.email
    });
    
    // Use debug session for now
    const session = sessionDebug;
    
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
    const card = await CardService.createCard(session.user.id, cardData);
    
    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}