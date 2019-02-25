const Joi = require('joi-browser')
const NormalRange = require('../core/NormalRangeSchema')

module.exports = {
  wet: NormalRange,
  normalize: Joi.boolean()
}
