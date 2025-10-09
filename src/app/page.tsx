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
} from '@heroicons/react/24/solid';
import {useRouter} from 'next/navigation';
import {useTranslations, useLocale} from 'next-intl';
import {useEffect, useState} from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import Image from 'next/image';
import {ArrowDownTrayIcon} from '@heroicons/react/16/solid';
import Slider from 'react-slick';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Footer from '@/components/Footer';
import LocationModal from '@/components/LocationModal';
import Header from '@/components/Header';
import GoogleMap from '@/components/GoogleMap';
import HeroSection from '@/components/sections/HeroSection';
import OffersSection from '@/components/sections/OffersSection';
import ServicesSection from '@/components/sections/ServicesSection';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOffers } from '@/store/slices/offersSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import { fetchCities } from '@/store/slices/locationSlice';
import { fetchFrequentServices } from '@/store/slices/frequentServicesSlice';
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

const staticOffers=[
  {
    id: 1,
    imageUrl:"/images/offers/vip-22.png"
  },
  {
    id: 2,
    imageUrl:"/images/offers/Painting.png"
  },
  {
    id: 3,
    imageUrl:"/images/offers/Exterior-Cleanig.png"
  },
  {
    id: 4,
    imageUrl:"/images/offers/Cleaning-discount.png"
  },
]

const homeServices = [
  {
    category: 'serviceCategoryAC',
    items: [
      {name: 'serviceACRepair', icon: Cog6ToothIcon},
      {name: 'serviceApplianceRepair', icon: WrenchIcon}
    ],
  },
  {
    category: 'serviceCategoryCleaning',
    items: [
      {name: 'serviceBathroomCleaning', icon: SparklesIcon},
      {name: 'serviceDeepCleaning', icon: SparklesIcon},
      {name: 'serviceSofaCleaning', icon: SparklesIcon},
      {name: 'serviceKitchenCleaning', icon: SparklesIcon},
      {name: 'servicePestControl', icon: ShieldCheckIcon}
    ],
  },
  {
    category: 'serviceCategoryHomeRepairs',
    items: [
      {name: 'serviceElectrician', icon: BoltIcon},
      {name: 'servicePlumbing', icon: WrenchIcon},
      {name: 'serviceCarpenter', icon: WrenchIcon},
      {name: 'servicePainting', icon: PaintBrushIcon},
      {name: 'serviceHandyman', icon: WrenchIcon}
    ],
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

interface Promocode {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  serviceId: number;
  createdAt: string;
  updatedAt: string;
}

interface Offer {
  id: number;
  imageUrl: string;
  link: string;
  promocodeId: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  promocode: Promocode;
}

interface FrequentService {
  id: number;
  serviceId: number;
  serviceName: string;
  usageCount: number;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}



export default function IndexPage() {
  const t = useTranslations('IndexPage');
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [frequentServices, setFrequentServices] = useState<FrequentService[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<
    'phone' | 'otp' | 'forgot-password' | 'signup'
  >('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [timer, setTimer] = useState(30);
  const [signupData, setSignupData] = useState({
    fullName:'',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [domain, setDomain] = useState('');
 const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const dispatch = useAppDispatch();
  const { offers: reduxOffers, loading: offersLoading } = useAppSelector(state => state.offers);
  const { categories, loading: categoriesLoading } = useAppSelector(state => state.categories);
  const { cities, loading: citiesLoading } = useAppSelector(state => state.location);
  const { services: reduxFrequentServices, loading: frequentServicesLoading } = useAppSelector(state => state.frequentServices);

 useEffect(() => {
    setDomain(window.location.origin);
    
    // Always fetch data on page load
    dispatch(fetchOffers());
    dispatch(fetchCategories());
    dispatch(fetchCities());
    dispatch(fetchFrequentServices());
    
    // Show location modal on page load if location not already set
    const savedLocation = localStorage.getItem('userLocation');
    if (!savedLocation) {
      setTimeout(() => setIsLocationModalOpen(true), 1000);
    } else {
      setUserLocation(JSON.parse(savedLocation));
    }
  }, [dispatch]);
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

  const handleContinue = async () => {
    if (phoneNumber.length === 10) {
      try {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
          phone: phoneNumber
        });
        setModalStep('otp');
        setTimer(30);
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
      }
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
    setSignupData({ fullName:'', phone: '', email: '', password: '', confirmPassword: '' });
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setUserLocation(location);
    localStorage.setItem('userLocation', JSON.stringify(location));
  };

  const handleSignup = async () => {
    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        fullName: signupData.fullName,
        phone: signupData.phone,
        email: signupData.email,
        password: signupData.password
      });
      router.push('/customers/dashboard');
      closeModal();
    } catch (error) {
      console.error('Signup error:', error);
      alert('Registration failed. Please try again.');
    }
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <div className="bg-gray-50">
      <Header 
        onLoginClick={() => setIsModalOpen(true)}
        userLocation={userLocation}
        onLocationChange={handleLocationSelect}
      />

      <HeroSection frequentServices={reduxFrequentServices} />

      <OffersSection />
      
      {/* Frequently Used Services Section */}
      {reduxFrequentServices && reduxFrequentServices.length > 0 && (
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
              {reduxFrequentServices.slice(0, 8).map((service) => (
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
      )}

      {/* Our Services Section */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('servicesTitle')}
            </h2>
          </div>
          <div className="mt-16 space-y-20">
            {[
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
            ].map((category) => (
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
        {/* How It Works Section */}
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
      {/* Service Areas Map Section */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Service Areas
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We provide quality home services across major cities. Find us near you.
            </p>
          </div>
          <div className="mt-16">
            <GoogleMap 
              center={{ lat: 28.6139, lng: 77.2090 }}
              zoom={6}
              height="500px"
              markers={[
                { lat: 12.9716, lng: 77.5946, title: 'Bangalore' },
                { lat: 17.3850, lng: 78.4867, title: 'Hyderabad' }
              ]}
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
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

      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} onLocationSelect={handleLocationSelect} />

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
                <div className="mt-4 text-center text-sm space-y-2">
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setModalStep('forgot-password');
                        setPhoneNumber('');
                      }}
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div>
                    <span className="text-gray-500">Not yet registered? </span>
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Switching to signup');
                        setModalStep('signup');
                      }}
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Click here to register
                    </button>
                  </div>
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

            {modalStep === 'signup' && (
              <div>
                <h3 className="text-xl font-bold">Create Account</h3>
                <div className="mt-4 space-y-4">
                   <div>
                    <label className="block text-sm font-medium text-gray-700" >
                      Full Name
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      
                      <input
                        type="text"
                        value={signupData.fullName}
                        onChange={(e) => setSignupData({...signupData,fullName: e.target.value})}
                        className="block w-full rounded-md border-gray-500 p-3  focus:border-gray-700 focus:shadow-lg"
                        placeholder="type your name here"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">+91</span>
                      </div>
                      <input
                        type="tel"
                        value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                        className="block w-full rounded-md border-gray-300 p-3 pl-12 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="9876543210"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSignup}
                  disabled={!signupData.phone || !signupData.email || !signupData.password || !signupData.confirmPassword}
                  className="mt-6 w-full rounded-md bg-[#00A2B5] p-3 font-semibold text-white shadow-sm hover:bg-[#008C9E] disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  Create Account
                </button>
                <p className="mt-4 text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setModalStep('phone')}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign in
                  </button>
                </p>
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
      
<Footer />
      
    </div>
  );
}