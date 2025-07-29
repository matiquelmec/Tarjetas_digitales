import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
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
    },
    signIn: async ({ user, account, profile }) => {
      return true;
    },
  },
  session: {
    strategy: "database",
  },
  pages: {
    error: '/auth/error',
    signIn: '/',
  },
  debug: false,
};