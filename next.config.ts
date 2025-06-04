const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable in dev to avoid caching issues
});

module.exports = withPWA({
  // Your existing Next.js config
  reactStrictMode: true,
});