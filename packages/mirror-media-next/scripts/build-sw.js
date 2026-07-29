const esbuild = require('esbuild')

// Keep the service worker build in a file instead of a package.json shell
// one-liner. The worker runs in the browser, so NEXT_PUBLIC_ENV must be
// inlined at build time; using esbuild's JS API avoids nested shell quoting
// and keeps this step independent from the removed next-pwa build wrapper.
esbuild.buildSync({
  entryPoints: ['service-worker/index.js'],
  bundle: true,
  format: 'iife',
  target: 'es2017',
  define: {
    'process.env.NEXT_PUBLIC_ENV': JSON.stringify(
      process.env.NEXT_PUBLIC_ENV || 'local'
    ),
  },
  outfile: 'public/sw.js',
})
