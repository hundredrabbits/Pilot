'use strict'

const Tone = require('tone')

function Synthetiser (pilot) {
  this.synths = []
  this.synth = null

  this.install = function () {
    Tone.start()
    Tone.Transport.start()

    this.synth = new Tone.FMSynth().toMaster()
  }

  this.start = function () {

  }

  this.run = function (msg) {
    const data = this.parse(`${msg}`)
    this.operate(data)
    pilot.terminal.log(data)
  }

  this.parse = function (msg) {
    // Note
    const channel = clamp(parseInt(msg.substr(0, 1)), 0, 16)
    const octave = clamp(parseInt(msg.substr(1, 1)), 0, 8)
    const note = msg.substr(2, 1)
    return { type: 'play', channel: channel, octave: octave, note: note }
  }

  this.operate = function (data) {
    this.synth.triggerAttackRelease('C5', 0.1)
  }

  this.operate = function (data) {
    if (data.type === 'play') {
      this.play(data)
    }
  }

  this.play = function (data) {
    const name = `${data.note}${data.octave}`
    this.synth.triggerAttackRelease(name, 0.1)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Synthetiser
