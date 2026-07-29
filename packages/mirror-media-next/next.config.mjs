import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  DONATION_PAGE_URL,
  FIREBASE_AUTH_DOMAIN,
  SITE_BASE_PATH,
} from './config/index.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Architecture guardrail: keep Next.js 15 while the built-in AMP
// routes remain. Before upgrading to Next.js 16, decide the long-term AMP path
// and revalidate the custom webpack loaders against Turbopack.

const withBundleAnalyzer =
  process.env.ANALYZE === 'true' && process.env.NEXT_PUBLIC_ENV !== 'prod'
    ? (await import('@next/bundle-analyzer')).default({
        enabled: true,
      })
    : (config) => config

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: SITE_BASE_PATH,
  reactStrictMode: true,
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
      // {
      //   source: '/search/v3/:searchTerms*',
      //   destination: `/search/:searchTerms*`,
      //   permanent: true,
      // },
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
  // Next.js 15 treats outputFileTracingRoot as a top-level option.
  // Revalidate the standalone output layout and both Docker runtimes after any
  // future framework upgrade.
  outputFileTracingRoot: path.join(__dirname, '../..'),
}

export default withBundleAnalyzer(nextConfig)
