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
  //remove the code below to allow any email domain to sign in
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
  //remove the code above to allow any email domain to sign in
});
