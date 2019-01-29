const Joi = require('joi-browser')
const base16 = require('../../lib/base16')
const durationMap = ['16n', '15n', '14n', '13n', '12n', '11n', '10n', '9n', '8n', '7n', '6n', '5n', '4n', '3n', '2n', '1n']

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
    let _note = getNote(params.note)
    let _velocity = base16.normalRange(params.velocity || 'F')
    let _duration = durationMap[base16.valueOf(params.duration || 0)]
    channel.play(params.octave, _note, _velocity, _duration)
  }
}

function getNote(n) {
  let upperCase = n.toUpperCase()
  if (n == upperCase) return n
  // it was lowercase. make sharp
  return `${upperCase}#`
}
