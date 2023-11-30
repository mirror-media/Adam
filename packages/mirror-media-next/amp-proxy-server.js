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
    onProxyRes: responseInterceptor(async (responseBuffer, req, res) => {
      const response = responseBuffer.toString('utf8') // convert buffer to string
      const originStoryUrl = res.url?.replace('/story/amp/', '/story/')
      return response
        .replace(/<amp-video controls="true"/g, '<amp-video controls')
        .replace(/contenteditable|spellcheck/g, (match) => `data-${match}`)
        .replace(
          /<a class="link-to-story"/g,
          (match) => `${match} href=${originStoryUrl} target="_blank"`
        )
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
