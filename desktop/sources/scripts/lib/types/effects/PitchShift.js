const Joi = require('joi-browser')
const Time = require('../core/TimeSchema')
const NormalRange = require('../core/NormalRangeSchema')
const Milliseconds = require('../core/MillisecondsSchema')

module.exports = {
  wet: NormalRange,
  delayTime: Milliseconds,
  feedback: NormalRange,
  windowSize: Time,
  pitch: Joi.number().min(-12).max(12)
}
