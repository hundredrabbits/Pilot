'use strict'

function Synth (pilot) {
  const Tone = require('tone')

  this.bpm = 120

  this.install = function () {
  }

  this.start = function () {
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
  }

  this.play = function (channel, octave, note, velocity, length) {
    // const note = convertNote(octave, note)
    // let mnote = Tone.Frequency(note, 'midi').toNote()
    // let noteLength = convertLength(data[4], this.bpm) / 1000
    // let vel = (velocity || 127) / 127
    this.synth.triggerAttackRelease('C4', '8n')
  }

  function convertNote (octave, note) {
    return 24 + (octave * 12) + note // 60 = C3
  }

  function convertLength (val, bpm) {
    return (60000 / bpm) * (val / 15)
  }
}
