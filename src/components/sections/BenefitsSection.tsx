'use client';

import { ClockIcon, ShieldCheckIcon, SparklesIcon, CurrencyRupeeIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

export default function BenefitsSection() {
  const t = useTranslations('IndexPage');

  const benefits = [
    {
      name: 'benefitConvenienceTitle',
      description: 'benefitConvenienceDesc',
      icon: ClockIcon
    },
    {
      name: 'benefitProfessionalsTitle',
      description: 'benefitProfessionalsDesc',
      icon: ShieldCheckIcon
    },
    {
      name: 'benefitQualityTitle',
      description: 'benefitQualityDesc',
      icon: SparklesIcon
    },
    {
      name: 'benefitPricingTitle',
      description: 'benefitPricingDesc',
      icon: CurrencyRupeeIcon
    }
  ];

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            {t('benefitsTitle')}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('whyChooseUsTitle')}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={t(benefit.name)} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <benefit.icon
                    className="h-5 w-5 flex-none text-blue-600"
                    aria-hidden="true"
                  />
                  {t(benefit.name)}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{t(benefit.description)}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}