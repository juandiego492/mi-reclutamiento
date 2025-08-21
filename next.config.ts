/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Esto ignora ESLint durante el build
  },
};

module.exports = nextConfig;