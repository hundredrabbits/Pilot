const Joi = require('joi-browser')

module.exports = Joi.string().regex(/[A-G]\#?\d/).description('Scientific Pitch Notation.')
