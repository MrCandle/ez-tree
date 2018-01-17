export default {
  input: 'dist/index.js',
  output: {
    file: 'dist/bundles/eztree.umd.js',
    format: 'umd',
    moduleName: 'ng.eztree',
    sourcemap: false
  },
  globals: {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common'
  }
}
