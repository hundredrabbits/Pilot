const convert = require('./convert')
const oscillators = require('./oscillators')
const keys = "0123456789ABCDEF"
const durations = ['16n', '15n', '14n', '13n', '12n', '11n', '10n', '9n', '8n', '7n', '6n', '5n', '4n', '3n', '2n', '1n']


// given a character, find its base36 integer
exports.valueOf = function (g) {
  return convert.clamp(keys.indexOf(`${g}`.toUpperCase()), 0, 15)
}

exports.normalRange = function (g) {
  return exports.valueOf(g) / 15
}

exports.degrees = function (g) {
  return convert.interpolate(exports.normalRange(g), 0, 180)
}

exports.oscillatorType = function (g) {
  let index = exports.valueOf(g)
  let type = oscillators[index]
  if (!type) return 'sine'
}

exports.duration = function (g) {
  return durations[exports.valueOf(g)]
}

exports.fromSchemaType = function (schema, g) {
  if (schema.label === 'NormalRange') return exports.normalRange(g)
}

exports.numberSchema = function (schema, g) {

}
