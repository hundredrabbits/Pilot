const Joi = require('joi-browser')
const NormalRange = require('../core/NormalRangeSchema')

module.exports = {
  wet: NormalRange,
  order: Joi.number().min(1).max(100),
  oversample: Joi.string().valid('2x', '4x')
}
