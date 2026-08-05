import fs from 'node:fs/promises'
import path from 'node:path'

import type { GetServerSideProps } from 'next'

import { ENV } from '../../config/index.mjs'

const STORYBOOK_ENABLED_ENVS = new Set(['local', 'dev', 'staging'])
const STORYBOOK_DIR_CANDIDATES = [
  path.join(process.cwd(), 'public', '_storybook'),
  path.join(
    process.cwd(),
    'packages',
    'mirror-media-next',
    'public',
    '_storybook'
  ),
]

const contentTypeByExtension = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
} satisfies Record<string, string>

const resolveStorybookFilePath = async (segments: string[] = []) => {
  const relativePath = segments.length === 0 ? ['index.html'] : segments

  for (const storybookDir of STORYBOOK_DIR_CANDIDATES) {
    const filePath = path.join(storybookDir, ...relativePath)
    const relativeToRoot = path.relative(storybookDir, filePath)

    if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) {
      return null
    }

    try {
      const stat = await fs.stat(filePath)
      if (stat.isFile()) {
        return filePath
      }
    } catch {
      continue
    }
  }

  return null
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}) => {
  if (!STORYBOOK_ENABLED_ENVS.has(ENV)) {
    return {
      notFound: true,
    }
  }

  const requestedPath = params?.path
  const segments = Array.isArray(requestedPath) ? requestedPath : []
  const filePath = await resolveStorybookFilePath(segments)

  if (!filePath) {
    return {
      notFound: true,
    }
  }

  try {
    const file = await fs.readFile(filePath)
    const extension = path.extname(filePath)
    const contentType =
      contentTypeByExtension[
        extension as keyof typeof contentTypeByExtension
      ] ?? 'application/octet-stream'

    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=0')
    res.end(file)

    return {
      props: {},
    }
  } catch {
    return {
      notFound: true,
    }
  }
}

export default function StorybookAsset() {
  return null
}
