'use client';

import {
  ChartBarIcon,
  Cog6ToothIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import {useTranslations} from 'next-intl';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ReactNode} from 'react';
import LocaleSwitcher from '@/components/LocaleSwitcher';

const navigation = [
  {name: 'dashboard', href: '/superadmin/dashboard', icon: HomeIcon},
  {name: 'categories', href: '/superadmin/categories', icon: Cog6ToothIcon},
  {name: 'subCategories', href: '/superadmin/subcategories', icon: Cog6ToothIcon},
  {name: 'users', href: '/superadmin/users', icon: UsersIcon},
  {name: 'services', href: '/superadmin/services', icon: Cog6ToothIcon},
  {name: 'frequentlyusedservice', href: '/superadmin/frequentlyservices', icon: Cog6ToothIcon},
  {name: 'bookings', href: '/superadmin/bookings', icon: FolderIcon},
  {name: 'offers', href: '/superadmin/offers', icon: Cog6ToothIcon},
  {name: 'promocodes', href: '/superadmin/promocodes', icon: Cog6ToothIcon},
  {name: 'reports', href: '#', icon: ChartBarIcon} // Placeholder
];

export default function SuperAdminLayout({children}: {children: ReactNode}) {
  const t = useTranslations('SuperAdminLayout');
  const pathname = usePathname();

  return (
    <div>
      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/" className="text-2xl font-bold text-white">
              Fixigo <span className="text-sm font-normal text-cyan-400">Admin</span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive =
                      item.href === '/superadmin/dashboard'
                        ? pathname === item.href
                        : pathname.startsWith(item.href);
                    return (
                      <li key={item.name}>
                      <Link
                        href={item.href}
                        className={clsx(
                          isActive
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                          'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                        )}
                      >
                        <item.icon
                          className="h-6 w-6 shrink-0"
                          aria-hidden="true"
                        />
                        {t(item.name)}
                      </Link>
                    </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          {/* Separator */}
          <div
            className="h-6 w-px bg-gray-900/10 lg:hidden"
            aria-hidden="true"
          />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <LocaleSwitcher />
              <div
                className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                aria-hidden="true"
              />
              {/* Profile dropdown */}
              <div className="relative">
                <span className="font-semibold">Super Admin</span>
              </div>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}