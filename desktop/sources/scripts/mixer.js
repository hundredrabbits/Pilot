'use strict'

const Tone = require('tone')
const Interface = require('./interface')

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
    this.channels[0] = new Interface(0, new Tone.AMSynth({
      'harmonicity': 1.25,
      'oscillator': { 'type': 'sine8' },
      'modulation': { 'type': 'square8' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    }))

    this.channels[1] = new Interface(1, new Tone.AMSynth({
      'harmonicity': 1.5,
      'oscillator': { 'type': 'square8' },
      'modulation': { 'type': 'triangle8' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    }))

    this.channels[2] = new Interface(2, new Tone.AMSynth({
      'harmonicity': 1.75,
      'oscillator': { 'type': 'triangle8' },
      'modulation': { 'type': 'square8' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    }))
    this.channels[3] = new Interface(3, new Tone.AMSynth({
      'harmonicity': 2,
      'oscillator': { 'type': 'square8' },
      'modulation': { 'type': 'sine8' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    }))

    // AM
    this.channels[4] = new Interface(4, new Tone.AMSynth({
      'modulationIndex': 0,
      'oscillator': { 'type': 'sine4' },
      'modulation': { 'type': 'square4' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    }))

    this.channels[5] = new Interface(5, new Tone.AMSynth({
      'modulationIndex': 10,
      'oscillator': { 'type': 'square4' },
      'modulation': { 'type': 'triangle4' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    }))

    this.channels[6] = new Interface(6, new Tone.AMSynth({
      'modulationIndex': 20,
      'oscillator': { 'type': 'triangle4' },
      'modulation': { 'type': 'square4' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    }))

    this.channels[7] = new Interface(7, new Tone.AMSynth({
      'modulationIndex': 40,
      'oscillator': { 'type': 'square4' },
      'modulation': { 'type': 'sine4' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    }))

    // AM
    this.channels[8] = new Interface(8, new Tone.FMSynth({
      'modulationIndex': 0,
      'oscillator': { 'type': 'sine4' },
      'modulation': { 'type': 'square4' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    }))

    this.channels[9] = new Interface(9, new Tone.FMSynth({
      'modulationIndex': 10,
      'oscillator': { 'type': 'square4' },
      'modulation': { 'type': 'triangle4' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    }))

    this.channels[10] = new Interface(10, new Tone.FMSynth({
      'modulationIndex': 20,
      'oscillator': { 'type': 'triangle4' },
      'modulation': { 'type': 'square4' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    }))

    this.channels[11] = new Interface(11, new Tone.FMSynth({
      'modulationIndex': 40,
      'oscillator': { 'type': 'square4' },
      'modulation': { 'type': 'sine4' },
      'envelope': { 'attack': 0, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    }))

    this.channels[12] = new Interface(12, new Tone.MembraneSynth({
      'octaves': 5,
      'oscillator': { 'type': 'sine' },
      'envelope': { 'attack': 0.1, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    }))

    this.channels[13] = new Interface(13, new Tone.MembraneSynth({
      'octaves': 10,
      'oscillator': { 'type': 'sine8' },
      'envelope': { 'attack': 0.1, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    }))

    this.channels[14] = new Interface(14, new Tone.MembraneSynth({
      'octaves': 15,
      'oscillator': { 'type': 'triangle8' },
      'envelope': { 'attack': 0.1, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    }))

    this.channels[15] = new Interface(15, new Tone.MembraneSynth({
      'octaves': 20,
      'oscillator': { 'type': 'square8' },
      'envelope': { 'attack': 0.1, 'decay': 0, 'sustain': 0.5, 'release': 1.0 }
    }))

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

    // Connect all instruments to master
    for (const id in this.channels) {
      this.channels[id].synth.connect(this.masters.volume)
    }

    // Add all instruments to dom
    for (const id in this.channels) {
      this.channels[id].install(this.el)
    }

    host.appendChild(this.el)
  }

  this.start = function () {
    console.log('Synthetiser', 'Starting..')
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
  }
}

module.exports = Mixer
