module.exports = Effect
const _ = require('lodash')
const Joi = require('joi-browser')
const Effects = require('./lib/types/effects')

function Effect (type, options, rawEffect) {
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
  return schema
}

Effect.prototype.set = function (property, value) {
  console.log(this.rawEffect, property)
  let prop = _.get(this.rawEffect, property)
  if (prop.value) prop.value = value
  else _.set(this.rawEffect, property, value)
}
