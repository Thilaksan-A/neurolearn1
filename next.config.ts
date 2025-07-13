import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/",
      destination: "/Login",
      permanent: true,
    },
  ],
};

export default nextConfig;
