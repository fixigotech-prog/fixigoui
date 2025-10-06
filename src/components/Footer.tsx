'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { FaPinterest, FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const Footer = () => {
  const t = useTranslations('Footer');
  const [showCitiesModal, setShowCitiesModal] = useState(false);
  const [allCities, setAllCities] = useState([]);

  const displayCities = [
    { key: 'bangalore', name: t('cities.bangalore') },
    { key: 'pune', name: t('cities.pune') },
    { key: 'delhi', name: t('cities.delhi') },
    { key: 'hyderabad', name: t('cities.hyderabad') },
  ];

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/api/cities');
        const data = await response.json();
        setAllCities(data.cities || []);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, []);

  const socialLinks = [
    { href: 'https://pinterest.com', icon: <FaPinterest />, 'aria-label': t('pinterest') },
    { href: 'https://instagram.com', icon: <FaInstagram />, 'aria-label': t('instagram') },
    { href: 'https://twitter.com', icon: <FaTwitter />, 'aria-label': t('twitter') },
    { href: 'https://facebook.com', icon: <FaFacebookF />, 'aria-label': t('facebook') },
  ];

  return (
    <footer className="bg-[#f8f9fa] text-gray-600 py-12">
     <div className="flex flex-row items-center justify-center">
      
     </div>
     <div>
       <div className="flex flex-row mx-auto px-4">
        <div className=' flex items-center pr-4'>
          <Image src="/images/logo2.svg" width="200" height="50" alt="" />
        </div>
        <div className="grid grid-cols-1 ml-16 md:grid-cols-5 gap-8">
          <div>
            <h3 className="font-bold text-lg text-black mb-4">{t('company')}</h3>
            <ul>
              <li className="mb-2"><Link href="/about" className="hover:text-black">{t('about')}</Link></li>
              <li className="mb-2"><Link href="/careers" className="hover:text-black">{t('careers')}</Link></li>
              <li className="mb-2"><Link href="/blog" className="hover:text-black">{t('blog')}</Link></li>
              <li className="mb-2"><Link href="/plus" className="hover:text-black">{t('fixigoPlus')}</Link></li>
              <li className="mb-2"><Link href="/expert" className="hover:text-black">{t('fixigoExpert')}</Link></li>
              <li className="mb-2"><Link href="/genie" className="hover:text-black">{t('fixigoGenie')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-black mb-4">{t('contactUs')}</h3>
            <ul>
              <li className="mb-2"><Link href="/help" className="hover:text-black">{t('help')}</Link></li>
              <li className="mb-2"><Link href="/partner" className="hover:text-black">{t('partner')}</Link></li>
              <li className="mb-2"><Link href="/ride" className="hover:text-black">{t('ride')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-black mb-4">{t('legal')}</h3>
            <ul>
              <li className="mb-2"><Link href="/terms" className="hover:text-black">{t('terms')}</Link></li>
              <li className="mb-2"><Link href="/terms-of-use" className="hover:text-black">Terms of Use</Link></li>
              <li className="mb-2"><Link href="/privacy-policy" className="hover:text-black">{t('privacyPolicy')}</Link></li>
              <li className="mb-2"><Link href="/cookies" className="hover:text-black">{t('cookiePolicy')}</Link></li>
              <li className="mb-2"><Link href="/refund-policy" className="hover:text-black">Refund Policy</Link></li>
              <li className="mb-2"><Link href="/cancellation-policy" className="hover:text-black">Cancellation Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-black mb-4">{t('deliverTo')}</h3>
            <div className="flex flex-col space-y-2">
              {displayCities.map((city) => (
                <Link key={city.key} href={`/in/${city.key}`} className="hover:text-black">
                  {city.name}
                </Link>
              ))}
              <button 
                onClick={() => setShowCitiesModal(true)}
                className="text-blue-600 hover:text-blue-800 text-left"
              >
                More
              </button>
            </div>
          </div>
          <div className="flex flex-col space-x-6 text-gray-600">
             <h3 className="font-bold text-lg text-black mb-4">{t('socialLinks')}</h3>
             <div className="flex flex-row space-x-4">
               {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link['aria-label']}
                className="text-2xl hover:text-black"
              >
                {link.icon}
              </a>
            ))}
             </div>
          </div>
        </div>

       
      </div>
     </div>
      <div className="flex flex-col items-center justify-center border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="font-extrabold text-lg text-center">
              For Better experience , download the Fixigo app now
            </div>
            <Link href="https://play.google.com" target="_blank" rel="noopener noreferrer">
              <img src="/images/google-play.png" alt="Google Play" className="h-12" />
            </Link>
            <Link href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
              <img src="/images/app-store.png" alt="App Store" className="h-12" />
            </Link>
          </div>

          
        </div>

        <div className="text-center mt-8 pt-8 border-t border-gray-800">
          <p>{t('copyright')}</p>
        </div>

        {/* Cities Modal */}
        {showCitiesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">All Cities</h3>
                <button 
                  onClick={() => setShowCitiesModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {allCities.map((city) => (
                  <Link 
                    key={city.id} 
                    href={`/in/${city.name.toLowerCase()}`} 
                    className="p-2 hover:bg-gray-100 rounded text-gray-700 hover:text-black"
                    onClick={() => setShowCitiesModal(false)}
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
    </footer>
  );
};

export default Footer;
