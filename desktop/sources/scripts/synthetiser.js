'use strict'

const Tone = require('tone')

function Synthetiser (pilot) {

  this.synths = []
  this.synth = null

  this.install = function () {
    Tone.start()
    Tone.Transport.start()

    this.synth = new Tone.FMSynth().toMaster()
  }

  this.start = function () {

  }

  this.run = function (msg) {
    const data = this.parse(`${msg}`)
    this.operate(data)
    pilot.terminal.log(data)
  }

  this.parse = function(str){
    return {type:'play', id:'C5'}
  }

  this.operate = function(data){
    this.synth.triggerAttackRelease('C5', 0.1)
  }

  this.operate = function(data) {
    if(data.type === 'play') {
      this.play(data)
    }
  }

  this.play = function(data){
    this.synth.triggerAttackRelease(data.id, 0.1)
  }
}

module.exports = Synthetiser
