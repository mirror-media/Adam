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
     Disallow: /subscribe/*`)
  }

  res.end()
}
