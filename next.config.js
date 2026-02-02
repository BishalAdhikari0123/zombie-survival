/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Suppress hydration warnings for client-side only code
    missingSuspenseWithCSRBailout: true,
  },
}

module.exports = nextConfig
