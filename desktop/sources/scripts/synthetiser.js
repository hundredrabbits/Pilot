'use strict'

const Tone = require('tone')

function Synthetiser (pilot) {
  this.channels = []
  this.effects = { }
  this.mastering = {}

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

    // Effects
    this.effects.chorus = new Tone.Chorus(4, 2.5, 0.5)
    this.effects.tremolo = new Tone.Tremolo(9, 0.75)
    this.effects.bitcrusher = new Tone.BitCrusher(2)
    this.effects.cheby = new Tone.Chebyshev(50)
    this.effects.distortion = new Tone.Distortion(0)
    this.effects.delay = new Tone.PingPongDelay('4n', 0.2)
    this.effects.reverb = new Tone.JCReverb(0)
    this.effects.feedback = new Tone.FeedbackDelay(0.5)

    // Mastering
    this.mastering.equalizer = new Tone.EQ3(2, -2, 3)
    this.mastering.stereo = new Tone.StereoWidener(0.5)
    this.mastering.compressor = new Tone.Compressor(-30, 3)
    this.mastering.limiter = new Tone.Limiter(-12)
    this.mastering.volume = new Tone.Volume(-12)
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
      this.effects[i].connect(this.mastering.equalizer)
      this.effects[i].wet.value = 0
    }

    this.mastering.equalizer.connect(this.mastering.stereo)
    this.mastering.stereo.connect(this.mastering.compressor)
    this.mastering.compressor.connect(this.mastering.limiter)
    this.mastering.compressor.connect(this.mastering.volume)
    this.mastering.volume.toMaster()
  }

  this.run = function (msg) {
    const data = this.parse(`${msg}`)

    if (!data) { console.warn(`Unknown data`); return }

    if (data.isEffect) {
      this.setEffect(data)
    } else if (data.isEnv) {
      this.setEnv(data)
    } else if (data.isNote) {
      this.playNote(data)
    } else {
      console.warn('Unknown format', data)
    }
  }

  this.parse = function (msg) {
    // Globals
    if (msg.substr(0, 3).toLowerCase() === 'rev') {
      return parseEffect('reverb', msg.substr(4))
    } else if (msg.substr(0, 3).toLowerCase() === 'dis') {
      return parseEffect('distortion', msg.substr(4))
    } else if (msg.substr(0, 3).toLowerCase() === 'cho') {
      return parseEffect('chorus', msg.substr(4))
    } else if (msg.substr(0, 3).toLowerCase() === 'del') {
      return parseEffect('delay', msg.substr(4))
    } else if (msg.substr(0, 3).toLowerCase() === 'fed') {
      return parseEffect('feedback', msg.substr(4))
    } else if (msg.substr(0, 3).toLowerCase() === 'che') {
      return parseEffect('cheby', msg.substr(4))
    } else if (msg.substr(0, 3).toLowerCase() === 'bit') {
      return parseEffect('bitcrusher', msg.substr(4))
    } else if (msg.substr(0, 3).toLowerCase() === 'tre') {
      return parseEffect('tremolo', msg.substr(4))
    }
    // Channels
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
    if (!this.channels[data.channel]) { console.warn(`Unknown Channel: ${data.channel}`); return }
    if (isNaN(data.channel)) { console.warn(`Unknown Channel`); return }
    if (isNaN(data.octave)) { console.warn(`Unknown Octave`); return }

    this.channels[data.channel].triggerAttackRelease(`${data.note}${data.sharp}${data.octave}`, 0.1)

    pilot.terminal.updateChannel(data)
  }

  this.setEnv = function (data) {
    if (!this.channels[data.channel]) { console.warn(`Unknown Channel: ${data.channel}`); return }

    this.channels[data.channel].envelope.attack = data.attack
    this.channels[data.channel].envelope.decay = data.decay
    this.channels[data.channel].envelope.sustain = data.sustain
    this.channels[data.channel].envelope.release = data.release

    pilot.terminal.updateChannel(data)
  }

  this.setEffect = function (data) {
    if (!this.effects[data.name]) { console.warn(`Unknown Effect: ${data.name}`) }

    this.effects[data.name].wet.value = data.wet

    if (data.name === 'reverb') {
      this.effects[data.name].roomSize.value = data.value
    } else if (data.name === 'distortion') {
      this.effects[data.name].distortion = data.value
    } else if (data.name === 'chorus') {
      this.effects[data.name].depth = data.value
    } else if (data.name === 'delay') {
      this.effects[data.name].delayTime.value = data.value
    } else if (data.name === 'feedback') {
      this.effects[data.name].delayTime.value = data.value
    } else if (data.name === 'cheby') {
      this.effects[data.name].order = parseInt(50 * data.value)
    } else if (data.name === 'tremolo') {
      this.effects[data.name].depth = data.value
    } else if (data.name === 'bitcrusher') {
      this.effects[data.name].bits = clamp(data.value, 1, 8)
    }
    pilot.terminal.updateEffect(data)
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

  function parseEffect (name, msg) {
    if (msg.length !== 2) { console.warn(`Misformatted effect`, msg); return }
    const wet = str36int(msg.substr(0, 1)) / 15
    const value = str36int(msg.substr(1, 1)) / 15
    return { isEffect: true, name: name, wet: wet, value: value }
  }

  function int36str (val) { return val.toString(36) }
  function str36int (val) { return parseInt(val, 36) }
  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Synthetiser
