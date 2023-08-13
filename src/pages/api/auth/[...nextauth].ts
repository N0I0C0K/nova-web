import { prisma } from '@/db'
import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { decode as r_decode } from 'next-auth/jwt'

export interface CustomToken {
  id: string
}

export const options: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'account',
      id: 'account',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        console.log(credentials)

        const userSecure = await prisma.userSecure.findFirst({
          where: {
            username: credentials?.username,
            password: credentials?.password,
          },
          include: {
            user: true,
          },
        })
        if (!userSecure) {
          return null
        }
        return {
          id: userSecure.user!.id,
          name: userSecure.user!.name,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token, user }) {
      return {
        ...session,
        id: token.id,
      }
    },
  },
  jwt: {},
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
}

export default NextAuth(options)
