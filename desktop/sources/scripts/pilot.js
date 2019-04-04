'use strict'

const { dialog, app } = require('electron').remote
const path = require('path')
<<<<<<< HEAD

=======
const Tone = require('tone')
const _ = require('lodash')
>>>>>>> master
const fileUrl = require('file-url')
const loader = require('./loader')
const create = require('./create')
const defaults = require('./defaults')
<<<<<<< HEAD

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
=======
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
>>>>>>> master

    host.appendChild(this.el)
    this.terminal.install(this.el)
  }

  this.start = function () {
    console.info('Pilot is starting..')
    this.synthetiser.start()
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
