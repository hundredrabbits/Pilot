const Joi = require('joi-browser')
const Time = require('../core/TimeSchema')
const NormalRange = require('../core/NormalRangeSchema')
const Frequency = require('../core/FrequencySchema')
const Rolloff = require('../core/RolloffSchema')
const Filter = require('../core/FilterSchema')
const Milliseconds = require('../core/MillisecondsSchema')

module.exports = {
  wet: NormalRange,
  delayTime: Milliseconds,
  depth: NormalRange,
  frequency: Time,
  spread: Joi.number().min(0).max(180),
  type: Joi.string().valid('sine', 'square', 'triangle', 'sawtooth')
}
