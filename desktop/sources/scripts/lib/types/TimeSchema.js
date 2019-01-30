const Joi = require('joi-browser')

module.exports = Joi.alternatives().try(
  Joi.number().description('seconds format'), 
  Joi.string().regex(/\d[ntb]/).description('BPM time signature')
)
