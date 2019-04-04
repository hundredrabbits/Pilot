'use strict'

const Tone = require('tone')

function Synthetiser (pilot) {
  this.install = function () {
    Tone.start()
    Tone.Transport.start()
  }

  this.start = function () {

  }

  this.run = function (msg) {
    pilot.terminal.log(msg)
  }
}

module.exports = Synthetiser
