const Joi = require('joi-browser')
const Time = require('../core/TimeSchema')
const NormalRange = require('../core/NormalRangeSchema')
const Frequency = require('../core/FrequencySchema')
const Rolloff = require('../core/RolloffSchema')
const Decibels = require('../core/Decibels')

module.exports = {
  vibratoAmount: Joi.number().positive(),
  vibratoRate: Frequency,
  harmonicity: Joi.number().positive(),
  voice0: {
    volume: Decibels,
    portamento: Time,
    oscillator: {
      type: Joi.string().valid('sine', 'square', 'triangle', 'sawtooth') ,
      frequency: Frequency,
      detune:  Joi.number().min(0).max(100)
    },
    filterEnvelope  : {
      attack: Time,
      attackCurve: Joi.string().valid('linear', 'exponential', 'sine', 'cosine', 'bounce', 'ripple', 'step'),
      decay: Time,
      decayCurve: Joi.string().valid('linear', 'exponential'),
      sustain: NormalRange,
      release: Time,
      releaseCurve: Joi.string().valid('linear', 'exponential', 'sine', 'cosine', 'bounce', 'ripple', 'step')
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
  },
  voice1: {
    volume: Decibels,
    portamento: Time,
    oscillator  : {
      type: Joi.string().valid('sine', 'square', 'triangle', 'sawtooth'),
      frequency: Frequency,
      detune:  Joi.number().min(0).max(100)
    },
    filterEnvelope: {
      attack: Time,
      attackCurve: Joi.string().valid('linear', 'exponential', 'sine', 'cosine', 'bounce', 'ripple', 'step'),
      decay: Time,
      decayCurve: Joi.string().valid('linear', 'exponential'),
      sustain: NormalRange,
      release: Time,
      releaseCurve: Joi.string().valid('linear', 'exponential', 'sine', 'cosine', 'bounce', 'ripple', 'step')
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
}
