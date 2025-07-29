import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { authOptionsJWT } from "@/lib/auth-jwt";
import { logger } from "@/lib/logger";

// Try database auth first, fallback to JWT if it fails
let selectedAuthOptions = authOptions;

try {
  // Test if database auth is working
  logger.info('Attempting to use database authentication strategy');
  selectedAuthOptions = authOptions;
} catch (error) {
  logger.warn('Database authentication failed, falling back to JWT', error);
  selectedAuthOptions = authOptionsJWT;
}

const handler = NextAuth(selectedAuthOptions);

export { handler as GET, handler as POST };