// @ts-check
import withPWA from 'next-pwa'

const config = withPWA({
  dest: 'public',
})({
  reactStrictMode: true,
  swcMinify: true,
})

export default config
