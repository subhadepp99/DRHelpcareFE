/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
let remotePatterns = [];
try {
  if (apiUrl) {
    const url = new URL(apiUrl);
    remotePatterns.push({
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: "/**",
    });
  }
} catch {}

const nextConfig = {
  images: {
    domains: [],
    remotePatterns,
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
