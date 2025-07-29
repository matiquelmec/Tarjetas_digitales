import NextAuth from "next-auth";
import { authOptionsMinimal } from "@/lib/auth-minimal";

// Use minimal JWT-only configuration to isolate issues
const handler = NextAuth(authOptionsMinimal);

export { handler as GET, handler as POST };