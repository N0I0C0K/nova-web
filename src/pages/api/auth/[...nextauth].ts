import { prisma } from '@/db'
import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export interface CustomSession {
  expires: string
  id: string
  user: {
    name: string | undefined | null
  }
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
        // todo, imporve
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
      console.log(user)
      console.log(account)
      console.log(token)
      return token
    },
    async session({ session, token, user }) {
      console.log(session)
      console.log(token)
      console.log(user)
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
}

export default NextAuth(options)
