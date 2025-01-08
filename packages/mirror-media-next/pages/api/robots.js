import { ENV } from '../../config/index.mjs'

export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain')

  if (ENV === 'prod') {
    res.write(`User-agent: *
     Allow: / 
	 Disallow: /external/*`)
  } else {
    res.write(`User-agent: *
     Disallow: /`)
  }

  res.end()
}
