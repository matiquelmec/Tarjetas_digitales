import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptionsSafe } from '@/lib/auth-safe';
import { CardService } from '@/lib/cardService';
import { AccessService, PlanLimitService } from '@/lib/planLimits';

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

    // Check user access before creating card
    const accessCheck = await AccessService.canCreateCard(session.user.id);
    if (!accessCheck.allowed) {
      return NextResponse.json({ 
        error: 'Access denied',
        message: accessCheck.reason 
      }, { status: 403 });
    }

    const cardData = await request.json();

    // Verificar acceso del usuario
    const userAccess = await AccessService.getUserAccess(session.user.id);
    if (!userAccess || !userAccess.hasAccess) {
      return NextResponse.json({ 
        error: 'Access required',
        message: userAccess?.isTrialUser 
          ? 'Tu período de prueba ha expirado. Suscríbete por $4,990 CLP para continuar.'
          : 'Necesitas una suscripción activa para crear tarjetas.'
      }, { status: 403 });
    }
    
    // Con el nuevo sistema, todos los usuarios con acceso tienen todas las funciones
    // No necesitamos validar funciones individuales ya que el trial incluye todo

    // Crear la tarjeta con acceso completo a todas las funciones
    const card = await CardService.createCard(session.user.id, cardData);
    
    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}