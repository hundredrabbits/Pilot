const _ = require('lodash')
const Joi = require('joi-browser')
const shortie = require('getshortie')
const keysDeep = require('lodash-flatkeystree')
const get = require('getshortie')
_.mixin(keysDeep)
const base16 = require('../../lib/base16')

module.exports = {
  path: /C(\d)SEND(\d)([0-9a-fA-F])/,
  params: {
    channel: Joi.string().required().description('The channel to operate on'),
    send: Joi.number().required().description('the send index in the send array'),
    value: Joi.string().description('base16 value to set the effect to')
  },
  handler: (pilot, params) => {
    console.log('da send')
    let channel = pilot.getChannel(params.channel)
    if (!channel) return
    console.log('got channel')
    let send = channel.getSend(params.send)
    if (!send) return
    console.log('got send')
    if (send.target === 'effects') {
      console.log('target ef')
      let effect = channel.getEffect(send.which)
      if (!effect) return
      console.log('got effect')
      let describe = effect.describe()

      let effectSchema = shortie.get(describe, send.path)
      if (!effectSchema) return

      console.log('got schema')

      let schema = Joi.describe(effectSchema)
      let value = base16.fromSchemaType(schema, params.value)
      let fullPath = shortie.path(describe, send.path)
      console.log(fullPath)
      effect.set(fullPath, value)
      console.log('set channel', params.channel, 'effect', params.effect, effect.type, 'property', fullPath, 'to', value)
    }
    if (send.target === 'synth') {
      console.log('target synth')
      let describe = channel.describe()
      let synthSchema = shortie.get(describe, send.path)
      if (!synthSchema) return

      let schema = Joi.describe(synthSchema)
      console.log('da schame', schema, params.value)
      let value = base16.fromSchemaType(schema, params.value)
      let fullPath = shortie.path(describe, send.path)
      console.log('fullPath', fullPath, value)
      channel.set(fullPath, value)
      console.log('set synth', params.channel, 'property', fullPath, 'to', value)
    }
  }
}
