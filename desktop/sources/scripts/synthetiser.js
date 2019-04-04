'use strict'

const Tone = require('tone')

function Synthetiser (pilot) {
  this.channels = []

  this.install = function () {
    Tone.start()
    Tone.Transport.start()

    this.channels[0] = new Tone.FMSynth()
    this.channels[1] = new Tone.FMSynth()
    this.channels[2] = new Tone.FMSynth()
    this.channels[3] = new Tone.FMSynth()
  }

  this.start = function () {
    for (const id in this.channels) {
      const ch = this.channels[id].toMaster()
    }
  }

  this.run = function (msg) {
    const data = this.parse(`${msg}`)
    this.operate(data)
    pilot.terminal.update()
  }

  this.parse = function (msg) {
    // Note
    const channel = clamp(parseInt(msg.substr(0, 1)), 0, 16)
    const octave = clamp(parseInt(msg.substr(1, 1)), 0, 8)
    const note = msg.substr(2, 1)
    return { type: 'play', channel: channel, octave: octave, note: note }
  }

  this.operate = function (data) {
    if (data.type === 'play') {
      this.play(data)
    }
  }

  this.play = function (data) {
    const name = `${data.note}${data.octave}`
    this.channels[data.channel].triggerAttackRelease(name, 0.1)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Synthetiser
