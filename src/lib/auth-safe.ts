// Safe auth configuration that doesn't validate environment variables during build
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";

// Basic auth configuration without validation (for build compatibility)
export const authOptionsSafe: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'build-placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'build-placeholder',
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      console.log('JWT callback - token:', !!token, 'user:', !!user, 'account:', !!account);
      
      if (account && user) {
        try {
          // Check if user exists in database, if not create them
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!dbUser) {
            console.log('Creating new user in database');
            dbUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || '',
                image: user.image || '',
                plan: 'FREE',
              },
            });
            console.log('User created:', dbUser.id);
          } else {
            console.log('User found in database:', dbUser.id);
          }

          token.userId = dbUser.id;
          token.plan = dbUser.plan;
        } catch (error) {
          console.error('Error in JWT callback:', error);
        }
      }
      
      return token;
    },
    session: async ({ session, token }) => {
      console.log('Session callback - session:', !!session, 'token:', !!token);
      
      if (token && session.user) {
        session.user.id = token.userId as string;
        session.user.plan = token.plan as string || 'FREE';
        console.log('Session user ID set to:', session.user.id);
      }
      
      return session;
    },
    signIn: async ({ user, account, profile }) => {
      console.log('SignIn callback - user:', user.email);
      return true;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    error: '/auth/error',
    signIn: '/',
  },
  debug: process.env.NODE_ENV === 'development',
};