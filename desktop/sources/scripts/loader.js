'use strict'

const fs = require('fs')
const path = require('path')

// create up to 36 channels from each file in a dir.
module.exports = function (dir) {
  const files = fs.readdirSync(dir)
  const jsonFiles = files.filter(f => f.endsWith('.json'))
  const channels = jsonFiles.map(f => {
    let fullPath = path.resolve(dir, f)
    try { return require(fullPath) } catch (e) {
      console.log('could not open, skipping', fullPath, e)
    }
  }).filter(synth => synth) // remove any skipped
  return channels
}
