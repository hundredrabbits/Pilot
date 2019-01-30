module.exports = Effect

const Joi = require('joi-browser')
const Effects = require('./effects')

function Effect(type, options, rawEffect) {
  this.type = type
  this.options = options
  this.rawEffect = rawEffect
}

Effect.prototype.getRawEffect = function () {
  return this.rawEffect
}

Effect.prototype.describe = function () {
  let schema = Effects[this.type]
  if (!schema) return null
  return Joi.describe(schema)
}

Effect.prototype.set = function (property, value) {
  let prop = this.rawEffect[property]
  if (!prop) return
  if (prop.value) prop.value = value
}
