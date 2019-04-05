'use strict'

function Recorder (pilot) {
  this.isRecording = false

  this.install = function () {
    console.log('Recorder', 'Installing..')
  }

  this.start = function () {
    console.log('Recorder', 'Starting..')
    this.isRecording = true
  }

  this.stop = function () {
    console.log('Recorder', 'Stopping..')
    this.isRecording = false
  }

  this.toggle = function () {
    if (this.isRecording !== true) {
      this.start()
    } else {
      this.stop()
    }
  }
}

module.exports = Recorder
