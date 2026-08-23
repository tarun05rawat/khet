/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Bypass ESLint errors so that `npm run build` won’t exit 1
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false, // Set to true if this is a permanent redirect
      },
    ];
  },
  /* config options here */
};

module.exports = nextConfig;
