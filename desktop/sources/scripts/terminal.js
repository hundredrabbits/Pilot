'use strict'

function Terminal (pilot) {
  this.el = document.createElement('div')
  this.el.id = 'terminal'
  this.display = document.createElement('div')
  this.display.id = 'terminal'
  this.input = document.createElement('input')
  this.input.id = 'terminal'

  this.install = function (host) {
    this.el.appendChild(this.display)
    this.el.appendChild(this.input)
    host.appendChild(this.el)
  }

  this.start = function () {
    this.update()
  }

  this.update = function () {
    let html = ''

    for (const id in pilot.synthetiser.channels) {
      html += this._channel(id, pilot.synthetiser.channels[id])
    }

    this.display.innerHTML = html
  }

  this._channel = function (id, data) {
    return `<div>CH${id} | ${this._envelope(data.envelope)}</div>`
  }

  this._envelope = function (env) {
    return `ATK ${env.attack} DCA ${env.decay} SUS ${env.sustain} REL ${env.release}`
  }
}

module.exports = Terminal
