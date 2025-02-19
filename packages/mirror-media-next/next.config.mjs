import {
  DONATION_PAGE_URL,
  SITE_BASE_PATH,
  FIREBASE_AUTH_DOMAIN,
} from './config/index.mjs'
import withPWA from 'next-pwa'

/** @type {import('next-pwa').PWAConfig} */
const pwaConfig = {
  dest: 'public',
  customWorkerDir: 'service-worker',
  mode: 'production',
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: SITE_BASE_PATH,
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
      // /search/v3 is deprecated, but set redirect rule for backward compatibility
      {
        source: '/search/v3/:searchTerms*',
        destination: `/search/:searchTerms*`,
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
      {
        source: '/story/:slug*/index.html',
        destination: '/story/:slug*',
      },
      /**
       * deal with 3rd party login issue
       * @see https://firebase.google.com/docs/auth/web/redirect-best-practices
       */
      {
        source: '/__/auth/:path*',
        destination: `https://${FIREBASE_AUTH_DOMAIN}/__/auth/:path*`,
      },
    ]
  },

  output: 'standalone',
}

export default withPWA(pwaConfig)(nextConfig)
