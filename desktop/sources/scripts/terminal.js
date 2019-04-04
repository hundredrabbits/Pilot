'use strict'

function Terminal (pilot) {
  this.el = document.createElement('div')
  this.el.id = 'terminal'

  this.install = function (host) {
    host.appendChild(this.el)
  }

  this.log = function (msg) {
    this.el.innerHTML = `${msg}`
  }

  this.update = function () {
    let html = ''

    for (const id in pilot.synthetiser.channels) {
      html += this._channel(id, pilot.synthetiser.channels[id])
    }

    this.el.innerHTML = html
  }

  this._channel = function (id, data) {
    return `${id}`
  }
}

module.exports = Terminal
