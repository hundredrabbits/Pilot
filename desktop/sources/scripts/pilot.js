'use strict'
const { dialog, app } = require('electron').remote
const path = require('path')
const Tone = require('tone')
const fileUrl = require('file-url')
const loader = require('./loader')
const create = require('./create')
const defaults = require('./defaults')

const Listener = require('./listener')
const Terminal = require('./terminal')

function Pilot () {
  this.listener = null
  this.controller = new Controller()
  this.terminal = null

  this.el = document.createElement('div')
  this.el.id = 'pilot'

  this.install = function (host) {
    console.info('Pilot is installing..')

    this.terminal = new Terminal(this)
    this.listener = new Listener(this)

    host.appendChild(this.el)
    this.terminal.install(this.el)
  }

  this.start = function () {
    console.info('Pilot is starting..')
    Tone.start()
    Tone.Transport.start()
  }

  this.read = function (msg) {
    this.terminal.log(msg)
  }

  this.open = function () {
    let paths = dialog.showOpenDialog(app.win, { title: 'Open Patch Folder', properties: ['openDirectory'] })
    if (!paths || !paths.length) { return console.log('Nothing to load') }
    this.path = paths[0]
    const channelDefns = loader(paths[0])
    this.setupChannels(channelDefns, paths[0])
  }

  this.setupChannels = function (channelDefns, baseDir) {
    // dispose old channels
    this.channels.forEach(channel => channel.disconnect() && channel.dispose())

    // create new channels
    let baseUrl = fileUrl(baseDir) + '/'
    this.channels = channelDefns.map(c => create(c, baseUrl))
  }

  this.getChannel = function (channel) {
    return this.channels[channel]
  }
}

module.exports = Pilot
