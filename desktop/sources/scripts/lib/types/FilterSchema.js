const Joi = require('joi-browser')

module.exports = Joi.string().valid('lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'notch', 'allpass', 'peaking').description('The type of the filter')
