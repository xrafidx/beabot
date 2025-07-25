/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/api/:path*`, // Proxy ke backend
      },
    ];
  },
};

module.exports = nextConfig;
