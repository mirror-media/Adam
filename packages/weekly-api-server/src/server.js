import http from 'http'
import { createApp } from './app'
import envVar from './environment-variables'

const port = process.env.PORT || '8080'

async function start() {
  let server
  try {
    const app = createApp({
      gcpProjectId: envVar.gcp.projectId,
      firebaseProjectId: envVar.firebase.projectId,
      jwtSecret: envVar.jwt.secret,
      israfelProxyOrigin: envVar.apis.israfel.origin,
      weeklyProxyOrigin: envVar.apis.weekly.origin,
      gcsProxyOrigin: envVar.gcs.origin,
      corsAllowOrigin: envVar.cors.allowOrigins,
      youtubeProxyOrigin: envVar.youtube.origin,
    })
    server = http.createServer(app).listen(port, () => {
      console.log(
        JSON.stringify({
          severity: 'NOTICE',
          message: `server starts at port ${port}`,
        })
      )
    })
  } catch (err) {
    console.error(
      JSON.stringify({
        severity: 'ALERT',
        // All exceptions that include a stack trace will be
        // integrated with Error Reporting.
        // See https://cloud.google.com/run/docs/error-reporting
        message: err.stack
          ? `Error to start server: ${err.stack}`
          : new Error('Error to start server').stack,
      })
    )
  }

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received')
    if (server) {
      console.log('Close HTTP server')
      server.close(() => {
        console.log('HTTP server closed')
      })
    }
  })

  process.on('SIGINT', () => {
    console.log('SIGINT signal received')
    if (server) {
      console.log('Close HTTP server')
      server.close(() => {
        console.log('HTTP server closed')
      })
    }
  })
}

start()
