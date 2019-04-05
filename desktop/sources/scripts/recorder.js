'use strict'

const { dialog, app } = require('electron').remote
const Tone = require('tone')
const fs = require('fs')

function Recorder (pilot) {
  this.isRecording = false

  let chunks = []

  this.install = function () {
    console.log('Recorder', 'Installing..')

    pilot.synthetiser.hook = Tone.context.createMediaStreamDestination()
    pilot.synthetiser.recorder = new MediaRecorder(pilot.synthetiser.hook.stream)
    pilot.synthetiser.masters.volume.connect(pilot.synthetiser.hook)

    pilot.synthetiser.recorder.onstop = evt => {
      const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
      pilot.recorder.save(blob)
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audio.play()
    }

    pilot.synthetiser.recorder.ondataavailable = evt => {
      chunks.push(evt.data)
    }
  }

  this.start = function () {
    console.log('Recorder', 'Starting..')
    this.isRecording = true
    chunks = []
    pilot.synthetiser.recorder.start()
    pilot.synthetiser.terminal.setMode('recording')
  }

  this.stop = function () {
    console.log('Recorder', 'Stopping..')
    this.isRecording = false
    pilot.synthetiser.recorder.stop()
    pilot.synthetiser.terminal.setMode()
  }

  this.toggle = function () {
    if (this.isRecording !== true) {
      this.start()
    } else {
      this.stop()
    }
  }

  this.save = function (blob) {
    dialog.showSaveDialog({ filters: [{ name: 'Audio File', extensions: ['ogg'] }] }, (path) => {
      if (path === undefined) { return }
      pilot.recorder.write(path, blob)
    })
  }

  this.write = function (path, blob) {
    var reader = new FileReader()

    reader.onload = function () {
      var buffer = new Buffer.from(reader.result)
      fs.writeFile(path, buffer, {}, (err, res) => {
        if (err) { console.error(err); return }
        console.log('Recorder', 'Export complete.')
      })
    }
    reader.readAsArrayBuffer(blob)
  }
}

module.exports = Recorder
