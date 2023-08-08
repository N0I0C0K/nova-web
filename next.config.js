/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    instrumentationHook: true,
    swcPlugins: [
      ["next-superjson-plugin", {}]
    ],
    esmExternals:true,
  }
}

module.exports = nextConfig
