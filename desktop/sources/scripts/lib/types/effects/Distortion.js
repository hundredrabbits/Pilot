const Joi = require('joi-browser')
const NormalRange = require('../core/NormalRangeSchema')

module.exports = {
  wet: NormalRange,
  distortion: NormalRange,
  oversample: Joi.string().valid('2x', '4x')
}
