'use strict'

const Listener = require('./listener')
const Terminal = require('./terminal')
const Synthetiser = require('./synthetiser')

function Pilot () {
  this.listener = null
  this.terminal = null
  this.synthetiser = null
  this.controller = new Controller()

  this.el = document.createElement('div')
  this.el.id = 'pilot'

  this.install = function (host) {
    console.info('Pilot is installing..')

    this.synthetiser = new Synthetiser(this)
    this.terminal = new Terminal(this)
    this.listener = new Listener(this)

    host.appendChild(this.el)
    this.synthetiser.install()
    this.terminal.install(this.el)
  }

  this.start = function () {
    console.info('Pilot is starting..')
    this.synthetiser.start()
    this.terminal.start()
  }
}

module.exports = Pilot
