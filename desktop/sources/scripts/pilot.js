'use strict'
const { dialog, app } = require('electron').remote
const path = require('path')
const Tone = require('tone')
const _ = require('lodash')
const fileUrl = require('file-url')
const loader = require('./loader')
const create = require('./create')
const defaults = require('./defaults')
const UdpListener = require('./udp/listener')
const butterchurn = require('butterchurn')
const butterchurnPresets = require('butterchurn-presets')
const presets = butterchurnPresets.getPresets()

function Pilot () {
  this.listener = null
  this.manifest = {}
  this.currentViz = 0
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
    this.visualizer = butterchurn.createVisualizer(audioContext, canvas, {
      width: 800,
      height: 600
    })

    this.visualizer.connectAudio(Tone.Master)


    const preset = presets['Flexi, martin + geiss - dedicated to the sherwin maxawow'];
    this.manifest.viz = Object.keys(presets)
    this.visualizer.loadPreset(preset, 0.0); // 2nd argument is the number of seconds to blend presets

    // resize visualizer

    this.visualizer.setRendererSize(1600, 1200);

    // render a frame
    let startRenderer = () => {
      requestAnimationFrame(() => startRenderer());
      this.visualizer.render();
    }
    startRenderer()

    Tone.start()
    Tone.Transport.start()

  }

  this.open = function () {
    let paths = dialog.showOpenDialog(app.win, { title: 'Open Patch Folder', properties: ['openDirectory'] })
    if (!paths || !paths.length) { return console.log('Nothing to load') }
    this.path = paths[0]
    const {channels, manifest} = loader(paths[0])
    this.manifest = manifest
    if (!this.manifest.viz)  this.manifest.viz = Object.keys(presets)
    console.log('this manifest', this.manifest)
    console.log('channelDefns', channels)
    this.setupChannels(channels, paths[0])
    this.vizNext()
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

  this.vizNext = function () {
    let viz = _.get(this.manifest, 'viz', [])
    this.currentViz++
    if (this.currentViz >= viz.length) this.currentViz = 0
    let vizName = viz[this.currentViz]
    if (!vizName) return
    let _preset = presets[vizName]
    this.visualizer.loadPreset(_preset, 0.0); // 2nd argument is the number of seconds to blend presets
  }
  this.vizPrev = function () {
    let viz = _.get(this.manifest, 'viz', [])
    this.currentViz--
    if (this.currentViz < 0) this.currentViz = viz.length - 1
    let vizName = viz[this.currentViz]
    if (!vizName) return
    let _preset = presets[vizName]
    this.visualizer.loadPreset(_preset, 0.0); // 2nd argument is the number of seconds to blend presets
  }
}

module.exports = Pilot
