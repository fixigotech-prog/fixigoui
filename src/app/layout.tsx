import {ReactNode} from 'react';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import { StoreProvider } from '../store/provider';
import { Poppins } from 'next/font/google';
import './globals.css'; // Assuming you have a global CSS file

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
  
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <title>Fixigo</title>

      </head>
      <body className={poppins.className}>
        <StoreProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>{children}</NextIntlClientProvider>
        </StoreProvider>
      </body>
    </html>
  );
}