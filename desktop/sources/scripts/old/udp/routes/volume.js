const Joi = require('joi-browser')
const base16 = require('../../lib/base16')

module.exports = {
  path: /C(\d)(vol|VOL)([0-9a-fA-F])/,
  params: {
    channel: Joi.string().required().description('The channel to operate on'),
    operation: Joi.string().required().description('what operation to perform on the channel'),
    value: Joi.string().description('Volume level. 0 is off, F is highest')
  },
  handler: (pilot, params) => {
    let channel = pilot.getChannel(params.channel)
    if (!channel) return
    channel.volume(base16.normalRange(params.value))
  }
}
