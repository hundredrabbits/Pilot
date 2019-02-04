const Joi = require('joi-browser')
const Time = require('../core/TimeSchema')
const NormalRange = require('../core/NormalRangeSchema')
const Frequency = require('../core/FrequencySchema')
const Rolloff = require('../core/RolloffSchema')
const Decibels = require('../core/Decibels')

module.exports = {
  attackNoise: Joi.number().min(0.1).max(20),
  dampening: Frequency ,
  resonance: NormalRange

}
