/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.renttoolspeed.ru' },
    ],
    formats: ['image/avif','image/webp'],
  },
}

export default nextConfig
