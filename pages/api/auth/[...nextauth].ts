import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  secret: process.env.JWT_SECRET ?? '',
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        return (
          profile?.email?.endsWith(process.env.ALLOWED_EMAIL_DOMAIN ?? '') ??
          false
        );
      }
      return true;
    },
  },
});
