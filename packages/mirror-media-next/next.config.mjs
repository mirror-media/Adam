import { DONATION_PAGE_URL, IS_PREVIEW_MODE } from './config/index.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add assetPrefix to prevent /_next route collision between CMS and preview server
  assetPrefix: IS_PREVIEW_MODE ? '/preview-server' : undefined,
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: {
      displayName: true,
      ssr: true,
    },
  },
  images: {
    // https://nextjs.org/docs/api-reference/next/image#remote-patterns
    remotePatterns: [
      {
        hostname: '*', //Temporary setting, should assign to specif hostname when our domain is decided
      },
    ],
  },
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'graphql-tag/loader',
          },
        ],
      }
    )

    return config
  },
  async redirects() {
    return [
      // currently, donation page will redirect user to external page
      {
        source: '/donate',
        destination: DONATION_PAGE_URL,
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ]
  },

  output: 'standalone',
}

export default nextConfig
