/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    domains: [
      "oaidalleapiprodscus.blob.core.windows.net",
      "lh3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;
