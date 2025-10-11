'use client';

import { StarIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function OurServicesSection() {
  const t = useTranslations('IndexPage');

  const serviceCategories = [
    {
      category: 'serviceCategoryCleaning',
      services: [
        { name: 'serviceDeepCleaning', image: `/images/ourservices/deepcleaning.jpg` },
        { name: 'serviceBathroomCleaning', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop' },
        { name: 'serviceKitchenCleaning', image: `/images/ourservices/kitchencleaning.jpg` },
        { name: 'serviceSofaCleaning', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop' },
        { name: 'servicePestControl', image: `/images/pestcontrol3.jpeg` }
      ]
    },
    {
      category: 'serviceCategoryAC',
      services: [
        { name: 'serviceACRepair', image: `/images/ourservices/acreapairphoto.jpg` },
        { name: 'serviceApplianceRepair', image: `/images/ourservices/appliancephoto.jpg` }
      ]
    },
    {
      category: 'serviceCategoryHomeRepairs',
      services: [
        { name: 'serviceElectrician', image: `/images/ourservices/electricianphoto.jpg` },
        { name: 'servicePlumbing', image: `/images/ourservices/plumbingphoto.jpg`},
        { name: 'serviceCarpenter', image: `/images/ourservices/carpenterphoto.jpg` },
        { name: 'servicePainting', image: `/images/ourservices/paintingphoto.jpg` }
      ]
    }
  ];

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('servicesTitle')}
          </h2>
        </div>
        <div className="mt-16 space-y-20">
          {serviceCategories.map((category) => (
            <div key={t(category.category)} className="relative">
              <h3 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-12 px-4 py-6">
                {t(category.category)}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {category.services.map((service, index) => (
                  <div
                    key={t(service.name)}
                    className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 cursor-pointer"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.8s ease-out forwards'
                    }}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={t(service.name)}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-sm text-gray-800 font-medium">Book Now</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {t(service.name)}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Professional Service</span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                          ))}
                          <span className="text-sm text-gray-500 ml-1">4.8</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Popular
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
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
    </section>
  );
}