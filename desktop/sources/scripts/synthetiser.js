'use strict'

const Tone = require('tone')

function Synthetiser (pilot) {
  this.channels = []
  this.effects = { }
  this.masters = {}

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
    this.effects.distortion = new Tone.Distortion(0)
    this.effects.chorus = new Tone.Chorus(4, 2.5, 0.5)
    this.effects.reverb = new Tone.JCReverb(0)
    this.effects.feedback = new Tone.FeedbackDelay(0.5)

    // Mastering
    this.masters.equalizer = new Tone.EQ3(2, -2, 3)
    this.masters.compressor = new Tone.Compressor(-30, 3)
    this.masters.limiter = new Tone.Limiter(-12)
    this.masters.volume = new Tone.Volume(-12)

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
      this.effects[i].connect(this.masters.equalizer)
      this.effects[i].wet.value = 0
    }

    this.masters.equalizer.connect(this.masters.compressor)
    this.masters.compressor.connect(this.masters.limiter)
    this.masters.limiter.connect(this.masters.volume)
    this.masters.volume.toMaster()
  }

  this.start = function () {

  }

  this.run = function (msg) {
    if (msg.indexOf(';') > -1) { this.multi(msg); return }
    const data = parse(`${msg}`)
    if (!data) { console.warn(`Unknown data`); return }

    if (data.isEffect) {
      this.setEffect(data)
    } else if (data.isMaster) {
      this.setMaster(data)
    } else if (data.isEnv) {
      this.setEnv(data)
    } else if (data.isNote) {
      this.playNote(data)
    } else {
      console.warn('Unknown format', data)
    }
  }

  this.multi = function (msg) {
    const parts = msg.split(';')
    for (const id in parts) {
      this.run(parts[id])
    }
  }

  // Operations

  this.playNote = function (data, msg) {
    if (!this.channels[data.channel]) { console.warn(`Unknown Channel: ${data.channel}`); return }
    if (isNaN(data.channel)) { console.warn(`Unknown Channel`); return }
    if (isNaN(data.octave)) { console.warn(`Unknown Octave`); return }
    if(['A','B','C','D','E','F','G','a','b','c','d','e','f','g'].indexOf(data.note) < 0){ console.warn(`Unknown Note`); return}
    
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
    } else if (data.name === 'feedback') {
      this.effects[data.name].delayTime.value = data.value
    }
    pilot.terminal.updateEffect(data)
  }

  this.setMaster = function (data) {
    if (!this.masters[data.name]) { console.warn(`Unknown Master: ${data.name}`) }

    if (data.name === 'volume') {
      console.log(data.value)
      // this.masters[data.name].unmutedVolume = data.value
    }
    pilot.terminal.updateMaster(data)
  }

  // Parsers

  function parse (msg) {
    // Effect
    const effect = isEffect(msg)
    if (effect) {
      return parseEffect(effect, msg.substr(3))
    }

    // Master
    const master = isMaster(msg)
    if (master) {
      return parseMaster(master, msg.substr(3))
    }

    // Channel
    const channel = clamp(parseInt(str36int(msg.substr(0, 1))), 0, 16)
    const cmd = msg.substr(1, 3).toLowerCase()
    const val = msg.substr(4)
    if (cmd === 'env') {
      return parseEnv(channel, val)
    }

    return parseNote(channel, msg.substr(1))
  }

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

  function parseMaster (name, msg) {
    if (msg.length !== 1) { console.warn(`Misformatted master`, msg); return }
    const wet = str36int(msg.substr(0, 1)) / 15
    return { isMaster: true, name: name, wet: wet }
  }

  function isEffect (msg) {
    const cmd = msg.substr(0, 3).toLowerCase()
    return { rev: 'reverb', dis: 'distortion', cho: 'chorus', fee: 'feedback' }[cmd]
  }

  function isMaster (msg) {
    const cmd = msg.substr(0, 3).toLowerCase()
    return { equ: 'equalizer', com: 'compressor', lim: 'limiter', vol: 'volume' }[cmd]
  }

  function int36str (val) { return val.toString(36) }
  function str36int (val) { return parseInt(val, 36) }
  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Synthetiser
