module.exports = Channel
const _ = require('lodash')
const convert = require('./lib/convert')
const Joi = require('joi-browser')
const Instruments = require('./lib/types/instruments')

<<<<<<< HEAD
function Channel ({ channel, type, synth, effects }) {
=======

function Channel({channel, type, synth, effects, sends}) {
>>>>>>> master
  this.type = type
  this.channel = channel
  this.synth = synth
  this.effects = effects
  this.sends = sends
}

Channel.prototype.describe = function () {
  let schema = Instruments[this.type]
  if (!schema) return null
  return schema
}

Channel.prototype.set = function (property, value) {
  let prop = _.get(this.synth, property)
  console.log(prop)
  if (prop.value) prop.value = value
  else _.set(this.synth, property, value)
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

Channel.prototype.getEffect = function (index) {
  return this.effects[index]
}

Channel.prototype.getSend = function (index) {
  return this.sends[index]
};

Channel.prototype.dispose = function () {
  this.channel.disconnect()
  this.channel.dispose()
};
