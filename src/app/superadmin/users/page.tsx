'use client';

import {useTranslations} from 'next-intl';

// Mock data for users
const users = [
  { id: 'USR-001', name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '9876543210', role: 'Customer', joinDate: '2023-01-15' },
  { id: 'USR-002', name: 'Amit Kumar', email: 'amit.kumar@example.com', phone: '9876543211', role: 'Customer', joinDate: '2023-02-20' },
  { id: 'USR-003', name: 'Rohan Mehra', email: 'rohan.mehra@example.com', phone: '9876543212', role: 'Professional', joinDate: '2023-03-10' },
  { id: 'USR-004', name: 'Sunita Gupta', email: 'sunita.gupta@example.com', phone: '9876543213', role: 'Customer', joinDate: '2023-04-05' },
  { id: 'USR-005', name: 'Vikas Singh', email: 'vikas.singh@example.com', phone: '9876543214', role: 'Professional', joinDate: '2023-05-25' },
];

export default function UsersPage() {
  const t = useTranslations('SuperAdminUsersPage');

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-6 text-gray-900">{t('title')}</h1>
          <p className="mt-2 text-sm text-gray-700">{t('description')}</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-cyan-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          >
            {t('addUser')}
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">{t('name')}</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('email')}</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('phone')}</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('role')}</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('joinDate')}</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">{t('edit')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{user.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.phone}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.role}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.joinDate}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="text-cyan-600 hover:text-cyan-900">{t('edit')}<span className="sr-only">, {user.name}</span></a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}