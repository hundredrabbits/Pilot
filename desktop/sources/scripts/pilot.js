'use strict'

const Listener = require('./listener')
const Terminal = require('./terminal')
const Synthetiser = require('./synthetiser')
const Recorder = require('./recorder')

function Pilot () {
  this.listener = null
  this.terminal = null
  this.synthetiser = null
  this.recorder = null
  this.controller = new Controller()
  this.theme = new Theme({ background: '#000000', f_high: '#ffffff', f_med: '#777777', f_low: '#444444', f_inv: '#000000', b_high: '#eeeeee', b_med: '#72dec2', b_low: '#444444', b_inv: '#ffb545' })

  this.el = document.createElement('div')
  this.el.id = 'pilot'

  this.install = function (host) {
    console.info('Pilot is installing..')

    this.synthetiser = new Synthetiser(this)
    this.terminal = new Terminal(this)
    this.listener = new Listener(this)
    this.recorder = new Recorder(this)

    host.appendChild(this.el)
    this.theme.install()
    this.synthetiser.install()
    this.terminal.install(this.el)
  }

  this.start = function () {
    console.info('Pilot is starting..')
    this.synthetiser.start()
    this.terminal.start()
    this.theme.start()
  }
}

module.exports = Pilot
