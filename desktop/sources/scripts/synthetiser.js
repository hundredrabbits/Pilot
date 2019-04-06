'use strict'

const Tone = require('tone')

function Synthetiser (pilot) {
  this.channels = []
  this.effects = { }
  this.masters = {}

  this.install = function () {
    Tone.start()
    Tone.Transport.start()

    // AM
    this.channels[0] = new Tone.AMSynth({
      'harmonicity': 1.25,
      'oscillator': { 'type': 'sine8' },
      'modulation': { 'type': 'square8' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    })

    this.channels[1] = new Tone.AMSynth({
      'harmonicity': 1.5,
      'oscillator': { 'type': 'square8' },
      'modulation': { 'type': 'triangle8' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    })

    this.channels[2] = new Tone.AMSynth({
      'harmonicity': 1.75,
      'oscillator': { 'type': 'triangle8' },
      'modulation': { 'type': 'square8' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    })
    this.channels[3] = new Tone.AMSynth({
      'harmonicity': 2,
      'oscillator': { 'type': 'square8' },
      'modulation': { 'type': 'sine8' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    })

    // AM
    this.channels[4] = new Tone.AMSynth({
      'modulationIndex': 0,
      'oscillator': { 'type': 'sine4' },
      'modulation': { 'type': 'square4' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    })
    this.channels[5] = new Tone.AMSynth({
      'modulationIndex': 10,
      'oscillator': { 'type': 'square4' },
      'modulation': { 'type': 'triangle4' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    })
    this.channels[6] = new Tone.AMSynth({
      'modulationIndex': 20,
      'oscillator': { 'type': 'triangle4' },
      'modulation': { 'type': 'square4' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    })
    this.channels[7] = new Tone.AMSynth({
      'modulationIndex': 40,
      'oscillator': { 'type': 'square4' },
      'modulation': { 'type': 'sine4' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    })

    // AM
    this.channels[8] = new Tone.FMSynth({
      'modulationIndex': 0,
      'oscillator': { 'type': 'sine4' },
      'modulation': { 'type': 'square4' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    })
    this.channels[9] = new Tone.FMSynth({
      'modulationIndex': 10,
      'oscillator': { 'type': 'square4' },
      'modulation': { 'type': 'triangle4' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    })
    this.channels[10] = new Tone.FMSynth({
      'modulationIndex': 20,
      'oscillator': { 'type': 'triangle4' },
      'modulation': { 'type': 'square4' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    })
    this.channels[11] = new Tone.FMSynth({
      'modulationIndex': 40,
      'oscillator': { 'type': 'square4' },
      'modulation': { 'type': 'sine4' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    })
    this.channels[12] = new Tone.MembraneSynth({
      'octaves': 5,
      'oscillator': { 'type': 'sine' },
      'envelope': { 'attack': 0.1, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    })
    this.channels[13] = new Tone.MembraneSynth({
      'octaves': 10,
      'oscillator': { 'type': 'sine8' },
      'envelope': { 'attack': 0.1, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    })
    this.channels[14] = new Tone.MembraneSynth({
      'octaves': 15,
      'oscillator': { 'type': 'triangle8' },
      'envelope': { 'attack': 0.1, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    })
    this.channels[15] = new Tone.MembraneSynth({
      'octaves': 20,
      'oscillator': { 'type': 'square8' },
      'envelope': { 'attack': 0.1, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    })

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

    // Turn off all effects
    for (const i in this.effects) {
      this.effects[i].wet.value = 0
    }

    // Connect instruments to distortion
    for (const id in this.channels) {
      const channel = this.channels[id]
      for (const i in this.effects) {
        const effect = this.effects[i]
        channel.connect(this.effects.distortion)
      }
    }

    this.effects.distortion.connect(this.effects.chorus)
    this.effects.chorus.connect(this.effects.reverb)
    this.effects.reverb.connect(this.effects.feedback)
    this.effects.feedback.connect(this.masters.equalizer)
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
    } else if (data.isWav) {
      this.setWav(data)
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
    if (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'a', 'b', 'c', 'd', 'e', 'f', 'g'].indexOf(data.note) < 0) { console.warn(`Unknown Note`); return }

    this.channels[data.channel].triggerAttackRelease(`${data.note}${data.sharp}${data.octave}`, data.length)

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

  this.setWav = function (data) {
    if (!this.channels[data.channel]) { console.warn(`Unknown Channel: ${data.channel}`); return }

    this.channels[data.channel].oscillator._oscillator.set('type', data.value)

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
    const channel = clamp(parseInt(int36(msg.substr(0, 1))), 0, 16)
    const cmd = msg.substr(1, 3).toLowerCase()
    const val = msg.substr(4)
    if (cmd === 'wav') {
      return parseWav(channel, val)
    }
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
    const velocity = 1
    const length = msg.length === 4 ? from16(msg.substr(3, 1)) : 0.1
    return { isNote: true, channel: channel, octave: octave, note: note, sharp: sharp, string: `${octave}${note}`, length: length }
  }

  function parseEnv (channel, msg) {
    if (msg.length !== 4) { console.warn(`Misformatted env`); return }
    const attack = int36(msg.substr(0, 1)) / 15
    const decay = int36(msg.substr(1, 1)) / 15
    const sustain = int36(msg.substr(2, 1)) / 15
    const release = int36(msg.substr(3, 1)) / 15
    return { isEnv: true, channel: channel, attack: attack, decay: decay, sustain: sustain, release: release, string: `env` }
  }

  function parseWav (channel, msg) {
    if (msg.length !== 4) { console.warn(`Misformatted env`); return }
    const value = 'f'
    return { isWav: true, channel: channel, value: value, string: `wav` }
  }

  function parseEffect (name, msg) {
    if (msg.length !== 2) { console.warn(`Misformatted effect`, msg); return }
    const wet = int36(msg.substr(0, 1)) / 15
    const value = int36(msg.substr(1, 1)) / 15
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

  function from16 (str) { return (int36(str) / 15) }
  function to16 (float) { return str36(Math.floor(float * 15)) }
  function str36 (int) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'][parseInt(int)] }
  function int36 (str) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].indexOf(`${str}`.toLowerCase()) }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Synthetiser
