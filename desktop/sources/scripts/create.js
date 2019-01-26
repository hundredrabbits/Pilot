const Tone = require('tone')

// create a channel from a defn
module.exports = function (channelDefn) {
  let channel = new Tone.Channel().toMaster()
  console.log('loading node', channelDefn.synth.type)
  let synth = new Tone[channelDefn.synth.type](channelDefn.synth.options)

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
