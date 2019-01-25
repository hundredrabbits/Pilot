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
    synth.triggerAttackRelease(`${note}${octave}`, length, '+0', vel)
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
