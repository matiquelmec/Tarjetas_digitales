import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PlanLimitService } from '@/lib/planLimits';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const planLimits = await PlanLimitService.getUserPlanLimits(session.user.id);
    
    if (!planLimits) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(planLimits);
  } catch (error) {
    console.error('Error fetching plan limits:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}