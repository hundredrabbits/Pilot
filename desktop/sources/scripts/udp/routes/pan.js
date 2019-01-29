const Joi = require('joi-browser')
const base16 = require('../../lib/base16')

module.exports = {
  path: /C(\d)(pan|PAN)([0-9a-fA-F])/,
  params: {
    channel: Joi.string().required().description('The channel to operate on'),
    operation: Joi.string().required().description('what operation to perform on the channel'),
    value: Joi.string().description('8 is center, 0 is left, F is right')
  },
  handler: (pilot, params) => {
    let channel = pilot.getChannel(params.channel)
    if (!channel) return
    channel.pan(base16.normalRange(params.value))
  }
}
