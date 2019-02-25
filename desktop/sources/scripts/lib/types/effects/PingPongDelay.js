const Joi = require('joi-browser')
const NormalRange = require('../core/NormalRangeSchema')
const Milliseconds = require('../core/MillisecondsSchema')

module.exports = {
  wet: NormalRange,
  delayTime: Milliseconds,
  feedback: NormalRange
}
