'use client';

import {
  AcademicCapIcon,
  ArrowUpOnSquareIcon,
  BoltIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  ClockIcon,
  Cog6ToothIcon,
  CurrencyRupeeIcon,
  DevicePhoneMobileIcon,
  HomeModernIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  UserGroupIcon,
  WrenchIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import {ArrowDownTrayIcon} from '@heroicons/react/16/solid';

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

const homeServices = [
  {
    category: 'serviceCategoryAC',
    items: [
      {name: 'serviceACRepair', icon: Cog6ToothIcon},
      {name: 'serviceApplianceRepair', icon: WrenchIcon}
    ]
  },
  {
    category: 'serviceCategoryCleaning',
    items: [
      {name: 'serviceBathroomCleaning', icon: HomeModernIcon},
      {name: 'serviceDeepCleaning', icon: HomeModernIcon},
      {name: 'serviceSofaCleaning', icon: SparklesIcon},
      {name: 'serviceKitchenCleaning', icon: HomeModernIcon},
      {name: 'servicePestControl', icon: BoltIcon}
    ]
  },
  {
    category: 'serviceCategoryHomeRepairs',
    items: [
      {name: 'serviceElectrician', icon: BoltIcon},
      {name: 'servicePlumbing', icon: WrenchIcon},
      {name: 'serviceCarpenter', icon: WrenchIcon},
      {name: 'servicePainting', icon: PaintBrushIcon},
      {name: 'serviceHandyman', icon: AcademicCapIcon}
    ]
  }
];

const howItWorks = [
  {name: 'step1Title', description: 'step1Desc', icon: CalendarDaysIcon},
  {name: 'step2Title', description: 'step2Desc', icon: DevicePhoneMobileIcon},
  {name: 'step3Title', description: 'step3Desc', icon: UserGroupIcon},
  {name: 'step4Title', description: 'step4Desc', icon: StarIcon}
];

const testimonials = [
  {text: 'testimonial1Text', author: 'testimonial1Author', location: 'testimonial1Location'},
  {text: 'testimonial2Text', author: 'testimonial2Author', location: 'testimonial2Location'}
];

const faqs = [
  {question: 'faq1Question', answer: 'faq1Answer'},
  {question: 'faq2Question', answer: 'faq2Answer'},
  {question: 'faq3Question', answer: 'faq3Answer'},
  {question: 'faq4Question', answer: 'faq4Answer'}
];

export default function IndexPage() {
  const t = useTranslations('IndexPage');
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<
    'phone' | 'otp' | 'forgot-password'
  >('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [timer, setTimer] = useState(30);
 console.log(process.env.NEXT_PUBLIC_URL)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (modalStep === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [modalStep, timer]);

  const handleContinue = () => {
    if (phoneNumber.length === 10) {
      setModalStep('otp');
      setTimer(30);
    }
  };

  const handleResend = () => {
    setTimer(30);
    // Add logic to resend OTP
  };

  const handleVerify = () => {
    // In a real app, you would verify the OTP with your backend.
    // If successful:
    router.push('/customers/dashboard');
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalStep('phone');
    setPhoneNumber('');
  };

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
    <div className="bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <div className="flex items-center gap-8">
            <a href="#" className="text-2xl font-bold text-gray-900">
              Fixigo
            </a>
            <nav className="hidden gap-6 md:flex">
              <a
                href="#"
                className="text-sm font-semibold text-gray-600 hover:text-gray-900"
              >
                {t('serviceACRepair')}
              </a>
              <a
                href="#"
                className="text-sm font-semibold text-gray-600 hover:text-gray-900"
              >
                {t('serviceApplianceRepair')}
              </a> 
              <a
                href="#"
                className="text-sm font-semibold text-gray-600 hover:text-gray-900"
              >
                {t('serviceCleaning')}
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-md bg-[#00A2B5] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#008C9E]"
            >
              {t('loginSignup')}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="relative isolate bg-gradient-to-r from-cyan-500 to-blue-500">
          <div className="overflow-hidden pt-14">
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-10 sm:pt-24 lg:px-8 lg:pt-16">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    {t('title')}
                  </h1>
                  <p className="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                    {t('subtitle')}
                  </p>
                </div>
                <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        alt={t('card1Alt')}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        alt={t('card2Alt')}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1559087867-ce4c91325525?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        alt={t('card3Alt')}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1670272504528-790c24957dda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1670272505284-8faba1c31f7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Benefits Section */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-cyan-600">
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
                      className="h-5 w-5 flex-none text-cyan-600"
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

      {/* How It Works Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-cyan-600">
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
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600 text-white">
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

      {/* Our Services Section */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('servicesTitle')}
            </h2>
          </div>
          <div className="mt-16 space-y-16">
            {homeServices.map((category) => (
              <div key={t(category.category)}>
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                  {t(category.category)}
                </h3>
                <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
                  {category.items.map((service) => (
                    <div
                      key={t(service.name)}
                      className="flex flex-col items-center gap-y-3 text-center"
                    >
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100">
                        <service.icon className="h-10 w-10 text-gray-700" />
                      </div>
                      <p className="font-medium text-gray-800">{t(service.name)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login/Signup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-sm rounded-lg bg-white p-8 shadow-xl">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {modalStep === 'phone' && (
              <div>
                <h3 className="text-xl font-bold">{t('loginPopupTitle')}</h3>
                <div className="mt-4">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t('phoneInputLabel')}
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">+91</span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="block w-full rounded-md border-gray-300 p-3 pl-12 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="9876543210"
                      maxLength={10}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={phoneNumber.length !== 10}
                  className="mt-6 w-full rounded-md bg-[#00A2B5] p-3 font-semibold text-white shadow-sm hover:bg-[#008C9E] disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {t('continueButton')}
                </button>
                <div className="mt-4 text-center text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setModalStep('forgot-password');
                      setPhoneNumber('');
                    }}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    {t('forgotPasswordLink')}
                  </button>
                </div>
              </div>
            )}

            {modalStep === 'forgot-password' && (
              <div>
                <h3 className="text-xl font-bold">
                  {t('forgotPasswordTitle')}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {t('forgotPasswordSubtitle')}
                </p>
                <div className="mt-4">
                  {/* Phone input from login, could be componentized */}
                  <label
                    htmlFor="reset-phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t('phoneInputLabel')}
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">+91</span>
                    </div>
                    <input
                      type="tel"
                      name="reset-phone"
                      id="reset-phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="block w-full rounded-md border-gray-300 p-3 pl-12 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="9876543210"
                      maxLength={10}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={phoneNumber.length !== 10}
                  className="mt-6 w-full rounded-md bg-[#00A2B5] p-3 font-semibold text-white shadow-sm hover:bg-[#008C9E] disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {t('sendOtpButton')}
                </button>
                <p className="mt-4 text-center text-sm text-gray-600">
                  <button
                    type="button"
                    onClick={() => setModalStep('phone')}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    {t('backToLoginLink')}
                  </button>
                </p>
              </div>
            )}

            {modalStep === 'otp' && (
              <div>
                <h3 className="text-xl font-bold">{t('otpTitle')}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {t('otpSubtitle', {phoneNumber})}
                </p>
                <div className="mt-4">
                  {/* OTP input would go here */}
                  <input
                    type="text"
                    maxLength={6}
                    className="w-full rounded-md border-gray-300 p-3 text-center tracking-[.5em] shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerify}
                  className="mt-6 w-full rounded-md bg-[#00A2B5] p-3 font-semibold text-white shadow-sm hover:bg-[#008C9E]"
                >
                  {t('verifyButton')}
                </button>
                <div className="mt-4 text-center text-sm text-gray-600">
                  {t('didNotReceive')}{' '}
                  {timer > 0 ? (
                    <span className="text-gray-500">
                      {t('resendTimer', {seconds: timer})}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      {t('resendLink')}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Testimonials Section */}
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
                      “{t(testimonial.text)}”
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

      {/* FAQ Section */}
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

      {/* Download App Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center gap-16 rounded-2xl bg-cyan-600 p-12 text-center lg:flex-row lg:gap-x-20 lg:text-left">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                {t('downloadAppTitle')}
              </h2>
              <p className="mt-4 text-lg text-cyan-100">
                {t('downloadAppSubtitle')}
              </p>
            </div>
            <div className="flex gap-x-4">
              <a
                href="#"
                className="flex items-center gap-x-2.5 rounded-md bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-gray-100"
              >
                <ArrowUpOnSquareIcon className="h-5 w-5" />
                {t('appStore')}
              </a>
              <a
                href="#"
                className="flex items-center gap-x-2.5 rounded-md bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-gray-100"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                {t('googlePlay')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
