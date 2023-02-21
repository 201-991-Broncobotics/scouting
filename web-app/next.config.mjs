// @ts-check
import withPWA from 'next-pwa'

const config = withPWA({
  dest: 'public',
})({
  reactStrictMode: true,
  transpilePackages: ['ui'],
})

export default config
