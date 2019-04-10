'use strict'

const { dialog, app } = require('electron').remote
const Tone = require('tone')
const fs = require('fs')
const os = require('os')
const WaveRecorder = require('wave-recorder')

function Recorder (pilot) {
  this.el = document.createElement('div')
  this.el.id = 'recorder'
  this.el.className = 'blink'
  this.el.textContent = '•'
  this.isRecording = false
  this.recorder = null
  this.filePath = null


  this.install = function (host) {
    console.log('Recorder', 'Installing..')
    host.appendChild(this.el)
  }

  this.start = function () {
    this.filePath =  os.tmpdir() + '/' + Date.now() + '.wav'
    console.log('Recorder', 'Starting..', this.filePath)
    this.isRecording = true
    pilot.el.className = 'recording'

    this.recorder = WaveRecorder(Tone.context, {
      channels: 2,
      bitDepth: 32
    })
    pilot.mixer.masters.volume.connect(this.recorder.input)

    this.tempStream = fs.createWriteStream(this.filePath)
    this.recorder.pipe(this.tempStream)
    this.recorder.on('header', header => {
      let headerStream = fs.createWriteStream(this.filePath, {
        start: 0,
        flags: 'r+'
      })
      headerStream.write(header)
      headerStream.end()
      this.save()
    })
  }

  this.stop = function () {
    console.log('Recorder', 'Stopping..')
    this.isRecording = false
    this.recorder.end()
    pilot.el.className = ''
  }

  this.toggle = function () {
    if (this.isRecording !== true) {
      this.start()
    } else {
      this.stop()
    }
  }

  this.save = function () {
    dialog.showSaveDialog({ filters: [{ name: 'Audio File', extensions: ['wav'] }] }, (path) => {
      if (path === undefined) { return }
      // move the file
      fs.rename(this.filePath, path, (err) =>{
        if (err) { console.error(err); return }
        console.log('Recorder', 'Export complete.')
        this.filePath = null
        this.recorder = null
      })
    })
  }
}

module.exports = Recorder
