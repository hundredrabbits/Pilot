const Joi = require('joi-browser')
const base16 = require('../../lib/base16')
const note = require('../../lib/note')

module.exports = {
  path: /P(\d)(\d)([A-Ga-g])([0-9A-Fa-f]?)([0-9A-Fa-f]?)/,
  params: {
    channel: Joi.string().required().description('The channel to play on'),
    octave: Joi.number().required().description('what octave for the note'),
    note: Joi.string().required().description('a valid musical node. lowercase will be a sharp note'),
    velocity: Joi.string().description('the velocity to play the note'),
    duration: Joi.string().description('duration to play the note'),
  },
  handler: (pilot, params) => {
    let channel = pilot.getChannel(params.channel)
    if (!channel) return
    let _note = note.fromCase(params.note)
    let _velocity = base16.normalRange(params.velocity || 'F')
    let _duration = base16.duration(params.duration || 0)
    channel.play(params.octave, _note, _velocity, _duration)
  }
}
