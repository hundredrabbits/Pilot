const Joi = require('joi-browser')
const Time = require('../core/TimeSchema')
const NormalRange = require('../core/NormalRangeSchema')
const Frequency = require('../core/FrequencySchema')
const Rolloff = require('../core/RolloffSchema')
const Decibels = require('../core/Decibels')

module.exports = {
  wet: NormalRange,
  baseFrequency: Time,
  octaves: Joi.number().integer().positive(),
  sensitivity: Decibels,
  Q: Joi.number().integer().positive(),
  gain: Joi.number().integer().positive()
}
