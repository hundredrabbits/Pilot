'use strict'

function Pilot () {
  const Tone = require('tone')

  this.install = function () {
    console.info('Pilot is installing..')
    this.start()
  }

  this.start = function () {
    console.info('Pilot is starting..')
    Tone.start()
    Tone.Transport.start()

    this.synth = new Tone.AMSynth({
      'harmonicity': 2.5,
      'oscillator': {
        'type': 'fatsawtooth'
      },
      'envelope': {
        'attack': 0.1,
        'decay': 0.2,
        'sustain': 0.2,
        'release': 0.3
      },
      'modulation': {
        'type': 'square'
      },
      'modulationEnvelope': {
        'attack': 0.5,
        'decay': 0.01
      }
    }).toMaster()

    this.listen()
  }

  this.listen = function () {
    console.info('Pilot is listening..')
  }

  this.play = function () {
    let mnote = Tone.Frequency(note, 'midi').toNote()
    let noteLength = convertLength(data[4], terminal.bpm) / 1000
    let vel = (velocity || 127) / 127
    this.synth.triggerAttackRelease(mnote, noteLength, '+0', vel)
  }
}
