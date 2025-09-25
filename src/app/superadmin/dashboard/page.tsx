'use client';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CurrencyRupeeIcon,
  FolderIcon,
  UsersIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import {useTranslations} from 'next-intl';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

// Mock data
const stats = [
  {
    id: 1,
    name: 'totalRevenue',
    stat: '₹4,05,896',
    icon: CurrencyRupeeIcon,
    change: '12.2%',
    changeType: 'increase'
  },
  {
    id: 2,
    name: 'totalBookings',
    stat: '1,287',
    icon: FolderIcon,
    change: '5.4%',
    changeType: 'increase'
  },
  {
    id: 3,
    name: 'activeUsers',
    stat: '8,921',
    icon: UsersIcon,
    change: '3.2%',
    changeType: 'decrease'
  },
  {
    id: 4,
    name: 'servicesOffered',
    stat: '24',
    icon: WrenchScrewdriverIcon,
    change: 'N/A',
    changeType: 'none'
  }
];

const monthlyRevenueData = [
  {name: 'Jan', Revenue: 40000},
  {name: 'Feb', Revenue: 30000},
  {name: 'Mar', Revenue: 50000},
  {name: 'Apr', Revenue: 45000},
  {name: 'May', Revenue: 60000},
  {name: 'Jun', Revenue: 55000}
];

const bookingsData = [
  {name: 'Week 1', Bookings: 120},
  {name: 'Week 2', Bookings: 150},
  {name: 'Week 3', Bookings: 130},
  {name: 'Week 4', Bookings: 180}
];

const recentActivity = [
  {
    id: 1,
    user: 'Priya S.',
    service: 'Deep Cleaning',
    status: 'Completed',
    amount: '₹2,499'
  },
  {id: 2, user: 'Amit K.', service: 'AC Repair', status: 'Upcoming', amount: '₹799'},
  {
    id: 3,
    user: 'Rohan M.',
    service: 'Plumbing',
    status: 'Completed',
    amount: '₹499'
  },
  {
    id: 4,
    user: 'Sunita G.',
    service: 'Kitchen Cleaning',
    status: 'Cancelled',
    amount: '₹1,299'
  }
];

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function SuperAdminDashboardPage() {
  const t = useTranslations('SuperAdminDashboardPage');
  const tLayout = useTranslations('SuperAdminLayout');

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        {tLayout('dashboard')}
      </h1>

      {/* Stat Cards */}
      <div className="mt-8">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className="absolute rounded-md bg-cyan-500 p-3">
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {t(item.name)}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                {item.changeType !== 'none' && (
                  <p
                    className={classNames(
                      item.changeType === 'increase'
                        ? 'text-green-600'
                        : 'text-red-600',
                      'ml-2 flex items-baseline text-sm font-semibold'
                    )}
                  >
                    {item.changeType === 'increase' ? (
                      <ArrowUpIcon
                        className="h-5 w-5 flex-shrink-0 self-center text-green-500"
                        aria-hidden="true"
                      />
                    ) : (
                      <ArrowDownIcon
                        className="h-5 w-5 flex-shrink-0 self-center text-red-500"
                        aria-hidden="true"
                      />
                    )}
                    <span className="sr-only">
                      {' '}
                      {item.changeType === 'increase'
                        ? 'Increased'
                        : 'Decreased'}{' '}
                      by{' '}
                    </span>
                    {item.change}
                  </p>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-cyan-600 hover:text-cyan-500"
                    >
                      {t('viewAll')}
                      <span className="sr-only"> {t(item.name)} stats</span>
                    </a>
                  </div>
                </div>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Charts */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Monthly Revenue */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('monthlyRevenue')}
          </h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Revenue" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Over Time */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('bookingsOverTime')}
          </h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Bookings"
                  stroke="#0891b2"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900">
          {t('recentActivity')}
        </h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
          <ul role="list" className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-cyan-600">
                    {activity.service}
                  </p>
                  <div className="ml-2 flex flex-shrink-0">
                    <p
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        activity.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : activity.status === 'Upcoming'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {t(activity.status.toLowerCase() as any)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <UsersIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      {activity.user}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <CurrencyRupeeIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    {activity.amount}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}