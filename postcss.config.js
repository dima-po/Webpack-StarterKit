const postcssPresetEnv = require('postcss-preset-env')

module.exports = {
  plugins: [
    require('autoprefixer'),
    postcssPresetEnv({
      stage: 0,
      browsers: 'last 5 versions'
    })
  ]
}
