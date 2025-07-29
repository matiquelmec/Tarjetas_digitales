// Safe auth configuration that doesn't validate environment variables during build
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";

// Basic auth configuration without validation (for build compatibility)
export const authOptionsSafe: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'build-placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'build-placeholder',
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      try {
        if (session?.user && user?.id) {
          session.user.id = user.id;
          
          // Get user's plan from database
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { plan: true }
          });
          
          session.user.plan = dbUser?.plan || 'FREE';
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    },
    signIn: async ({ user, account, profile }) => {
      try {
        return true;
      } catch (error) {
        console.error('SignIn callback error:', error);
        return false;
      }
    },
  },
  session: {
    strategy: "database" as const,
  },
  pages: {
    error: '/auth/error',
    signIn: '/',
  },
  debug: process.env.NODE_ENV === 'development',
};