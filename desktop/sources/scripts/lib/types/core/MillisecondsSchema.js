const Joi = require('joi-browser')

module.exports = Joi.number()
  .label('Milliseconds')
  .positive().integer().description('One millisecond is a thousandth of a second.')
