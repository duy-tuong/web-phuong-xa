import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dich-vu-cong/:path*",
        destination: "/dich-vu/:path*",
        permanent: true,
      },
      {
        source: "/dich-vu-hc/:path*",
        destination: "/dich-vu/:path*",
        permanent: true,
      },
      {
        source: "/dich-vu-cong",
        destination: "/dich-vu",
        permanent: true,
      },
      {
        source: "/dich-vu-hc",
        destination: "/dich-vu",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
