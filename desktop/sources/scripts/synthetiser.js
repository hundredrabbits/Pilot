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

    this.channels[4] = new Tone.AMSynth()
    this.channels[5] = new Tone.AMSynth()
    this.channels[6] = new Tone.AMSynth()
    this.channels[7] = new Tone.AMSynth()

    this.channels[8] = new Tone.MonoSynth()
    this.channels[9] = new Tone.MonoSynth()
    this.channels[10] = new Tone.MonoSynth()
    this.channels[11] = new Tone.MonoSynth()

    this.channels[12] = new Tone.MembraneSynth()
    this.channels[13] = new Tone.MembraneSynth()
    this.channels[14] = new Tone.MembraneSynth()
    this.channels[15] = new Tone.MembraneSynth()
  }

  this.start = function () {
    for (const id in this.channels) {
      const ch = this.channels[id].toMaster()
    }
  }

  this.run = function (msg) {
    const data = this.parse(`${msg}`)

    if (data.note) {
      this.play(data)
    } else {
      console.warn('Unknown format', data)
    }

    pilot.terminal.update()
  }

  this.parse = function (msg) {
    const channel = clamp(parseInt(base36(msg.substr(0, 1))), 0, 16)
    const cmd = msg.substr(1, 3).toLowerCase()
    const val = msg.substr(4)

    if (cmd === 'env') {
      return parseEnv(channel, val)
    }

    return parseNote(channel, msg.substr(1))
  }

  this.operate = function (data) {

  }

  this.play = function (data) {
    if (!this.channels[data.channel]) { console.warn(`Unknown Channel:${data.channel}`); return }
    this.channels[data.channel].triggerAttackRelease(`${data.note}${data.octave}`, 0.1)
  }

  // Parsers

  function base36 (val) {
    return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].indexOf(val.toLowerCase())
  }

  function parseNote (channel, msg) {
    const octave = clamp(parseInt(msg.substr(0, 1)), 0, 8)
    const note = msg.substr(1, 1)
    return { channel: channel, octave: octave, note: note }
  }

  function parseEnv (channel, msg) {
    return { channel: channel, attack: attack, decay: decay, sustain: sustain, release: release }
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Synthetiser
