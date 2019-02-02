const Joi = require('joi-browser')
const Time = require('../core/TimeSchema')
const NormalRange = require('../core/NormalRangeSchema')

module.exports = {
  wet: NormalRange,
  depth: NormalRange,
  frequency: Time,
  type: Joi.string().valid('sine', 'square', 'triangle', 'sawtooth')
}
