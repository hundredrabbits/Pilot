const convert = require('./convert')

// given a character, find its base36 integer
exports.valueOf = function (g) {
  return parseInt(g, 36)
}

exports.normalRange = function (g) {
  return exports.valueOf(g) / 35
}
