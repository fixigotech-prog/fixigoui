'use client';

import { CalendarDaysIcon, DevicePhoneMobileIcon, UserGroupIcon, StarIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

export default function HowItWorksSection() {
  const t = useTranslations('IndexPage');

  const howItWorks = [
    {name: 'step1Title', description: 'step1Desc', icon: CalendarDaysIcon},
    {name: 'step2Title', description: 'step2Desc', icon: DevicePhoneMobileIcon},
    {name: 'step3Title', description: 'step3Desc', icon: UserGroupIcon},
    {name: 'step4Title', description: 'step4Desc', icon: StarIcon}
  ];

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            {t('howItWorksSubtitle')}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('howItWorksTitle')}
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {howItWorks.map((step, index) => (
            <div
              key={t(step.name)}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                <step.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                {t(step.name)}
              </h3>
              <p className="mt-2 text-base text-gray-600">
                {t(step.description)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}