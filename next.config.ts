import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fzywtckjgmqlxvrshign.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "streetviewpixels-pa.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "st2.depositphotos.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.microlink.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.wikia.nocookie.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;