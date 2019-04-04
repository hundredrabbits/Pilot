'use strict'

const fs = require('fs')
const path = require('path')
const _ = require('lodash')

// create up to 36 channels from each file in a dir.
module.exports = function (dir) {
  const files = fs.readdirSync(dir)
  let manifest = {
    viz: ['Flexi, martin + geiss - dedicated to the sherwin maxawow']
  }
  let jsonFiles = files.filter(f => f.endsWith('.json'))
  console.log(jsonFiles)

  if (_.includes(jsonFiles, 'manifest.json')) {
    jsonFiles = _.reject(jsonFiles, f => f.indexOf('manifest.json') === 0)
    let fullPath = path.resolve(dir, 'manifest.json')
    try { manifest = require(fullPath) } catch (e) {
      console.log('could not open, skipping', fullPath, e)
    }
  }
  console.log('now hson', jsonFiles)

  const channels = jsonFiles.sort().map(f => {
    let fullPath = path.resolve(dir, f)
    try { return require(fullPath) } catch (e) {
      console.log('could not open, skipping', fullPath, e)
    }
  }).filter(synth => synth) // remove any skipped
  return {channels, manifest}
}
