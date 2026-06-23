/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow Unsplash images via next/image (optional — plain <img> tags also work)
    domains: ["images.unsplash.com"],
  },
};

module.exports = nextConfig;
