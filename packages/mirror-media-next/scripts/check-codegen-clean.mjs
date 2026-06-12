import { execFileSync } from 'node:child_process'

const WATCHED_PATHS = ['apollo/schema', 'apollo/__generated__']

function git(args) {
  return execFileSync('git', args, {
    cwd: new URL('..', import.meta.url),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim()
}

const trackedDiff = git(['diff', '--name-only', '--', ...WATCHED_PATHS])
const untrackedFiles = git([
  'ls-files',
  '--others',
  '--exclude-standard',
  '--',
  ...WATCHED_PATHS,
])

const dirtyFiles = [...trackedDiff.split('\n'), ...untrackedFiles.split('\n')]
  .filter(Boolean)
  .sort()

if (dirtyFiles.length > 0) {
  console.error(
    'GraphQL Codegen output is not clean. Run pnpm codegen and commit the resulting files:'
  )
  for (const filePath of dirtyFiles) {
    console.error(`- ${filePath}`)
  }
  process.exit(1)
}
