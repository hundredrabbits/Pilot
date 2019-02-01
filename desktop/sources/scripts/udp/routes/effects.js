const _ = require('lodash')
const Joi = require('joi-browser')
const keysDeep = require('lodash-flatkeystree')
const get = require('getshortie')
_.mixin(keysDeep)
const base16 = require('../../lib/base16')

module.exports = {
  path: /E(\d)(\d)(\d)([0-9a-fA-F])/,
  params: {
    channel: Joi.string().required().description('The channel to operate on'),
    effect: Joi.number().required().description('the effect index in the effects array'),
    effectProperty: Joi.number().required().description('the object key index of the effect'),
    value: Joi.string().description('base16 value to set the effect to')
  },
  handler: (pilot, params) => {
    let channel = pilot.getChannel(params.channel)
    if (!channel) return
    let effect = channel.getEffect(params.effect)
    if (!effect) return
    let describe = effect.describe()

    let selectedProperty = keysDeep(describe)[params.effectProperty]
    if (!selectedProperty) return
    let effectSchema = get(describe, selectedProperty)
    if (!effectSchema) return

    let value = base16.fromSchemaType(effectSchema, params.value)

    effect.set(selectedProperty, value)
    console.log('set channel', params.channel, 'effect', params.effect, effect.type, 'property', selectedProperty, 'to', value)
  }
}
