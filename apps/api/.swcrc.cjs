const {
  compilerOptions: { paths, baseUrl },
} = requre('./tsconfig')

module.exports = {
  jsc: {
    parser: {
      syntax: 'typescript',
      tsx: false,
      decorators: false,
      dynamicImport: false,
    },
    transform: null,
    target: 'es5',
    loose: false,
    externalHelpers: false,
    keepClassNames: false,
    baseUrl,
    paths,
  },
  minify: true,
}
