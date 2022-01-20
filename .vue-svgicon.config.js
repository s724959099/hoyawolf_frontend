const path = require('path')
const svgFilePaths = ['src/assets/images/alert'].map((v) => path.resolve(v))
const tagName = 'y'

module.exports = {
  tagName,
  svgFilePath: svgFilePaths,
  svgoConfig: {},
  pathAlias: {},
  transformAssetUrls: {
    [tagName]: ['data'],
  },
}
