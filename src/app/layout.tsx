import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {ReactNode} from 'react';
import './globals.css'; // Assuming you have a global CSS file

export default async function RootLayout({
  children,
  params: {locale}
}: {
  children: ReactNode;
  params: {locale: string};
}) {
  // Providing all messages to the client side is the easiest way to get started
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