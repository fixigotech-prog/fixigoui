import {NextIntlClientProvider} from 'next-intl';
import {getMessages,getLocale} from 'next-intl/server';
import {ReactNode} from 'react';
import './globals.css'; // Assuming you have a global CSS file

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
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}