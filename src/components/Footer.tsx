'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { FaPinterest, FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';

const Footer = () => {
  const t = useTranslations('Footer');

  const cities = [
    'Bangalore',
    'Pune',
    'Mumbai',
    'Delhi',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Jaipur',
    'Ahmedabad',
    'Chandigarh',
  ];

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
              <li className="mb-2"><Link href="/instamart" className="hover:text-black">{t('fixigoInstamart')}</Link></li>
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
              <li className="mb-2"><Link href="/privacy" className="hover:text-black">{t('privacyPolicy')}</Link></li>
              <li className="mb-2"><Link href="/cookies" className="hover:text-black">{t('cookiePolicy')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-black mb-4">{t('deliverTo')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {cities.map((city) => (
                <Link key={city} href={`/in/${city.toLowerCase()}`} className="hover:text-black">
                  {city}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-x-6 text-gray-600">
             <h3 className="font-bold text-lg text-black mb-4">Social Links</h3>
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
    </footer>
  );
};

export default Footer;
