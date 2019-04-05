'use strict'

const Tone = require('tone')

function Synthetiser (pilot) {
  this.channels = []
  this.effects = { }

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

    // this.effects.chorus = new Tone.Chorus(4, 2.5, 0.5)
    // this.effects.delay = new Tone.PingPongDelay('4n', 0.2)
    // this.effects.cheby = new Tone.Chebyshev(50)
    // this.effects.distortion = new Tone.Distortion(0.8)
    this.effects.reverb = new Tone.JCReverb(0.4)
    // this.effects.feedback = new Tone.FeedbackDelay(0.5)
    // this.effects.freeverb = new Tone.Freeverb()
  }

  this.start = function () {
    // Connect instruments to effects
    for (const id in this.channels) {
      const channel = this.channels[id]
      for (const i in this.effects) {
        const effect = this.effects[i]
        channel.connect(effect)
      }
    }
    // Connect effects to Master
    for (const i in this.effects) {
      this.effects[i].toMaster()
    }
  }

  this.run = function (msg) {
    const data = this.parse(`${msg}`)

    if (!data) { console.warn(`Unknown data`); return }
    if (!this.channels[data.channel]) { console.warn(`Unknown Channel:${data.channel}`); return }

    if (data.isEnv) {
      this.setEnv(data)
    } else if (data.isNote) {
      this.playNote(data)
    } else {
      console.warn('Unknown format', data)
    }
  }

  this.parse = function (msg) {
    const channel = clamp(parseInt(str36int(msg.substr(0, 1))), 0, 16)
    const cmd = msg.substr(1, 3).toLowerCase()
    const val = msg.substr(5)

    if (cmd === 'env') {
      return parseEnv(channel, val)
    }

    return parseNote(channel, msg.substr(1))
  }

  // Operations

  this.playNote = function (data, msg) {
    if (isNaN(data.channel)) { console.warn(`Unknown Channel`); return }
    if (isNaN(data.octave)) { console.warn(`Unknown Octave`); return }

    this.channels[data.channel].triggerAttackRelease(`${data.note}${data.sharp}${data.octave}`, 0.1)

    pilot.terminal.update(data)
  }

  this.setEnv = function (data) {
    this.channels[data.channel].envelope.attack = data.attack
    this.channels[data.channel].envelope.decay = data.decay
    this.channels[data.channel].envelope.sustain = data.sustain
    this.channels[data.channel].envelope.release = data.release

    pilot.terminal.update(data)
  }

  // Parsers

  function parseNote (channel, msg) {
    if (msg.length < 2) { console.warn(`Misformatted note`); return }
    const octave = clamp(parseInt(msg.substr(0, 1)), 0, 8)
    const note = msg.substr(1, 1)
    const sharp = note.toLowerCase() === note ? '#' : ''
    return { isNote: true, channel: channel, octave: octave, note: note, sharp: sharp, string: `${octave}${note}` }
  }

  function parseEnv (channel, msg) {
    if (msg.length !== 4) { console.warn(`Misformatted env`); return }
    const attack = str36int(msg.substr(0, 1)) / 15
    const decay = str36int(msg.substr(1, 1)) / 15
    const sustain = str36int(msg.substr(2, 1)) / 15
    const release = str36int(msg.substr(3, 1)) / 15
    return { isEnv: true, channel: channel, attack: attack, decay: decay, sustain: sustain, release: release, string: `env` }
  }

  function int36str (val) { return val.toString(36) }
  function str36int (val) { return parseInt(val, 36) }
  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Synthetiser
