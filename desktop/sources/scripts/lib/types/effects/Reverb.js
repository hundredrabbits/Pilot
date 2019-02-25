const Joi = require('joi-browser')
const Time = require('../core/TimeSchema')
const NormalRange = require('../core/NormalRangeSchema')

module.exports = {
  wet: NormalRange,
  decay: Time,
  preDelay: Time,
  normalize: Joi.boolean(),
  pitch: Joi.number().min(-12).max(12)
}
