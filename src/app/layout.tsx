import {NextIntlClientProvider} from 'next-intl';
import {getMessages,getLocale} from 'next-intl/server';
import {ReactNode} from 'react';
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
  // Providing all messages to the client side is the easiest way to get started
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={poppins.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}