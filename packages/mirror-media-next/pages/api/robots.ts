import type { NextApiRequest, NextApiResponse } from 'next'

import { ENV } from '../../config/index.mjs'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'text/plain')

  if (ENV === 'prod') {
    res.write(`User-agent: Googlebot
      Disallow: /login
      Disallow: /subscribe/*
      Disallow: /search/*

      User-agent: facebookexternalhit
        Allow: /

      User-agent: Facebot
        Allow: /

      User-agent: Meta-ExternalAgent
        Allow: /
      
      User-agent: *
        Allow: /
      
      Sitemap: https://www.mirrormedia.mg/rss/posts.xml
      Sitemap: https://www.mirrormedia.mg/rss/posts-news.xml
      Sitemap: https://www.mirrormedia.mg/rss/externals.xml
      Sitemap: https://www.mirrormedia.mg/rss/externals-news.xml`)
  } else {
    res.write(`User-agent: *
     Disallow: /`)
  }

  res.end()
}
