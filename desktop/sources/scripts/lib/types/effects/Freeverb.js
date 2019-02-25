const Joi = require('joi-browser')
const NormalRange = require('../core/NormalRangeSchema')
const Frequency = require('../core/FrequencySchema')

module.exports = {
  roomSize: NormalRange,
  dampening: Frequency,
  wet: NormalRange
}
