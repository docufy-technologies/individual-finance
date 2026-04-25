/**
 * Auth.js configuration with JWT strategy
 *
 * Uses Auth.js v5 (beta) with JWT sessions for stateless authentication.
 * Access token is short-lived (15 min), refresh token is stored in DB with rotation.
 *
 * @example
 * // In API route: export { handlers as GET, POST } from "@/server/auth/auth.config"
 * // In server component: const session = await auth()
 * // In middleware: export { auth as middleware } from "@/server/auth/auth.config"
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const NextAuth = require("next-auth")
import { compare } from "bcryptjs"

import { prisma } from "@/server/db/prisma"
import { getAuthSecret } from "@/shared/config/env"
import {
  createRefreshToken,
  invalidateRefreshToken,
  invalidateAllUserRefreshTokens,
} from "./refresh-token.service"

const ACCESS_TOKEN_MAX_AGE = 15 * 60 // 15 minutes in seconds

// NextAuth v5 beta initialization
const { handlers, auth, signIn, signOut } = NextAuth({
  secret: getAuthSecret(),
  session: {
    strategy: "jwt",
    maxAge: ACCESS_TOKEN_MAX_AGE,
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
    error: "/sign-in",
  },
  providers: [
    {
      id: "credentials",
      name: "credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, unknown>) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user?.passwordHash) {
          return null
        }

        const isValid = await compare(password, user.passwordHash)
        if (!isValid) {
          return null
        }

        return {
          id: user.uuid,
          email: user.email,
          name: user.fullName,
        }
      },
    },
  ],
  callbacks: {
    // @ts-expect-error - callback types have implicit any
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }

      if (trigger === "signIn" && token.id) {
        const refreshToken = await createRefreshToken(token.id as string)
        token.refreshTokenId = refreshToken.uuid
      }

      if (trigger === "update" && token.id) {
        const oldTokenId = token.refreshTokenId as string | undefined
        if (oldTokenId) {
          await invalidateRefreshToken(oldTokenId)
        }
        const newRefreshToken = await createRefreshToken(token.id as string)
        token.refreshTokenId = newRefreshToken.uuid
      }

      return token
    },
    // @ts-expect-error - callback types have implicit any
    async session({ session, token }) {
      if (token.id) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string | null,
        }
        session.refreshTokenId = token.refreshTokenId as string | undefined
      }
      return session
    },
  },
  events: {
    // @ts-expect-error - event types have implicit any
    async signOut({ token }) {
      if (token?.id) {
        await invalidateAllUserRefreshTokens(token.id as string)
      }
    },
  },
})

export { auth, signIn, signOut, handlers, ACCESS_TOKEN_MAX_AGE }