import { execFileSync } from 'node:child_process'

const APP_JS_PATTERN = /^packages\/mirror-media-next\/.*\.js$/
const IGNORED_PATTERNS = [
  /^packages\/mirror-media-next\/public\/sw\.js$/,
  /^packages\/mirror-media-next\/public\/workbox-.*\.js$/,
  /^packages\/mirror-media-next\/public\/worker-.*\.js$/,
  // This is an explicitly reviewed Node tooling script, not application code.
  // It replaces a hard-to-read package.json shell one-liner for the SW build.
  /^packages\/mirror-media-next\/scripts\/build-sw\.js$/,
]

const args = new Set(process.argv.slice(2))
const isStaged = args.has('--staged')
const baseRef =
  process.env.NO_NEW_JS_BASE_REF ||
  process.env.BASE_REF ||
  process.env.CHANGE_TARGET ||
  'origin/dev'

function git(args, options = {}) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  }).trim()
}

const repoRoot = git(['rev-parse', '--show-toplevel'])

function getAddedFiles() {
  // Treat renamed .js paths as new files so moved application files must become .ts/.tsx.
  const args = isStaged
    ? ['diff', '--cached', '--name-status', '--diff-filter=AR']
    : ['diff', '--name-status', '--diff-filter=AR', `${baseRef}...HEAD`]

  return git(args, { cwd: repoRoot })
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split('\t').at(-1))
    .filter(Boolean)
}

const addedJsFiles = getAddedFiles().filter(
  (filePath) =>
    APP_JS_PATTERN.test(filePath) &&
    IGNORED_PATTERNS.every((pattern) => pattern.test(filePath) === false)
)

if (addedJsFiles.length > 0) {
  console.error('New application .js files are not allowed after Phase 5.')
  console.error('Use .ts or .tsx for new files instead:')
  for (const filePath of addedJsFiles) {
    console.error(`- ${filePath}`)
  }
  process.exit(1)
}
