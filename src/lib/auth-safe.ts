// Safe auth configuration that doesn't validate environment variables during build
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./db";
import { Plan } from "@prisma/client";

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
            console.log('Creating new user in database for email:', user.email);
            dbUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || '',
                image: user.image || '',
                plan: Plan.FREE,
              },
            });
            console.log('User created successfully:', dbUser.id);
          } else {
            console.log('User found in database:', dbUser.id);
          }

          token.userId = dbUser.id;
          token.plan = dbUser.plan;
          console.log('Token updated with userId:', dbUser.id, 'plan:', dbUser.plan);
        } catch (error) {
          console.error('Error in JWT callback:', error);
          // Even if there's an error, don't fail the login completely
          if (user.email) {
            token.userId = user.email; // Fallback to email as ID
            token.plan = Plan.FREE;
          }
        }
      }
      
      // Always ensure we have userId from token in subsequent calls
      if (!token.userId && user?.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });
          if (dbUser) {
            token.userId = dbUser.id;
            token.plan = dbUser.plan;
            console.log('Retrieved existing user from token refresh:', dbUser.id);
          }
        } catch (error) {
          console.error('Error retrieving user in token refresh:', error);
        }
      }
      
      return token;
    },
    session: async ({ session, token }) => {
      console.log('Session callback - session:', !!session, 'token:', !!token);
      
      if (token && session.user) {
        // Ensure we always use the database ID, not the OAuth ID
        if (session.user.email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: session.user.email }
            });
            if (dbUser) {
              session.user.id = dbUser.id; // Use database ID
              session.user.plan = dbUser.plan;
              console.log('Session user ID set to database ID:', dbUser.id);
            } else {
              session.user.id = token.userId as string;
              session.user.plan = token.plan || Plan.FREE;
              console.log('Session user ID set to token ID:', token.userId);
            }
          } catch (error) {
            console.error('Error fetching user in session callback:', error);
            session.user.id = token.userId as string;
            session.user.plan = token.plan || Plan.FREE;
          }
        } else {
          session.user.id = token.userId as string;
          session.user.plan = token.plan || Plan.FREE;
        }
      }
      
      return session;
    },
    signIn: async ({ user }) => {
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