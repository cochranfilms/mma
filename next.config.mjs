/** @type {import('next').NextConfig} */
const nextConfig = {
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
