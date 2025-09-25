'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import axios from 'axios';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ServiceDetail = {
  id: number;
  name: string;
  description: string;
  lang: string;
};

type Service = {
  id: number;
  subCategoryId: number;
  price: number;
  term: string;
  termUnit: string;
  imageUrl: string | null;
  videoUrl: string | null;
  isActive: boolean;
  details: ServiceDetail[];
};

type GroupedService = {
  name: string;
  imageUrl: string | null;
  options: {
    id: number;
    price: number;
    term: string;
    termUnit: string;
  }[];
};

export default function NewBookingPage() {
  const t = useTranslations('SuperAdminBookingsPage');
  const locale = useLocale();
  const [services, setServices] = useState<GroupedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTerms, setSelectedTerms] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get<Service[]>(`${API_URL}/api/services`);
        const activeServices = response.data.filter(s => s.isActive);

        const grouped = activeServices.reduce((acc, service) => {
          const detail = service.details.find(d => d.lang === locale) || service.details.find(d => d.lang === 'en');
          if (!detail) return acc;

          const name = detail.name;
          if (!acc[name]) {
            acc[name] = {
              name: name,
              imageUrl: service.imageUrl,
              options: [],
            };
          }

          acc[name].options.push({
            id: service.id,
            price: service.price,
            term: service.term,
            termUnit: service.termUnit,
          });

          return acc;
        }, {} as { [key: string]: GroupedService });

        setServices(Object.values(grouped));
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [locale]);

  const handleTermChange = (serviceName: string, serviceId: number) => {
    setSelectedTerms(prev => ({
      ...prev,
      [serviceName]: serviceId,
    }));
  };

  if (loading) {
    return <div>{t('loadingServices')}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold leading-6 text-gray-900">{t('addBooking')}</h1>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {services.map((service) => {
          const selectedOptionId = selectedTerms[service.name] || service.options[0].id;
          const selectedOption = service.options.find(o => o.id === selectedOptionId) || service.options[0];

          return (
            <div key={service.name} className="group relative rounded-lg bg-white p-4 shadow">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
                <Image
                  src={service.imageUrl}
                  alt={service.name}
                  width={300}
                  height={320}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">{service.name}</h3>
                  {service.options.length > 1 ? (
                    <div className="mt-1">
                      <select value={selectedOptionId} onChange={(e) => handleTermChange(service.name, Number(e.target.value))} className="block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-base focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm">
                        {service.options.map(option => (
                          <option key={option.id} value={option.id}>
                            {option.term !== '0' && option.termUnit ? `${option.term} ${option.termUnit}` : t('oneTime')}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : ( selectedOption.term !== '0' && selectedOption.termUnit && ( <p className="mt-1 text-sm text-gray-500">{`${selectedOption.term} ${selectedOption.termUnit}`}</p> ) )}
                </div>
                <p className="text-sm font-medium text-gray-900">₹{selectedOption.price}</p>
              </div>
              <button className="mt-4 w-full rounded-md bg-cyan-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-cyan-500">{t('addBooking')}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}