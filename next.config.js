/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      '@prisma/client',
      'bcryptjs',
      '@anthropic-ai/sdk',
      '@google/generative-ai',
      'openai',
    ],
  },
}

module.exports = nextConfig
