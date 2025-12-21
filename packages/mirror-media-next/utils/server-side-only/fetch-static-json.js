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
 *
 * @param {string} requestUrl
 * @returns {string | null}
 */
function mapUrlToLocalPath(requestUrl) {
  try {
    const mountDir = process.env.GCS_FUSE_MOUNT_DIR
    const bucket = process.env.GCS_FUSE_STATIC_BUCKET
    if (!mountDir || !bucket) return null

    const u = new URL(requestUrl)
    if (u.hostname === 'storage.googleapis.com') {
      // expect pathname starts with /{bucket}/...
      const parts = u.pathname.split('/').filter(Boolean)
      if (parts[0] !== bucket) return null
      const rest = parts.slice(1).join('/')
      return path.join(mountDir, rest)
    }
    // direct bucket domain
    if (u.hostname === bucket) {
      // remove leading '/'
      const rest = u.pathname.replace(/^\/+/, '')
      return path.join(mountDir, rest)
    }
    return null
  } catch {
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
  // Only try local file on server
  if (typeof window === 'undefined') {
    const localPath = mapUrlToLocalPath(requestUrl)
    if (localPath) {
      try {
        const content = await fs.readFile(localPath, 'utf8')
        const data = JSON.parse(content)
        return { data }
      } catch {
        // fall through to HTTP
      }
    }
  }
  const res = await axiosInstance({
    method: 'get',
    url: requestUrl,
    timeout: timeoutMs,
  })
  return { data: res?.data }
}
