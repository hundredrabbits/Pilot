import Listener from './listener.js'
import Mixer from './mixer.js'
import Recorder from './recorder.js'
import Commander from './commander.js'
import Theme from './lib/theme.js'

const { webFrame } = require('electron')

export default function Pilot () {
  this.listener = null
  this.mixer = null
  this.recorder = null
  this.commander = null
  this.theme = new Theme({ background: '#000000', f_high: '#ffffff', f_med: '#777777', f_low: '#444444', f_inv: '#000000', b_high: '#eeeeee', b_med: '#333', b_low: '#444444', b_inv: '#fff' })

  this.el = document.createElement('div')
  this.el.id = 'pilot'

  this.animate = true

  this.install = function (host) {
    console.info('Pilot is installing..')

    this.mixer = new Mixer(this)
    this.listener = new Listener(this)
    this.recorder = new Recorder(this)
    //this.commander = new Commander(this)

    host.appendChild(this.el)

    this.theme.install()
    this.mixer.install(this.el)
    this.recorder.install(this.el)
    //this.commander.install(this.el)
  }

  this.start = function () {
    console.info('Pilot is starting..')
    this.mixer.start()
    //this.commander.start()
    this.theme.start()

    const zoomFactor = Number(localStorage.getItem('zoomFactor'))
    webFrame.setZoomFactor(zoomFactor)
  }

  this.toggleAnimations = function (mod, set = false) {
    this.animate = this.animate !== true
  }

  this.modZoom = function (mod = 0, set = false) {
    const currentZoomFactor = webFrame.getZoomFactor()
    const newZoomFactor = set ? mod : currentZoomFactor + mod
    webFrame.setZoomFactor(newZoomFactor)
    localStorage.setItem('zoomFactor', newZoomFactor)
  }
}
