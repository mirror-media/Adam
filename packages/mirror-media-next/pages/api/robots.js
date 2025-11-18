import { ENV } from '../../config/index.mjs'

export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain')

  if (ENV === 'prod') {
    res.write(`User-agent: Googlebot
   Disallow: /login

	User-agent: *
     Allow: /`)
  } else {
    res.write(`User-agent: *
     Disallow: /
     Disallow: /subscribe/*

Sitemap: https://www.mirrormedia.mg/rss/posts.xml
Sitemap: https://www.mirrormedia.mg/rss/posts-news.xml
Sitemap: https://www.mirrormedia.mg/rss/externals.xml
Sitemap: https://www.mirrormedia.mg/rss/externals-news.xml`)
  }

  res.end()
}
