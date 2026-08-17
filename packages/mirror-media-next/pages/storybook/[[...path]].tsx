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

const storybookMissingHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Storybook static artifact missing</title>
    <style>
      body {
        margin: 0;
        padding: 32px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #222222;
        background: #ffffff;
      }

      main {
        max-width: 720px;
      }

      code {
        border-radius: 4px;
        background: #f3f4f6;
        padding: 2px 6px;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Storybook static artifact missing</h1>
      <p>Run <code>pnpm --dir packages/mirror-media-next storybook:build</code>, then reload <code>/storybook</code>.</p>
    </main>
  </body>
</html>`

const normalizeBasePath = (html: string) =>
  html.replace('<head>', '<head><base href="/storybook/" />')

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
    if (segments.length === 0 && ENV === 'local') {
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Cache-Control', 'no-store')
      res.statusCode = 503
      res.end(storybookMissingHtml)

      return {
        props: {},
      }
    }

    return {
      notFound: true,
    }
  }

  try {
    const extension = path.extname(filePath)
    const contentType =
      contentTypeByExtension[
        extension as keyof typeof contentTypeByExtension
      ] ?? 'application/octet-stream'
    const file =
      extension === '.html'
        ? normalizeBasePath(await fs.readFile(filePath, 'utf8'))
        : await fs.readFile(filePath)

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
