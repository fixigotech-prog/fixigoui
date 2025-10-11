'use client';

import { StarIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface FrequentService {
  id: number;
  serviceId: number;
  serviceName: string;
  usageCount: number;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

interface FrequentServicesSectionProps {
  services: FrequentService[];
}

export default function FrequentServicesSection({ services }: FrequentServicesSectionProps) {
  if (!services || services.length === 0) return null;

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently Used Services
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Popular services chosen by our customers
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {services.slice(0, 8).map((service) => (
            <div
              key={service.id}
              className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.imageUrl || '/images/default-service.jpg'}
                  alt={service.serviceName}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Popular
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {service.serviceName}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Used {service.usageCount} times
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">4.8</span>
                  </div>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}