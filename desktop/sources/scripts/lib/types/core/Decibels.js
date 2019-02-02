const Joi = require('joi-browser')

module.exports = Joi.number()
  .label('Decibels')
  .min(-40).max(0)
