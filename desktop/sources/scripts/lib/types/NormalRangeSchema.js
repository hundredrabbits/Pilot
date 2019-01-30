const Joi = require('joi-browser')

module.exports = Joi.number()
  .label('NormalRange')
  .min(0).max(1).description('between 0 and 1')
