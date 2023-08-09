// import { ENV } from '../../config/index.mjs'
//Temporarily disallowed in all environment
export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write(`User-agent: * 
  Disallow: /`)

  //   if (ENV === 'prod') {
  //     res.write(`User-agent: *
  // Allow: / `)
  //   } else {
  //     res.write(`User-agent: *
  // Disallow: /`)
  //   }
  res.end()
}
