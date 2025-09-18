import NextAuth from "next-auth";
import { authOptionsSafe } from "@/lib/auth-safe";

// Use safe configuration without UserStatus enum issues
const handler = NextAuth(authOptionsSafe);

export { handler as GET, handler as POST };