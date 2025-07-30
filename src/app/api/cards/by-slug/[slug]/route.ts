import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const card = await prisma.card.findFirst({
      where: { 
        customUrl: params.slug,
        isActive: true 
      },
      include: { user: true },
    });
    
    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Increment views
    await prisma.card.update({
      where: { id: card.id },
      data: {
        views: { increment: 1 },
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error fetching card by slug:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}