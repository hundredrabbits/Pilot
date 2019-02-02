const _ = require('lodash')
const convert = require('./convert')
const oscillators = require('./oscillators')
const durations = ['16n', '15n', '14n', '13n', '12n', '11n', '10n', '9n', '8n', '7n', '6n', '5n', '4n', '3n', '2n', '1n']


// given a character, find its base36 integer
exports.valueOf = function (g) {
  return parseInt(g, 16)
  //return convert.clamp(keys.indexOf(`${g}`.toUpperCase()), 0, 15)
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
  if (schema.label === 'Milliseconds') return exports.valueOf(g)
  if (schema.type === 'string' && schema.valids && schema.valids.length) {
    return schema.valids[exports.valueOf(g)] || schema.valids[0]
  }
  if (schema.type === 'number') return exports.numberSchema(schema, g)
  if (schema.type === 'boolean') return exports.booleanSchema(g)
}

exports.numberSchema = function (schema, g) {
  let rules = _.get(schema, 'rules', [])
  let min, max = null
  rules.forEach(r => {
    if (r.name === 'min') min = r.arg
    if (r.name === 'max') max = r.arg
  })
  if (_.isNumber(min) && _.isNumber(max)) return convert.interpolate(exports.normalRange(g), min, max)

  return exports.valueOf(g)
}

exports.booleanSchema = function (g) {
  let itBe = convert.interpolate(exports.normalRange(g), 0, 1)
  if (itBe) return true
  return false
}
