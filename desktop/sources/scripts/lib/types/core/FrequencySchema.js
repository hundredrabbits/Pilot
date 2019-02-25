const Joi = require('joi-browser')
const Note = require('./NoteSchema')

module.exports = Joi.alternatives().try(
  Joi.number().description('frequency in hertz'),
  Note.description('BPM time signature')
).label('Frequency')
