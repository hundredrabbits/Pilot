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
    this.input.focus()
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
    if (!env || !env.attack) { return '' }
    return `ATK ${env.attack.toFixed(2)} DCA ${env.decay.toFixed(2)} SUS ${env.sustain.toFixed(2)} REL ${env.release.toFixed(2)}`
  }

  this.validate = function (value) {
    pilot.synthetiser.run(value)
    this.update()
  }

  // Events

  this.input.oninput = (e) => {

  }

  this.input.onkeypress = (e) => {
    if (e.keyCode !== 13) { return }
    e.preventDefault()
    this.validate(this.input.value)
    this.input.value = ''
  }
}

module.exports = Terminal
