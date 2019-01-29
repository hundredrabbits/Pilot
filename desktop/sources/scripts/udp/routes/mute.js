const Joi = require('joi-browser')

module.exports = {
  path: /C(\d)(mute|MUTE)([0-1])/,
  params: {
    channel: Joi.string().required().description('The channel to play on'),
    operation: Joi.string().required().description('what operation to perform on the channel'),
    value: Joi.string().description('1 mutes, 0 unmutes')
  },
  handler: (pilot, params) => {
    let channel = pilot.getChannel(params.channel)
    if (!channel) return
    let shouldMute = false
    if (params.value === '1') shouldMute = true
    channel.mute(shouldMute)
  }
}
