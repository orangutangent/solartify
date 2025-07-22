import type { NextConfig } from 'next'
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'

setupDevPlatform()

const nextConfig: NextConfig = {
  images: {
    domains: ['gateway.irys.xyz'],
  },
  output: 'standalone',
  /* config options here */
}

export default nextConfig
