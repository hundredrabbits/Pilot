'use strict'
const { dialog, app } = require('electron').remote
const path = require('path')
const Tone = require('tone')
const fileUrl = require('file-url')
const loader = require('./loader')
const create = require('./create')
const defaults = require('./defaults')
const UdpListener = require('./udp/listener')
const butterchurn = require('butterchurn')
const butterchurnPresets = require('butterchurn-presets')
// import butterchurn from 'butterchurn'
// import butterchurnPresets from 'butterchurn-presets'

function Pilot () {
  this.listener = null
  this.channels = []
  this.controller = new Controller()

  this.install = function () {
    console.info('Pilot is installing..')
    this.listener = new UdpListener(this)
    this.start()
  }
  this.start = function () {
    console.info('Pilot is starting..')
    // TODO: this path may be weird in a deployed electron app.
    this.setupChannels(defaults, path.resolve('./synths/default'))


    const audioContext = Tone.Master.context
    const canvas = document.getElementById('canvas')
    const visualizer = butterchurn.createVisualizer(audioContext, canvas, {
      width: 800,
      height: 600
    })

    visualizer.connectAudio(Tone.Master)

    const presets = butterchurnPresets.getPresets();
    const preset = presets['Flexi, martin + geiss - dedicated to the sherwin maxawow'];

    visualizer.loadPreset(preset, 0.0); // 2nd argument is the number of seconds to blend presets

    // resize visualizer

    visualizer.setRendererSize(1600, 1200);

    // render a frame
    let startRenderer = () => {
      requestAnimationFrame(() => startRenderer());
      visualizer.render();
    }
    startRenderer()

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
    this.channels.forEach(channel => channel.dispose())

    // create new channels
    let baseUrl = fileUrl(baseDir) + '/'
    this.channels = channelDefns.map(c => create(c, baseUrl))
  }

  this.getChannel = function (channel) {
    return this.channels[channel]
  }
}

module.exports = Pilot
