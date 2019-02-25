const Joi = require('joi-browser')
const Time = require('../core/TimeSchema')
const NormalRange = require('../core/NormalRangeSchema')
const Frequency = require('../core/FrequencySchema')
const Rolloff = require('../core/RolloffSchema')
const Decibels = require('../core/Decibels')
const Filter = require('../core/FilterSchema')


module.exports = {
  frequency  : Frequency,
  detune:  Joi.number().min(0).max(100),
  oscillator: {
    type: Joi.string().valid('sine', 'square', 'triangle', 'sawtooth') ,
    frequency: Frequency,
    detune:  Joi.number().min(0).max(100)
  },
  filter: {
    type: Filter,
    rolloff: Rolloff,
    Q: Joi.number().positive()
  },
  envelope: {
    attack: Time,
    attackCurve: Joi.string().valid('linear', 'exponential', 'sine', 'cosine', 'bounce', 'ripple', 'step'),
    decay: Time,
    decayCurve: Joi.string().valid('linear', 'exponential'),
    sustain: NormalRange,
    release: Time,
    releaseCurve: Joi.string().valid('linear', 'exponential', 'sine', 'cosine', 'bounce', 'ripple', 'step')
  },
  filterEnvelope  : {
    attack: Time,
    attackCurve: Joi.string().valid('linear', 'exponential', 'sine', 'cosine', 'bounce', 'ripple', 'step'),
    decay: Time,
    decayCurve: Joi.string().valid('linear', 'exponential'),
    sustain: NormalRange,
    release: Time,
    releaseCurve: Joi.string().valid('linear', 'exponential', 'sine', 'cosine', 'bounce', 'ripple', 'step')
  }
}
