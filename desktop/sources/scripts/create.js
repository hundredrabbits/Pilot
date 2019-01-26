const url = require('url')
const _ = require('lodash')
const Tone = require('tone')

// create a channel from a defn
module.exports = function (channelDefn, baseUrl) {
  let _relative = relative.bind(null, baseUrl)

  console.log('loading node', channelDefn)
  let channel = new Tone.Channel().toMaster()
  let constructorArgs = channelDefn.synth.options
  // we must remap urls for certain types
  if (channelDefn.synth.type === 'Players') constructorArgs = _.mapValues(constructorArgs, _relative)
  let synth = new Tone[channelDefn.synth.type](constructorArgs)

  let eff = channelDefn.effects || []
  let effects = eff.map(effect =>  {
    try {
      console.log('loading effect', effect.type)
      const constructor = Tone[effect.type]
      let factoryFunction = constructor.bind.apply(constructor, effect.options)
      return new factoryFunction()
    } catch (e) { console.log('ignoring', effect.type) } // ignore effects that dont load. should log
    console.log(effect.type, 'loaded')
  }).filter(e => e)

  // chain all the audio node from synth to effects to channel
  var currentUnit = synth;
  for (var i = 0; i < effects.length; i++){
    var toUnit = effects[i]
    currentUnit.connect(toUnit)
    currentUnit = toUnit
  }
  currentUnit.connect(channel)
  return {channel, synth, effects}
}

function relative (baseUrl, relativePath) {
  return url.resolve(baseUrl, relativePath)
}
