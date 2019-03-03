const _ = require('lodash')
const Joi = require('joi-browser')
const shortie = require('getshortie')
const base16 = require('../../lib/base16')

module.exports = {
  path: /E(\d)(\d)([A-Za-z\#]+\#)([0-9a-fA-F]+)/,
  params: {
    channel: Joi.string().required().description('The channel to operate on'),
    effect: Joi.number().required().description('the effect index in the effects array'),
    effectPath: Joi.string().required().description('short path notation. # char is path char, and must end in #'),
    value: Joi.string().description('base16 value to set the effect to')
  },
  handler: (pilot, params) => {
    let channel = pilot.getChannel(params.channel)
    if (!channel) return
    let effect = channel.getEffect(params.effect)
    if (!effect) return
    let describe = effect.describe()
    let path = params.effectPath.split('#')
    path.pop() // ditch the last #
    let _path = path.join('.')
    let effectSchema = shortie.get(describe, _path)
    if (!effectSchema) return

    let schema = Joi.describe(effectSchema)
    let value = base16.fromSchemaType(schema, params.value)
    let fullPath = shortie.path(describe, _path)
    effect.set(fullPath, value)
    console.log('set channel', params.channel, 'effect', params.effect, effect.type, 'property', fullPath, 'to', value)
  }
}
