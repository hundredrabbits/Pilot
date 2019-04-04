const Joi = require('joi-browser')
const NormalRange = require('../core/NormalRangeSchema')
const Frequency = require('../core/FrequencySchema')

module.exports = {
  wet: NormalRange,
  frequency: Frequency,
  octaves: Joi.number().integer().positive(),
  baseFrequency: Frequency,
  Q: Joi.number().integer().positive()
}
