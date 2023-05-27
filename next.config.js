/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/mandalaconfluence',
  rewrites: async () => [
    {
      source: "/public/dataFrom.html",
      destination: "/pages/api/dataFrom.js"
    },
  ],
}

module.exports = nextConfig
