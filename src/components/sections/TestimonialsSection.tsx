'use client';

import { StarIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

export default function TestimonialsSection() {
  const t = useTranslations('IndexPage');

  const testimonials = [
    {text: 'testimonial1Text', author: 'testimonial1Author', location: 'testimonial1Location'},
    {text: 'testimonial2Text', author: 'testimonial2Author', location: 'testimonial2Location'}
  ];

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('testimonialsTitle')}
          </h2>
        </div>
        <div className="mx-auto mt-16 flow-root sm:mt-20">
          <div className="-m-4">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {testimonials.map((testimonial) => (
                <div
                  key={t(testimonial.author)}
                  className="break-inside-avoid rounded-lg border border-gray-200 bg-white p-8"
                >
                  <div className="flex items-center gap-x-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className="h-5 w-5 flex-none text-yellow-400"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-6 text-base leading-7 text-gray-600">
                    "{t(testimonial.text)}"
                  </p>
                  <div className="mt-6">
                    <div className="font-semibold text-gray-900">
                      {t(testimonial.author)}
                    </div>
                    <div className="text-gray-600">{t(testimonial.location)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}