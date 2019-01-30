const Joi = require('joi-browser')

module.exports = Joi.number().valid(-12, -24, -48).description('The drop in decibels per octave after the cutoff frequency')
