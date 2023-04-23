import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Analytics } from '@vercel/analytics/react';
import { Session } from 'next-auth';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';

import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

function App({ Component, pageProps }: AppProps<{ session: Session }>) {
  const queryClient = new QueryClient();

  return (
    <SessionProvider session={pageProps.session}>
      <div className={inter.className}>
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <Analytics />
        </QueryClientProvider>
     
      </div>

    </SessionProvider>
  );
}

export default appWithTranslation(App);
