const express = require('express')
const {
  createProxyMiddleware,
  responseInterceptor,
} = require('http-proxy-middleware')

// Create Express Server
const app = express()

// Configuration
const PORXY_SERVER_PORT = Number(process.env.PROXY_SERVER_PORT) || 3000
const PROXIED_SERVER_PORT = Number(process.env.PROXIED_SERVER_PORT) || 3001
const HOST = 'localhost'
const API_SERVICE_URL = `http://localhost:${PROXIED_SERVER_PORT}`
// const jsdom = require('jsdom')
// const { JSDOM } = jsdom

// handle amp route
app.use(
  '/story/amp',
  createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (responseBuffer) => {
      const response = responseBuffer.toString('utf8') // convert buffer to string
      return response.replace(
        /contenteditable|spellcheck/g,
        (match) => `data-${match}`
      )

      // const dom = new JSDOM(responseRemoveAmpProhibitAttributes)
      // const doc = dom.window.document
      // const styleTags = doc.querySelectorAll('body style')
      // const scriptTags = doc.querySelectorAll('body script')

      // if (styleTags.length || scriptTags.length) {
      //   let head = doc.querySelector('head')
      //   if (!head) {
      //     head = doc.createElement('head')
      //     doc.documentElement.insertBefore(head, doc.body)
      //   }

      //   // 找到 <head> 標籤
      //   styleTags?.forEach((styleTag) => {
      //     head.appendChild(styleTag)
      //     styleTag.remove()
      //   })
      //   scriptTags?.forEach((scriptTag) => {
      //     scriptTag.remove()
      //     head.appendChild(scriptTag)
      //   })
      // }

      // const updatedResponse = dom.serialize()

      // // manipulate html to remove all amp prohibit attributes
      // return Buffer.from(updatedResponse, 'utf8')
    }),
  })
)

// proxy all other routes in case any other request misleading to this proxy
app.use(
  '*',
  createProxyMiddleware({ target: API_SERVICE_URL, changeOrigin: true })
)

// Start Proxy
app.listen(PORXY_SERVER_PORT, () => {
  console.log(`Starting Proxy at ${HOST}:${PORXY_SERVER_PORT}`)
})
