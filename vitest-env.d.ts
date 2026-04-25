/// <reference types="vitest/globals" />

// NextAuth type augmentations
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string | null
    }
    refreshTokenId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    refreshTokenId?: string
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string
    refreshTokenId?: string
  }
}
