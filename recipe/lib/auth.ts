import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      name: 'Email',
      credentials: {
        email: {
          label: '이메일',
          type: 'email',
          placeholder: 'example@example.com',
        },
        passwd: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.passwd)
          return null;
        const { email } = credentials;
        const user = { email } as User;
        return user;
      },
    }),
    Google,
    GitHub,
  ],
  callbacks: {
    session({ session }) {
      console.log('🚀 cb - session:', session);
      return session;
    },
  },
});
