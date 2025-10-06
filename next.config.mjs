import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com', 
      'localhost',
      'cdn-icons-png.flaticon.com',
      'img.icons8.com',
      'static.vecteezy.com',
      'img.freepik.com',
      'fixigoui.onrender.com'
    ],
    formats: ['image/webp', 'image/avif', 'image/jpeg', 'image/png', 'image/jfif']
  }
};

export default withNextIntl(nextConfig);
