const { dialog, app } = require('electron').remote
const Tone = require('tone')
const fs = require('fs')

export default function Recorder (pilot) {
  this.el = document.createElement('div')
  this.el.id = 'recorder'
  this.el.className = 'blink'
  this.el.textContent = '•'
  this.isRecording = false

  let chunks = []

  this.install = function (host) {
    console.log('Recorder', 'Installing..')

    pilot.mixer.hook = Tone.context.createMediaStreamDestination()
    pilot.mixer.recorder = new MediaRecorder(pilot.mixer.hook.stream)
    pilot.mixer.effects.limiter.connect(pilot.mixer.hook)

    pilot.mixer.recorder.onstop = evt => {
      const blob = new Blob(chunks, { type: 'audio/opus; codecs=opus' })
      pilot.recorder.save(blob)
    }

    pilot.mixer.recorder.ondataavailable = evt => {
      chunks.push(evt.data)
    }

    host.appendChild(this.el)
  }

  this.start = function () {
    console.log('Recorder', 'Starting..')
    this.isRecording = true
    chunks = []
    pilot.mixer.recorder.start()
    pilot.el.className = 'recording'
  }

  this.stop = function () {
    if (!this.isRecording) { return }

    console.log('Recorder', 'Stopping..')
    this.isRecording = false
    pilot.mixer.recorder.stop()
    pilot.el.className = ''
  }

  this.toggle = function () {
    if (this.isRecording !== true) {
      this.start()
    } else {
      this.stop()
    }
  }

  this.save = function (blob) {
    dialog.showSaveDialog({ filters: [{ name: 'Audio File', extensions: ['opus'] }] }, (path) => {
      if (path === undefined) { return }
      pilot.recorder.write(path, blob)
    })
  }

  this.write = function (path, blob) {
    const reader = new FileReader()
    reader.onload = function () {
      const buffer = new Buffer.from(reader.result)
      fs.writeFile(path, buffer, {}, (err, res) => {
        if (err) { console.error(err); return }
        console.log('Recorder', 'Export complete.')
      })
    }
    reader.readAsArrayBuffer(blob)
  }
}
