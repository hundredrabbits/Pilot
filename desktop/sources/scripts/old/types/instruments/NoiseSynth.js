const Joi = require('joi-browser')
const Time = require('../core/TimeSchema')
const NormalRange = require('../core/NormalRangeSchema')
const Frequency = require('../core/FrequencySchema')
const Rolloff = require('../core/RolloffSchema')
const Decibels = require('../core/Decibels')

module.exports = {
  noise: {
    type: Joi.string().valid('pink', 'white', 'brown')
  },
  envelope: {
    attack: Time,
    attackCurve: Joi.string().valid('linear', 'exponential', 'sine', 'cosine', 'bounce', 'ripple', 'step'),
    decay: Time,
    decayCurve: Joi.string().valid('linear', 'exponential'),
    sustain: NormalRange,
    release: Time,
    releaseCurve: Joi.string().valid('linear', 'exponential', 'sine', 'cosine', 'bounce', 'ripple', 'step')
  }
}
