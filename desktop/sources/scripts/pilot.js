'use strict'

const { dialog, app } = require('electron').remote
const path = require('path')

const fileUrl = require('file-url')
const loader = require('./loader')
const create = require('./create')
const defaults = require('./defaults')

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
    this.terminal.install(this.el)
  }

  this.start = function () {
    console.info('Pilot is starting..')
    this.synthetiser.start()
  }
}

module.exports = Pilot
