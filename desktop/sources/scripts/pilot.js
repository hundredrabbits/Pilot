'use strict'
const { dialog, app } = require('electron').remote
const loader = require('./loader')
const create = require('./create')
const defaults = require('./defaults')
const Tone = require('tone')

function Pilot () {
  this.listener = null
  this.channels = []
  this.controller = new Controller()

  this.install = function () {
    console.info('Pilot is installing..')
    this.listener = new Listener(this)
    this.start()
  }
  this.start = function () {
    console.info('Pilot is starting..')
    this.setupChannels(defaults)
    Tone.start()
    Tone.Transport.start()
  }

  this.open = function () {
    let paths = dialog.showOpenDialog(app.win, { title: 'Open Patch Folder', properties: ['openDirectory'] })
    if (!paths || !paths.length) { return console.log('Nothing to load') }
    this.path = paths[0]
    const channelDefns = loader(paths[0])
    this.setupChannels(channelDefns)
  }

  this.setupChannels = function (channelDefns) {
    // dispose old channels
    this.channels.forEach(channel => channel.disconnect() && channel.dispose())
    // create new channels
    this.channels = channelDefns.map(create)
  }

  this.play = function (msg) {
    // FIXME - not the right way to parse
    let channel = Number(msg.toString().substring(0,1))
    let details = this.channels[channel]
    if (!details || !details.synth) return
    let synth = details.synth
    synth.triggerAttackRelease('C4', '8n')
  }
}

module.exports = Pilot
