'use strict'
const { dialog, app } = require('electron').remote
const path = require('path')
const Tone = require('tone')
const fileUrl = require('file-url')
const loader = require('./loader')
const create = require('./create')
const defaults = require('./defaults')

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
    // TODO: this path may be weird in a deployed electron app.
    this.setupChannels(defaults, path.resolve('./synths/default'))
    Tone.start()
    Tone.Transport.start()
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

  this.play = function (msg) {
    // FIXME - not the right way to parse
    let _msg = msg.toString()
    let channel = Number(_msg.substring(0,1))
    let octave = _msg.substring(1,2)
    let note = getNote(_msg.substring(2,3))
    let velocity = _msg.substring(3,4) || 'F'
    let vel = (valueOf(velocity) / 36) // vel between 0-Z. more space
    let length = _msg.substring(4,6) || '8n'

    let details = this.channels[channel]
    if (!details || !details.synth) return
    let synth = details.synth

    if (synth._players) {
      let playerName = _msg.substring(1,3)
      let player = synth.get(playerName)
      if (!player) return console.log('no player defined for note', note)
      player.start()
    } else {
      synth.triggerAttackRelease(`${note}${octave}`, length, '+0', vel)
    }
  }
}

const keys = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

function clamp (v, min, max) { return v < min ? min : v > max ? max : v }

function valueOf (g, min, max) {
  if (!min) min = 0
  if (!max) max = 35
  return clamp(keys.indexOf(`${g}`.toUpperCase()), min, max)
}


function getNote(n) {
  let upperCase = n.toUpperCase()
  if (n == upperCase) return n
  // it was lowercase. make sharp
  return `${upperCase}#`
}

module.exports = Pilot
