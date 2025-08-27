import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        has: [
          {
            type: "header",
            key: "host",
            value: "(^|\.)marketingmousetrapagency\.com$",
          },
        ],
        destination: "/index.html",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
