const Joi = require('joi-browser')
const Time = require('../core/TimeSchema')
const NormalRange = require('../core/NormalRangeSchema')
const Frequency = require('../core/FrequencySchema')
const Rolloff = require('../core/RolloffSchema')
const Filter = require('../core/FilterSchema')

module.exports = {
  wet: NormalRange,
  frequency: Time,
  type: Joi.string().valid('sine', 'square', 'triangle', 'sawtooth'),
  depth: NormalRange,
  baseFrequency: Frequency ,
  octaves: Joi.number().integer().positive(),
  filter: {
    type: Filter,
    rolloff: Rolloff,
    Q: Joi.number().positive()
  }
}
