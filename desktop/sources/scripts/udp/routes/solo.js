const Joi = require('joi-browser')

module.exports = {
  path: /C(\d)(solo|SOLO)([0-1])/,
  params: {
    channel: Joi.string().required().description('The channel to operate on'),
    operation: Joi.string().required().description('what operation to perform on the channel'),
    value: Joi.string().description('1 solo, 0 unsolo')
  },
  handler: (pilot, params) => {
    let channel = pilot.getChannel(params.channel)
    if (!channel) return
    let shouldSolo = false
    if (params.value === '1') shouldSolo = true
    channel.solo(shouldSolo)
  }
}
