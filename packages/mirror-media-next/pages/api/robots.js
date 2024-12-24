import { ENV } from '../../config/index.mjs'

export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain')

  if (ENV === 'prod') {
    res.write(`
      User-agent: *
      Allow: /
    `)
  } else {
    /** @see https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers#google-cloudvertexbot */
    res.write(`
      User-agent: Google-CloudVertexBot
      Allow: *
      
      User-agent: *
      Disallow: /
    `)
  }

  res.end()
}
