import type { NextConfig } from 'next'
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'

setupDevPlatform()

const nextConfig: NextConfig = {
  /* config options here */
}

export default nextConfig
