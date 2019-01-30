const Joi = require('joi-browser')

module.exports = Joi.alternatives().try(
  Joi.number().description('frequency in hertz'),
  Joi.string().regex(/\d[ntb]/).description('BPM time signature')
)
