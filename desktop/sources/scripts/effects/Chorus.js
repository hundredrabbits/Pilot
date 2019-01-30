const Joi = require('joi-browser')
const Time = require('../lib/types/TimeSchema')
const NormalRange = require('../lib/types/NormalRangeSchema')
const Frequency = require('../lib/types/FrequencySchema')
const Rolloff = require('../lib/types/RolloffSchema')
const Filter = require('../lib/types/FilterSchema')
const Milliseconds = require('../lib/types/MillisecondsSchema')

exports.settings = {
  wet: NormalRange,
  delayTime: Milliseconds,
  depth: NormalRange,
  filter_type: Filter,
  filter_rolloff: Rolloff,
  filter_Q: Joi.number().positive(),
  frequency: Time,
  spread: Joi.number().min(0).max(180),
  type: Joi.string().valid('sine', 'square', 'triangle', 'sawtooth')
}
