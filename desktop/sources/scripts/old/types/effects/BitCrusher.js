const Joi = require('joi-browser')
const NormalRange = require('../core/NormalRangeSchema')

module.exports = {
  wet: NormalRange,
  bits: Joi.number().min(1).max(8)
}
