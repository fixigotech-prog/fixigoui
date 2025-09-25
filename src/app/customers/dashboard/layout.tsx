'use client';

import clsx from 'clsx';
import {useTranslations} from 'next-intl';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ReactNode} from 'react';
import LocaleSwitcher from '@/components/LocaleSwitcher';

const DashboardNavLink = ({
  href,
  children
}: {
  href: string;
  children: ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={clsx(
        'rounded-md px-3 py-2 text-sm font-medium text-blue-100 hover:bg-blue-700 hover:text-white',
        isActive && 'bg-blue-800 text-white'
      )}
    >
      {children}
    </Link>
  );
};

export default function CustomersDashboardLayout({
  children
}: {
  children: ReactNode;
}) {
  const t = useTranslations('CustomersDashboardLayout');
  const tPage = useTranslations('CustomersDashboardPage');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-cyan-500 to-blue-500 pb-32 shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-white">
                Fixigo
              </Link>
              <nav className="ml-10 hidden space-x-4 md:flex">
                <DashboardNavLink href="/customers/dashboard">{t('home')}</DashboardNavLink>
                <DashboardNavLink href="/customers/dashboard/bookings">{t('bookings')}</DashboardNavLink>
                <DashboardNavLink href="/customers/dashboard/profile">{t('profile')}</DashboardNavLink>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <LocaleSwitcher />
              <Link href="/" className="font-semibold text-white transition-colors hover:text-blue-100">
                {t('logout')}
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">{tPage('title')}</h1>
            <p className="mt-2 text-lg text-blue-100">{tPage('welcomeMessage')}</p>
          </div>
        </div>
      </header>
      <main className="-mt-24">
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}