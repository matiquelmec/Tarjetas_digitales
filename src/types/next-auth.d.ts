import NextAuth from "next-auth"
import { Plan } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      plan?: Plan
    }
    accessToken?: string
  }

  interface User {
    id: string
    plan?: Plan
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string
    plan?: Plan
    accessToken?: string
  }
}