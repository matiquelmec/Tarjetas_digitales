import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptionsSafe } from '@/lib/auth-safe';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    checks: {},
    errors: [],
    warnings: []
  };

  try {
    // Check environment variables
    diagnostics.checks.envVars = {
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      DATABASE_URL: !!process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV
    };

    // Test database connection
    try {
      await prisma.$connect();
      await prisma.user.findFirst();
      diagnostics.checks.database = { connected: true, canQuery: true };
    } catch (dbError) {
      diagnostics.checks.database = { 
        connected: false, 
        error: dbError instanceof Error ? dbError.message : 'Unknown DB error' 
      };
      diagnostics.errors.push('Database connection failed');
    }

    // Test NextAuth session
    try {
      const session = await getServerSession(authOptionsSafe);
      diagnostics.checks.nextAuth = { 
        configured: true, 
        hasSession: !!session,
        sessionStrategy: 'database'
      };
      diagnostics.session = session;
    } catch (authError) {
      diagnostics.checks.nextAuth = { 
        configured: false, 
        error: authError instanceof Error ? authError.message : 'Unknown auth error' 
      };
      diagnostics.errors.push('NextAuth configuration failed');
    }

    // Get recent logs
    diagnostics.recentLogs = logger.getLogs().slice(-20);
    diagnostics.recentErrors = logger.getRecentErrors();

    // Overall health check
    diagnostics.healthy = diagnostics.errors.length === 0;

    return NextResponse.json(diagnostics, { 
      status: diagnostics.healthy ? 200 : 500 
    });

  } catch (error) {
    logger.error('Diagnostics endpoint error', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      recentLogs: logger.getLogs().slice(-10)
    }, { status: 500 });
  }
}