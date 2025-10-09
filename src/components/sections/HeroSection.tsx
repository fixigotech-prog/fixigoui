'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface FrequentService {
  id: number;
  serviceId: number;
  serviceName: string;
  imageUrl: string;
}

interface HeroSectionProps {
  frequentServices: FrequentService[];
}

export default function HeroSection({ frequentServices }: HeroSectionProps) {
  const t = useTranslations('IndexPage');

  return (
    <main>
      <div className="relative isolate bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800">
        <div className="overflow-hidden pt-14">
          <div className="mx-auto grid grid-cols-1 gap-x-8 gap-y-16 px-6 lg:grid-cols-2">
            <div className="flex flex-col justify-center py-10 text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                {t("fucTitle")}
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-4">
                {frequentServices.map((service, index) => (
                  <a
                    key={service.id}
                    href={`/booking?serviceId=${service.serviceId}`}
                    className="group flex flex-col items-center text-center transition-all duration-300 hover:scale-105 object-cover"
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animation: 'fadeInUp 0.8s ease-out forwards'
                    }}
                  >
                    <img 
                      src={service.imageUrl} 
                      alt={service.serviceName}
                      className="w-[120px] h-[120px] object-cover rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300"
                    />
                    <p className="text-xs font-bold text-white mt-2 group-hover:text-blue-200 transition-colors duration-300">{service.serviceName}</p>
                  </a>
                ))}
              </div>
              <style jsx>{`
                @keyframes fadeInUp {
                  from {
                    opacity: 0;
                    transform: translateY(30px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
            </div>
            <div className="mx-auto max-w-7xl px-6 pb-16 pt-10 sm:pt-16 lg:px-8 lg:pt-20">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  {t('title')}
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-200">
                  {t('subtitle')}
                </p>
              </div>
              <div className="mt-16 grid grid-cols-1 gap-8 sm:mt-24 md:grid-cols-3">
                <Image
                  src="/images/cleaning-main.png"
                  alt="Technician working on an air conditioner"
                  width={400} height={300}
                  className="aspect-[4/3] w-full rounded-lg object-cover shadow-lg"
                />
                <Image
                  src="/images/Pest-control.jpeg"
                  width={400} height={300}
                  style={{ objectFit: 'fill' }}
                  alt="Person cleaning a window"
                  className="aspect-[4/3] w-full rounded-lg object-cover shadow-lg"
                />
                <Image
                  src="/images/ac-repair.jpeg"
                  alt="Electrician working on a circuit breaker"
                  width={400} height={300}
                  className="aspect-[4/3] w-full rounded-lg object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}