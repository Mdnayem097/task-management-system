/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination:
          "https://task-management-system-server-iota.vercel.app/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
