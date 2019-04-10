'use strict'

const Tone = require('tone')
const ChannelInterface = require('./interface.channel')
const EffectInterface = require('./interface.effect')

function Mixer (pilot) {
  this.el = document.createElement('div')
  this.el.id = 'mixer'

  this.channels = []
  this.effects = { }
  this.masters = {}

  this.install = function (host) {
    console.log('Mixer', 'Installing..')

    Tone.start()
    Tone.Transport.start()

    // AM
    this.channels[0] = new ChannelInterface(pilot, 0, new Tone.AMSynth({ 'harmonicity': 1.25, 'oscillator': { 'type': 'sine8' }, 'modulation': { 'type': 'sine' } }))
    this.channels[1] = new ChannelInterface(pilot, 1, new Tone.AMSynth({ 'harmonicity': 1.5, 'oscillator': { 'type': 'triangle8' }, 'modulation': { 'type': 'sawtooth' } }))
    this.channels[2] = new ChannelInterface(pilot, 2, new Tone.AMSynth({ 'harmonicity': 1.75, 'oscillator': { 'type': 'sawtooth8' }, 'modulation': { 'type': 'triangle' } }))
    this.channels[3] = new ChannelInterface(pilot, 3, new Tone.AMSynth({ 'harmonicity': 2, 'oscillator': { 'type': 'square8' }, 'modulation': { 'type': 'square' } }))
    // AM
    this.channels[4] = new ChannelInterface(pilot, 4, new Tone.AMSynth({ 'harmonicity': 1.25, 'oscillator': { 'type': 'sine4' }, 'modulation': { 'type': 'square8' } }))
    this.channels[5] = new ChannelInterface(pilot, 5, new Tone.AMSynth({ 'harmonicity': 1.5, 'oscillator': { 'type': 'triangle4' }, 'modulation': { 'type': 'sawtooth8' } }))
    this.channels[6] = new ChannelInterface(pilot, 6, new Tone.FMSynth({ 'harmonicity': 1.75, 'modulationIndex': 10, 'oscillator': { 'type': 'sawtooth4' }, 'modulation': { 'type': 'triangle8' } }))
    this.channels[7] = new ChannelInterface(pilot, 7, new Tone.FMSynth({ 'harmonicity': 2, 'modulationIndex': 20, 'oscillator': { 'type': 'square4' }, 'modulation': { 'type': 'sine8' } }))
    // FM
    this.channels[8] = new ChannelInterface(pilot, 8, new Tone.FMSynth({ 'harmonicity': 0.5, 'modulationIndex': 30, 'oscillator': { 'type': 'sine' }, 'modulation': { 'type': 'sawtooth4' } }))
    this.channels[9] = new ChannelInterface(pilot, 9, new Tone.FMSynth({ 'harmonicity': 2.5, 'modulationIndex': 40, 'oscillator': { 'type': 'sine' }, 'modulation': { 'type': 'triangle8' } }))
    this.channels[10] = new ChannelInterface(pilot, 10, new Tone.MonoSynth({ 'volume': -20, oscillator: { 'type': 'sawtooth4' } }))
    this.channels[11] = new ChannelInterface(pilot, 11, new Tone.MonoSynth({ 'volume': -20, oscillator: { 'type': 'sine4' } }))
    // Membrane
    this.channels[12] = new ChannelInterface(pilot, 12, new Tone.MembraneSynth({ 'octaves': 5, 'oscillator': { 'type': 'sine' } }))
    this.channels[13] = new ChannelInterface(pilot, 13, new Tone.MembraneSynth({ 'octaves': 10, 'oscillator': { 'type': 'sawtooth' } }))
    this.channels[14] = new ChannelInterface(pilot, 14, new Tone.MembraneSynth({ 'octaves': 15, 'oscillator': { 'type': 'triangle' } }))
    this.channels[15] = new ChannelInterface(pilot, 15, new Tone.MembraneSynth({ 'octaves': 20, 'oscillator': { 'type': 'square' } }))

    this.effects.bitcrusher = new EffectInterface(pilot, 'bit', new Tone.BitCrusher(4))
    this.effects.distortion = new EffectInterface(pilot, 'dis', new Tone.Distortion(0.05))
    this.effects.autofilter = new EffectInterface(pilot, 'aut', new Tone.AutoFilter())
    this.effects.chorus = new EffectInterface(pilot, 'cho', new Tone.Chorus(4, 2.5, 0.5))
    this.effects.tremolo = new EffectInterface(pilot, 'tre', new Tone.Tremolo())
    this.effects.vibrato = new EffectInterface(pilot, 'vib', new Tone.Vibrato())
    this.effects.reverb = new EffectInterface(pilot, 'rev', new Tone.JCReverb(0))
    this.effects.feedback = new EffectInterface(pilot, 'fee', new Tone.FeedbackDelay(0))

    // Connect
    for (const id in this.channels) {
      this.channels[id].connect(this.effects.bitcrusher.node)
    }

    // Mastering
    this.masters.equalizer = new Tone.EQ3(20, 0, 20)
    this.masters.compressor = new Tone.Compressor(-10, 20)
    this.masters.limiter = new Tone.Limiter(-10)
    this.masters.volume = new Tone.Volume(-6)

    this.effects.bitcrusher.connect(this.effects.distortion.node)
    this.effects.distortion.connect(this.effects.autofilter.node)
    this.effects.autofilter.connect(this.effects.chorus.node)
    this.effects.chorus.connect(this.effects.tremolo.node)
    this.effects.tremolo.connect(this.effects.vibrato.node)
    this.effects.vibrato.connect(this.effects.reverb.node)
    this.effects.reverb.connect(this.effects.feedback.node)
    this.effects.feedback.connect(this.masters.equalizer)

    this.masters.equalizer.connect(this.masters.compressor)
    this.masters.compressor.connect(this.masters.limiter)
    this.masters.limiter.connect(this.masters.volume)
    this.masters.volume.toMaster()

    // Add all instruments to dom
    for (const id in this.channels) {
      this.channels[id].install(this.el)
    }

    // Add all effects to dom
    for (const id in this.effects) {
      this.effects[id].install(this.el)
    }

    host.appendChild(this.el)
  }

  this.start = function () {
    console.log('Synthetiser', 'Starting..')
    for (const id in this.channels) {
      this.channels[id].start()
    }
    for (const id in this.effects) {
      this.effects[id].start()
    }

    // Create Env Presets
    for (const id in this.channels) {
      this.channels[id].setEnv({ isEnv: true,
        attack: 0.001,
        decay: clamp(((8 - (id % 8)) / 8), 0.01, 0.9),
        sustain: clamp(((id % 4) / 4), 0.01, 0.9),
        release: clamp(((id % 6) / 6), 0.01, 0.9)
      })
    }

    this.run()
  }

  this.run = function (msg) {
    // Multi
    if (`${msg}`.indexOf(';') > -1) {
      const parts = `${msg}`.split(';')
      for (const id in parts) {
        this.run(parts[id])
      }
      return
    }
    // Single
    for (const id in this.channels) {
      this.channels[id].run(msg)
    }
    for (const id in this.effects) {
      this.effects[id].run(msg)
    }
    // Special
    if (msg && `${msg}`.substr(0, 3).toLowerCase() === 'bpm') {
      const bpm = parseInt(msg.substr(3))
      if (!isNaN(bpm)) {
        Tone.Transport.bpm.rampTo(bpm, 4)
        console.log(`Changed BPM to ${bpm}.`)
      }
    }
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Mixer
