'use client';

import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function FAQSection() {
  const t = useTranslations('IndexPage');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {question: 'faq1Question', answer: 'faq1Answer'},
    {question: 'faq2Question', answer: 'faq2Answer'},
    {question: 'faq3Question', answer: 'faq3Answer'},
    {question: 'faq4Question', answer: 'faq4Answer'}
  ];

  const FaqItem = ({q, a, idx}: {q: string; a: string; idx: number}) => (
    <div className="border-b py-4">
      <button
        type="button"
        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-medium">{q}</span>
        <ChevronRightIcon
          className={`h-5 w-5 transform transition-transform ${
            openFaq === idx ? 'rotate-90' : ''
          }`}
        />
      </button>
      {openFaq === idx && <p className="mt-2 text-gray-600">{a}</p>}
    </div>
  );

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('faqTitle')}
          </h2>
          <div className="mt-12">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                q={t(faq.question)}
                a={t(faq.answer)}
                idx={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}