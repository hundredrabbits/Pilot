const Joi = require('joi-browser')
const Time = require('../core/TimeSchema')
const NormalRange = require('../core/NormalRangeSchema')

module.exports = {
  wet: NormalRange,
  depth: NormalRange,
  frequency: Time,
  spread: Joi.number().min(0).max(180),
  type: Joi.string().valid('sine', 'square', 'triangle', 'sawtooth')
}
