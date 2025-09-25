'use client';

import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  TagIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import {useTranslations} from 'next-intl';
import Link from 'next/link';

// Mock data, in a real app this would come from an API
const recentBookings = [
  {
    id: 'BK-12345',
    service: 'serviceDeepCleaning',
    date: '2023-10-26',
    status: 'Completed',
    amount: 2499
  },
  {
    id: 'BK-12366',
    service: 'serviceACRepair',
    date: '2023-11-15',
    status: 'Upcoming',
    amount: 799
  },
  {
    id: 'BK-12298',
    service: 'servicePlumbing',
    date: '2023-10-15',
    status: 'Cancelled',
    amount: 499
  }
];

const offers = [
  {
    title: 'offer1Title',
    description: 'offer1Desc',
    code: 'CLEAN20'
  },
  {
    title: 'offer2Title',
    description: 'offer2Desc',
    code: 'HOMEFRESH'
  }
];

const statusStyles = {
  Completed: 'bg-green-100 text-green-800',
  Upcoming: 'bg-yellow-100 text-yellow-800',
  Cancelled: 'bg-red-100 text-red-800'
};

export default function CustomersDashboardPage() {
  const t = useTranslations('CustomersDashboardPage');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <CheckCircleIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-500" />
        );
      case 'Upcoming':
        return (
          <ClockIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-yellow-500" />
        );
      case 'Cancelled':
        return (
          <XCircleIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-red-500" />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left Column (New Booking & Offers) */}
        <div className="space-y-10 lg:col-span-1">
          {/* New Booking */}
          <section className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('newBookingTitle')}
            </h2>
            <p className="mt-2 text-gray-600">{t('newBookingDesc')}</p>
            <Link
              href="/" // Should link to service selection page
              className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-cyan-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-cyan-500"
            >
              {t('bookNowButton')}
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </section>

          {/* Offers */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              {t('offersTitle')}
            </h2>
            <div className="space-y-4">
              {offers.map((offer) => (
                <div
                  key={offer.code}
                  className="rounded-lg border border-dashed border-gray-300 bg-white p-4"
                >
                  <div className="flex items-start">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                      <TagIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">
                        {t(offer.title)}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {t(offer.description)}
                      </p>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">{t('promoCode')}: </span>
                        <span className="select-all font-mono text-cyan-700">
                          {offer.code}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (Recent Bookings) */}
        <div className="lg:col-span-2">
          <section className="rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold leading-6 text-gray-900">
                {t('recentBookingsTitle')}
              </h2>
            </div>
            <ul role="list" className="divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <li
                  key={booking.id}
                  className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 px-6 py-5"
                >
                  <div className="flex min-w-0 gap-x-4">
                    <div className="min-w-0 flex-auto">
                      <p className="font-semibold text-gray-900">
                        {t(booking.service)}
                      </p>
                      <p className="mt-1 flex items-center text-sm text-gray-500">
                        <CalendarDaysIcon className="mr-1.5 h-4 w-4" />
                        {new Date(booking.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-4">
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statusStyles[
                          booking.status as keyof typeof statusStyles
                        ]
                      }`}
                    >
                      {getStatusIcon(booking.status)}
                      {t(booking.status.toLowerCase() as any)}
                    </div>
                    <p className="font-semibold text-gray-900">
                      ₹{booking.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}