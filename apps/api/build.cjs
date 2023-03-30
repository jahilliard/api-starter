const esbuild = require('esbuild')
const tsPaths = require('esbuild-ts-paths')

esbuild.build({
  bundle: true,
  packages: 'external',
  platform: 'node',
  target: 'node18',
  entryPoints: ['src/server.ts'],
  outdir: 'build',
  minify: true,
  sourcemap: true,
  plugins: [tsPaths('./tsconfig.json')],
})
