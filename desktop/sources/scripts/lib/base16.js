const convert = require('./convert')
const keys = "0123456789ABCDEF"

// given a character, find its base36 integer
exports.valueOf = function (g) {
  return convert.clamp(keys.indexOf(`${g}`.toUpperCase()), 0, 15)
}

exports.normalRange = function (g) {
  return exports.valueOf(g) / 15
}
