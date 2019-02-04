const _ = require('lodash')
const Joi = require('joi-browser')
const shortie = require('getshortie')
const base16 = require('../../lib/base16')

module.exports = {
  path: /S(\d)([A-Za-z\#]+\#)([0-9a-fA-F]+)/,
  params: {
    channel: Joi.string().required().description('The channel to operate on'),
    path: Joi.string().required().description('short path notation. # char is path char, and must end in #'),
    value: Joi.string().description('base16 value to set the effect to')
  },
  handler: (pilot, params) => {
    console.log('synth change', params)
    let channel = pilot.getChannel(params.channel)
    if (!channel) return
    let describe = channel.describe()
    let path = params.path.split('#')
    path.pop() // ditch the last #
    let _path = path.join('.')
    let synthSchema = shortie.get(describe, _path)
    if (!synthSchema) return

    let schema = Joi.describe(synthSchema)
    let value = base16.fromSchemaType(schema, params.value)
    let fullPath = shortie.path(describe, _path)
    channel.set(fullPath, value)
    console.log('set synth', params.channel, 'property', fullPath, 'to', value)
  }
}
