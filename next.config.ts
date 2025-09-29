import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();


/**@type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
  output: "export",  // Uncomment the following line only for building purposes. By default, this line should remain commented out.
  trailingSlash: true,
  reactStrictMode: false,
  allowedDevOrigins: ["http://localhost:3000","http://localhost:3001"],
  // swcMinify: true,
  basePath: isProd ? "" : undefined,
  assetPrefix: isProd ? "" : undefined,
  images: {
    loader: "imgix",
    path: "/",
      remotePatterns: [
      new URL('https://localhost:3001/public'),
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '172.30.48.1',
        port: '3001', // Your API is on port 3001
        pathname: '/public/images/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
 
   // Disable Strict Mode if necessary
};

module.exports = nextConfig
