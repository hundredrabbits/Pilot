const Joi = require('joi-browser')
const Time = require('../core/TimeSchema')
const NormalRange = require('../core/NormalRangeSchema')
const Frequency = require('../core/FrequencySchema')
const Rolloff = require('../core/RolloffSchema')
const Decibels = require('../core/Decibels')

module.exports = {
  frequency: Frequency,
  envelope: {
    attack: Time,
    attackCurve: Joi.string().valid('linear', 'exponential', 'sine', 'cosine', 'bounce', 'ripple', 'step'),
    decay: Time,
    decayCurve: Joi.string().valid('linear', 'exponential'),
    sustain: NormalRange,
    release: Time,
    releaseCurve: Joi.string().valid('linear', 'exponential', 'sine', 'cosine', 'bounce', 'ripple', 'step')
  },
  harmonicity: Joi.number().min(0),
  modulationIndex: Joi.number().positive().integer(),
  resonance: Frequency,
  octaves: Joi.number().positive().integer()
}
