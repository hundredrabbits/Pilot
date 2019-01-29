module.exports = Channel
const convert = require('./lib/convert')

function Channel({channel, synth, effects}) {
  this.channel = channel
  this.synth = synth
  this.effects = effects
}

Channel.prototype.play = function (octave, note, velocity, duration) {
  let synth = this.synth
  if (!synth._players) return synth.triggerAttackRelease(`${note}${octave}`, duration, '+0', velocity)

  // special case of a Tone.Players instance
  let player = synth.get(`${octave}${note}`)
  if (!player) return console.log('no player defined for note', note)
  player.start()
}

Channel.prototype.mute = function (shouldMute) {
  console.log('muting', shouldMute)
  this.channel.mute = shouldMute
}

Channel.prototype.solo = function (shouldSolo) {
  this.channel.solo = true
}

Channel.prototype.volume = function (normalRange) {
  this.channel.volume.value = convert.interpolate(normalRange, -80, 6)
}

Channel.prototype.pan = function (normalRange) {
  this.channel.pan.value = convert.interpolate(normalRange, -1, 1)
}
