'use strict'

function Pilot () {
  this.synth = null
  this.listener = null

  this.install = function () {
    console.info('Pilot is installing..')

    this.synth = new Synth(this)
    this.listener = new Listener(this)

    this.synth.install()
    this.start()
  }

  this.start = function () {
    console.info('Pilot is starting..')

    this.synth.start()
  }

  this.play = function (msg) {
    console.log(`${msg}`)
    this.synth.play(0, 3, 'C')
  }
}
