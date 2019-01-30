const Joi = require('joi-browser')
const Time = require('../lib/types/TimeSchema')
const NormalRange = require('../lib/types/NormalRangeSchema')
const Frequency = require('../lib/types/FrequencySchema')
const Rolloff = require('../lib/types/RolloffSchema')
const Filter = require('../lib/types/FiterSchema')

exports.settings = {
  wet: NormalRange,
  frequency: Time,
  type: Joi.string().valid('sine', 'square', 'triangle', 'sawtooth'),
  depth: NormalRange,
  baseFrequency  : Frequency ,
  octaves: Joi.number().integer().positive(),
  filter: {
    type: Filter,
    rolloff: Rolloff,
    Q: Joi.number().positive()
  }
}
