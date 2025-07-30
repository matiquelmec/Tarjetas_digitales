import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptionsSafe } from '@/lib/auth-safe';
import { prisma } from '@/lib/db';
import { Plan } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/user/ensure - Starting request');
    
    const session = await getServerSession(authOptionsSafe);
    
    console.log('Session data:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      userName: session?.user?.name
    });
    
    if (!session?.user?.email) {
      console.log('No authenticated user found');
      return NextResponse.json({ error: 'No authenticated user found' }, { status: 401 });
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    console.log('User lookup result:', {
      found: !!user,
      email: session.user.email,
      userId: user?.id
    });

    if (!user) {
      console.log('Creating new user for:', session.user.email);
      
      try {
        user = await prisma.user.create({
          data: {
            email: session.user.email,
            name: session.user.name || '',
            image: session.user.image || '',
            plan: Plan.FREE,
          },
        });
        
        console.log('User created successfully:', {
          id: user.id,
          email: user.email,
          plan: user.plan
        });
        
        return NextResponse.json({ 
          success: true, 
          message: 'User created successfully',
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            plan: user.plan
          }
        });
      } catch (createError) {
        console.error('Error creating user:', createError);
        return NextResponse.json({ 
          error: 'Failed to create user',
          details: createError instanceof Error ? createError.message : 'Unknown error'
        }, { status: 500 });
      }
    } else {
      console.log('User already exists:', user.id);
      return NextResponse.json({ 
        success: true, 
        message: 'User already exists',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan
        }
      });
    }
  } catch (error) {
    console.error('Error in /api/user/ensure:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : null) : null
    }, { status: 500 });
  }
}

// Also allow GET for testing
export async function GET() {
  return POST({} as NextRequest);
}