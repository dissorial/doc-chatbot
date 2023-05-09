import '@/styles/base.css';
import type { AppProps as NextAppProps } from 'next/app';
import { Session } from 'next-auth';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';

type AppProps = NextAppProps & {
  session: Session;
};

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

function MyApp({ Component, pageProps, session }: AppProps) {
  return (
    <SessionProvider session={session}>
      <main className={inter.variable}>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}

export default MyApp;
