const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.export = {
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src'),
      common: resolve('src/common'),
      components: resolve('src/components')
    }
  }
}
