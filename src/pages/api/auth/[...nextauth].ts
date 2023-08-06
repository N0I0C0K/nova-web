import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
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
        if (credentials?.username !== 'admin') {
          return null
        }
        return {
          id: 'admin',
          name: credentials?.username,
        }
      },
    }),
  ],
})
