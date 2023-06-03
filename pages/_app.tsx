import '@/styles/base.css';
import type { AppProps as NextAppProps } from 'next/app';
import { Inter } from 'next/font/google';

type AppProps = NextAppProps;

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.variable}>
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
