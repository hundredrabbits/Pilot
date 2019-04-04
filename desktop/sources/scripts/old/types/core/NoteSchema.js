const Joi = require('joi-browser')

module.exports = Joi.string()
  .label('Note')
  .regex(/[A-G]\#?\d/).description('Scientific Pitch Notation.')
