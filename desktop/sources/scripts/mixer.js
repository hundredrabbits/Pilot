import SynthInterface from './interface.synth.js'
import SampleInterface from './interface.sample.js'
import EffectInterface from './interface.effect.js'
import DrumInterface from './interface.drum.js'

const Tone = require('tone')

export default function Mixer (pilot) {
  this.el = document.createElement('div')
  this.el.id = 'mixer'
  this.synth_head_div = document.createElement('div')
  this.synth_head_div.id = 'synth_head'
  this.synth_head = document.createElement('span')
  this.synth_head.className = 'cid'
  this.synth_head.innerHTML = 'Synths(;)'
  this.synth_head_div.appendChild(this.synth_head)
  this.el.appendChild(this.synth_head_div)
  this.effect_head_div = document.createElement('div')
  this.effect_head_div.id = 'effect_head'
  this.effect_head = document.createElement('span')
  this.effect_head.className = 'cid'
  this.effect_head.innerHTML = 'Effects(=)'
  this.effect_head_div.appendChild(this.effect_head)
  this.el.appendChild(this.effect_head_div)

  this.channels = []
  this.effects = {}
  this.effects_map = []
  this.mediaDir = '/media'

  this.install = function (host) {
    console.log('Mixer', 'Installing..')

    Tone.start()
    Tone.Transport.start()

    // AM
    this.channels[0] = new SynthInterface(pilot, 0, new Tone.AMSynth({ 'harmonicity': 1.25, 'oscillator': { 'type': 'sine8' }, 'modulation': { 'type': 'sine' } }))
    this.channels[1] = new SynthInterface(pilot, 1, new Tone.AMSynth({ 'harmonicity': 1.5, 'oscillator': { 'type': 'triangle8' }, 'modulation': { 'type': 'sawtooth' } }))
    this.channels[2] = new SynthInterface(pilot, 2, new Tone.AMSynth({ 'harmonicity': 1.75, 'oscillator': { 'type': 'sawtooth8' }, 'modulation': { 'type': 'triangle' } }))
    this.channels[3] = new SynthInterface(pilot, 3, new Tone.AMSynth({ 'harmonicity': 2, 'oscillator': { 'type': 'square8' }, 'modulation': { 'type': 'square' } }))
    // AM
    this.channels[4] = new SynthInterface(pilot, 4, new Tone.AMSynth({ 'harmonicity': 1.25, 'oscillator': { 'type': 'sine4' }, 'modulation': { 'type': 'square8' } }))
    this.channels[5] = new SynthInterface(pilot, 5, new Tone.AMSynth({ 'harmonicity': 1.5, 'oscillator': { 'type': 'triangle4' }, 'modulation': { 'type': 'sawtooth8' } }))
    this.channels[6] = new SynthInterface(pilot, 6, new Tone.FMSynth({ 'harmonicity': 1.75, 'modulationIndex': 10, 'oscillator': { 'type': 'sawtooth4' }, 'modulation': { 'type': 'triangle8' } }))
    this.channels[7] = new SynthInterface(pilot, 7, new Tone.FMSynth({ 'harmonicity': 2, 'modulationIndex': 20, 'oscillator': { 'type': 'square4' }, 'modulation': { 'type': 'sine8' } }))
    // FM
    this.channels[8] = new SynthInterface(pilot, 8, new Tone.FMSynth({ 'harmonicity': 0.5, 'modulationIndex': 30, 'oscillator': { 'type': 'sine' }, 'modulation': { 'type': 'sawtooth4' } }))
    this.channels[9] = new SynthInterface(pilot, 9, new Tone.FMSynth({ 'harmonicity': 2.5, 'modulationIndex': 40, 'oscillator': { 'type': 'sine' }, 'modulation': { 'type': 'triangle8' } }))
    this.channels[10] = new SynthInterface(pilot, 10, new Tone.MonoSynth({ 'volume': -20, oscillator: { 'type': 'sawtooth4' } }))
    this.channels[11] = new SynthInterface(pilot, 11, new Tone.MonoSynth({ 'volume': -20, oscillator: { 'type': 'sine4' } }))
    // Membrane
    this.channels[12] = new SynthInterface(pilot, 12, new Tone.MembraneSynth({ 'octaves': 5, 'oscillator': { 'type': 'sine' } }))
    this.channels[13] = new SynthInterface(pilot, 13, new Tone.MembraneSynth({ 'octaves': 10, 'oscillator': { 'type': 'sawtooth' } }))
    this.channels[14] = new SynthInterface(pilot, 14, new Tone.MembraneSynth({ 'octaves': 15, 'oscillator': { 'type': 'triangle' } }))
    this.channels[15] = new SynthInterface(pilot, 15, new Tone.MembraneSynth({ 'octaves': 20, 'oscillator': { 'type': 'square' } }))

    // Poly
    this.channels[16] = new SynthInterface(pilot, 16, new Tone.PolySynth())

    // I
    this.effects.bitcrusher = new EffectInterface(pilot, 'bit', 0, new Tone.BitCrusher(4))
    this.effects.distortion = new EffectInterface(pilot, 'dis', 1, new Tone.Distortion(0.05))
    this.effects.autowah = new EffectInterface(pilot, 'wah', 2, new Tone.AutoWah(100, 6, 0))
    this.effects.chebyshev = new EffectInterface(pilot, 'che', 3, new Tone.Chebyshev(50))
    // II
    this.effects.feedback = new EffectInterface(pilot, 'fee', 4, new Tone.FeedbackDelay(0))
    this.effects.delay = new EffectInterface(pilot, 'del', 5, new Tone.PingPongDelay('4n', 0.2))
    this.effects.tremolo = new EffectInterface(pilot, 'tre', 6, new Tone.Tremolo())
    this.effects.reverb = new EffectInterface(pilot, 'rev', 7, new Tone.JCReverb(0))
    // III
    this.effects.phaser = new EffectInterface(pilot, 'pha', 8, new Tone.Phaser(0.5, 3, 350))
    this.effects.vibrato = new EffectInterface(pilot, 'vib', 9, new Tone.Vibrato())
    this.effects.chorus = new EffectInterface(pilot, 'cho', 10, new Tone.Chorus(4, 2.5, 0.5))
    this.effects.widener = new EffectInterface(pilot, 'ste', 11, new Tone.StereoWidener(0.5, 3, 350))
    // Mastering
    this.effects.equalizer = new EffectInterface(pilot, 'equ', 12, new Tone.EQ3(5, 0, 5))
    this.effects.compressor = new EffectInterface(pilot, 'com', 13, new Tone.Compressor(-6, 4))
    this.effects.volume = new EffectInterface(pilot, 'vol', 14, new Tone.Volume(6))
    this.effects.limiter = new EffectInterface(pilot, 'lim', 15, new Tone.Limiter(-2))

    // Samples
    this.parts = ['tr808', 'tr909', 'dmx', 'dnb', 'dmg', 'dark', 'deep', 'tech', 'modular', 'gabber', 'bergh', 'vermona', 'commodore']
    for (let i = 0; i < this.parts.length; i++) {
      this.channels[17+i] = new SampleInterface(pilot, 17+i, new Tone.Sampler(), this.parts[i])
      this.effects[this.parts[i]] = new DrumInterface(pilot, 17+i, this.parts[i])
      this.effects[this.parts[i]].connect(this.effects.bitcrusher.node)
    }

    // Connect
    for (const id in this.channels) {
      this.channels[id].connect(this.effects.bitcrusher.node)
    }

    this.effects.bitcrusher.connect(this.effects.distortion.node)
    this.effects.distortion.connect(this.effects.autowah.node)
    this.effects.autowah.connect(this.effects.chebyshev.node)
    this.effects.chebyshev.connect(this.effects.feedback.node)

    this.effects.feedback.connect(this.effects.delay.node)
    this.effects.delay.connect(this.effects.tremolo.node)
    this.effects.tremolo.connect(this.effects.reverb.node)
    this.effects.reverb.connect(this.effects.phaser.node)

    this.effects.phaser.connect(this.effects.vibrato.node)
    this.effects.vibrato.connect(this.effects.chorus.node)
    this.effects.chorus.connect(this.effects.widener.node)
    this.effects.widener.connect(this.effects.equalizer.node)

    this.effects.equalizer.connect(this.effects.compressor.node)
    this.effects.compressor.connect(this.effects.volume.node)
    this.effects.volume.connect(this.effects.limiter.node)

    // Add all instruments to dom
    for (const id in this.channels) {
      this.channels[id].install(this.el)
    }
    
    // Add all effects to dom
    for (const id in this.effects) {
      this.effects[id].install(this.el)
      this.effects_map[this.effects[id].index] = this.effects[id]
    }

    this.sample_head_div = document.createElement('div')
    this.sample_head_div.className = 'channel'
    this.sample_head_div.style.setProperty('--id', 17)
    this.sample_head = document.createElement('span')
    this.sample_head.className = 'cid'
    this.sample_head.innerHTML = 'Sampler(;)'
    this.sample_head_div.appendChild(this.sample_head)
    this.el.appendChild(this.sample_head_div)  
    this.drum_head_div = document.createElement('div')
    this.drum_head_div.className = 'effect'
    this.drum_head_div.style.setProperty('--id', 17)
    this.drum_head = document.createElement('span')
    this.drum_head.className = 'cid'
    this.drum_head.innerHTML = 'Drums(=)'
    this.drum_head_div.appendChild(this.drum_head)
    this.el.appendChild(this.drum_head_div)  

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

    // Set to Presets
    this.reset()

    this.setSpeed(120)
    setTimeout(() => { this.effects.limiter.node.toMaster() }, 2000)
  }

  this.run_note = function (msg) {
    // Multi
    if (`${msg}`.indexOf(';') > -1) {
      const parts = `${msg}`.split(';')
      for (const id in parts) {
        this.run_note(parts[id])
      }
      return
    }
    // Special
    if (msg && `${msg}`.substr(0, 3).toLowerCase() === 'bpm') {
      this.setSpeed(msg.substr(3))
    } else if (msg && `${msg}`.substr(0, 5).toLowerCase() === 'reset') {
      this.reset()
    } else if (msg && `${msg}`.substr(0, 4).toLowerCase() === 'renv') {
      for (const id in this.channels) {
        this.channels[id].randEnv()
      }
    } else if (msg && `${msg}`.substr(0, 4).toLowerCase() === 'rosc') {
      for (const id in this.channels) {
        this.channels[id].randOsc()
      }
    } else {
      // Single
      const id = int36(`${msg}`.substr(0, 1))
      if (this.channels[id]) {
        this.channels[id].run(`${msg}`.substr(1))
      }
    }
  }

  this.run_effect = function (msg) {
    // Multi
    if (`${msg}`.indexOf(';') > -1) {
      const parts = `${msg}`.split(';')
      for (const id in parts) {
        this.run_effect(parts[id])
      }
      return
    }
    // Special
    if (msg && `${msg}`.substr(0, 3).toLowerCase() === 'bpm') {
      this.setSpeed(msg.substr(3))
    } else if (msg && `${msg}`.substr(0, 5).toLowerCase() === 'reset') {
      this.reset()
    } else if (msg && `${msg}`.substr(0, 4).toLowerCase() === 'refx') {
      for (const id in this.effects) {
        this.effects[id].rand(msg)
      }
    } else {
      const id = int36(`${msg}`.substr(0, 1))
      if (this.effects_map[id]) {
        this.effects_map[id].run(`${msg}`.substr(1))
      }  
    }
  }

  this.setSpeed = function (bpm) {
    if (parseInt(bpm) < 30) { return }
    Tone.Transport.bpm.rampTo(parseInt(bpm), 4)
    console.log(`Changed BPM to ${bpm}.`)
    pilot.recorder.el.innerHTML = `${bpm}`
  }

  this.reset = function () {
    // Return to Env Presets
    for (const id in this.channels) {
      this.channels[id].reset()
    }
    // Return to Osc Presets
    this.run_note('0OSC8ISI;1OSC8RSW;2OSC8WTR;3OSC8QSQ;4OSC4I8Q;5OSC4R8W;6OSCTR8R;7OSCTR8I;8OSCTR4W;9OSCTR8R;AOSC4W--;BOSC4I--;COSCSI--;DOSCSW--;EOSCTR--;FOSCSQ--;GOSC8ISI')
    // Return to Effects Presets
    this.run_effect('007;100;20F;307;400;607;700;80F;901;A07')
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
  function int36 (str) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].indexOf(`${str.toLowerCase()}`) }
}
