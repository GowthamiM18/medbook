// src/lib/auth.ts
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { getAuthSecret } from './auth-secret'

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export const authOptions: NextAuthOptions = {
  secret: getAuthSecret(),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null

          const email = normalizeEmail(credentials.email)
          if (!email) return null

          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user) return null

          const valid = await bcrypt.compare(credentials.password, user.password)
          if (!valid) return null

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: String(user.role),
          }
        } catch (e) {
          console.error('[next-auth authorize]', e)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = String((user as { role?: string }).role ?? '')
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        if (token.id) session.user.id = token.id as string
        if (token.role != null) session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
}
