import fs from 'fs/promises'
import path from 'path'
import axiosInstance from '../../axios/index.js'

/**
 * Map a HTTPS static URL to a local path under GCS FUSE mount.
 * Requires env:
 * - GCS_FUSE_MOUNT_DIR: e.g. /mnt/statics
 * - GCS_FUSE_STATIC_BUCKET: e.g. v3-statics.mirrormedia.mg
 *
 * Supported URL forms:
 * - https://{bucket}/files/json/...
 * - https://storage.googleapis.com/{bucket}/files/json/...
 * - https://{cdn-hostname}/files/json/... (CDN)
 *
 * @param {string} requestUrl
 * @returns {string | null}
 */
function mapUrlToLocalPath(requestUrl) {
  try {
    const mountDir = process.env.GCS_FUSE_MOUNT_DIR
    const bucket = process.env.GCS_FUSE_STATIC_BUCKET
    if (!mountDir || !bucket) {
      return null
    }

    const u = new URL(requestUrl)
    const pathname = u.pathname
    let localPath = null

    // Handle storage.googleapis.com format: /{bucket}/files/json/...
    if (u.hostname === 'storage.googleapis.com') {
      const parts = pathname.split('/').filter(Boolean)
      if (parts[0] !== bucket) {
        return null
      }
      const rest = parts.slice(1).join('/')
      localPath = path.join(mountDir, rest)
    } else {
      // Handle direct bucket domain or CDN: extract pathname directly
      // Pathname should be like /files/json/... or /json/latest/...
      // Remove leading '/' and map to mount directory
      const rest = pathname.replace(/^\/+/, '')
      if (!rest) {
        return null
      }
      localPath = path.join(mountDir, rest)
    }

    return localPath
  } catch (err) {
    return null
  }
}

/**
 * Fetch JSON from local GCS FUSE mount first, fallback to HTTP GET via axios.
 * Returns an axios-like response shape: { data: any }
 * Client-side will always fallback to HTTP.
 *
 * @param {string} requestUrl
 * @param {number} [timeoutMs]
 * @returns {Promise<{ data: any }>}
 */
export async function fetchStaticJson(requestUrl, timeoutMs) {
  const startTime = performance.now()
  // Only try local file on server
  if (typeof window === 'undefined') {
    const localPath = mapUrlToLocalPath(requestUrl)
    if (localPath) {
      try {
        const readStartTime = performance.now()
        const content = await fs.readFile(localPath, 'utf8')
        const parseStartTime = performance.now()
        const data = JSON.parse(content)
        const parseEndTime = performance.now()
        
        const readLatency = (parseEndTime - readStartTime).toFixed(2)
        const totalLatency = (parseEndTime - startTime).toFixed(2)
        
        console.log(
          JSON.stringify({
            severity: 'INFO',
            message: '[fetchStaticJson] GCS mount hit',
            url: requestUrl,
            localPath: localPath,
            readLatency: `${readLatency}ms`,
            totalLatency: `${totalLatency}ms`,
            source: 'local',
          })
        )
        
        return { data }
      } catch (err) {
        const readLatency = (performance.now() - startTime).toFixed(2)
        console.warn(
          JSON.stringify({
            severity: 'WARNING',
            message: '[fetchStaticJson] GCS mount miss, fallback to HTTP',
            url: requestUrl,
            localPath: localPath,
            readLatency: `${readLatency}ms`,
            error: err?.message ?? String(err),
          })
        )
        // fall through to HTTP
      }
    } else {
      console.log(
        JSON.stringify({
          severity: 'INFO',
          message: '[fetchStaticJson] No local path mapped, using HTTP',
          url: requestUrl,
        })
      )
    }
  }
  
  const httpStartTime = performance.now()
  const res = await axiosInstance({
    method: 'get',
    url: requestUrl,
    timeout: timeoutMs,
  })
  const httpEndTime = performance.now()
  const httpLatency = (httpEndTime - httpStartTime).toFixed(2)
  const totalLatency = (httpEndTime - startTime).toFixed(2)
  
  console.log(
    JSON.stringify({
      severity: 'INFO',
      message: '[fetchStaticJson] HTTP fetch',
      url: requestUrl,
      httpLatency: `${httpLatency}ms`,
      totalLatency: `${totalLatency}ms`,
      source: 'http',
    })
  )
  
  return { data: res?.data }
}
