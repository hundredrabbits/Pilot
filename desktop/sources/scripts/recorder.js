'use strict'

const Tone = require('tone')

function Recorder (pilot) {
  this.isRecording = false

  const audio = new Audio()
  let chunks = []

  this.install = function () {
    console.log('Recorder', 'Installing..')

    pilot.synthetiser.hook = Tone.context.createMediaStreamDestination()
    pilot.synthetiser.recorder = new MediaRecorder(pilot.synthetiser.hook.stream)
    pilot.synthetiser.masters.volume.connect(pilot.synthetiser.hook)

    pilot.synthetiser.recorder.onstop = evt => {
      let blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
      audio.src = URL.createObjectURL(blob)
      console.log(blob)
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
  }

  this.stop = function () {
    console.log('Recorder', 'Stopping..')
    this.isRecording = false
    pilot.synthetiser.recorder.stop()
  }

  this.toggle = function () {
    if (this.isRecording !== true) {
      this.start()
    } else {
      this.stop()
    }
  }

  this.xxxx = function () {
    recorder.start()

    setTimeout(() => { recorder.stop() }, 2000)
  }
}

module.exports = Recorder
