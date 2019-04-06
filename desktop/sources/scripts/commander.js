'use strict'

function Commander (pilot) {
  this.el = document.createElement('div')
  this.el.id = 'commander'
  this.input = document.createElement('input')

  this.install = function (host) {
    this.el.appendChild(this.input)
    host.appendChild(this.el)
  }

  this.start = function () {

  }

  this.input.oninput = (e) => {

  }

  this.input.onkeypress = (e) => {
    if (e.keyCode !== 13) { return }
    e.preventDefault()
    pilot.mixer.run(this.input.value)
    this.input.value = ''
  }
}

module.exports = Commander
