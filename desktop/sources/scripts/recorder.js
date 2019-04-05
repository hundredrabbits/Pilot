'use strict'

function Recorder (pilot) {
  this.isRecording = false
  this.audio = new Audio()

  let chunks = []

  this.install = function () {
    console.log('Recorder', 'Installing..')

    pilot.synthetiser.hook = Tone.context.createMediaStreamDestination()
    pilot.synthetiser.recorder = new MediaRecorder(hook.stream)
    pilot.synthetiser.masters.volume.connect(this.hook)

    pilot.synthetiser.recorder.onstop = evt => {
      let blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
      audio.src = URL.createObjectURL(blob)
    }

    pilot.synthetiser.recorder.ondataavailable = evt => {
      chunks.push(evt.data)
    }
  }

  this.start = function () {
    console.log('Recorder', 'Starting..')
    console.log(pilot.synthetiser.recorder)
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
