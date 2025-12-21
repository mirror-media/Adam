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
      console.log(
        '[mapUrlToLocalPath] Missing env vars',
        'GCS_FUSE_MOUNT_DIR:',
        mountDir || 'undefined',
        'GCS_FUSE_STATIC_BUCKET:',
        bucket || 'undefined'
      )
      return null
    }

    const u = new URL(requestUrl)
    const pathname = u.pathname
    let localPath = null

    // Handle storage.googleapis.com format: /{bucket}/files/json/...
    if (u.hostname === 'storage.googleapis.com') {
      const parts = pathname.split('/').filter(Boolean)
      if (parts[0] !== bucket) {
        console.log(
          '[mapUrlToLocalPath] Bucket mismatch',
          'expected:',
          bucket,
          'got:',
          parts[0],
          'from URL:',
          requestUrl
        )
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
        console.log(
          '[mapUrlToLocalPath] Empty pathname after processing',
          'from URL:',
          requestUrl
        )
        return null
      }
      localPath = path.join(mountDir, rest)
    }

    console.log(
      '[mapUrlToLocalPath] Mapped',
      'URL:',
      requestUrl,
      '->',
      'localPath:',
      localPath
    )
    return localPath
  } catch (err) {
    console.warn('[mapUrlToLocalPath] Error mapping URL:', requestUrl, err)
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
          '[fetchStaticJson] GCS mount hit',
          'URL:',
          requestUrl,
          'localPath:',
          localPath,
          'latency:',
          `${readLatency}ms`,
          `(total: ${totalLatency}ms)`
        )
        return { data }
      } catch (err) {
        const readLatency = (performance.now() - startTime).toFixed(2)
        console.warn(
          '[fetchStaticJson] GCS mount miss, fallback to HTTP',
          'URL:',
          requestUrl,
          'mapped localPath:',
          localPath,
          'readLatency:',
          `${readLatency}ms`,
          'error:',
          err?.message ?? err
        )
        // fall through to HTTP
      }
    } else {
      console.log(
        '[fetchStaticJson] No local path mapped, using HTTP',
        'URL:',
        requestUrl
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
    '[fetchStaticJson] HTTP fetch',
    'URL:',
    requestUrl,
    'latency:',
    `${httpLatency}ms`,
    `(total: ${totalLatency}ms)`
  )
  return { data: res?.data }
}
