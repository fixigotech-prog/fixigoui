import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'localhost', port: '3001' },
      { protocol: 'http', hostname: 'localhost', port: '3001' },
      { protocol: 'http', hostname: 'localhost', port: '3000' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'cdn-icons-png.flaticon.com' },
      { protocol: 'https', hostname: 'img.icons8.com' },
      { protocol: 'https', hostname: 'static.vecteezy.com' },
      { protocol: 'https', hostname: 'img.freepik.com' },
      { protocol: 'https', hostname: 'fixigoui.onrender.com' },
      {protocol: 'https', hostname: 'cloudnary.com'}
    ]
  }
};

export default withNextIntl(nextConfig);
