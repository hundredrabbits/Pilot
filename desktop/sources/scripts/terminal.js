'use strict'

function Terminal (pilot) {
  this.el = document.createElement('div')
  this.el.id = 'terminal'
  this.display = document.createElement('div')
  this.display.id = 'terminal'
  this.input = document.createElement('input')
  this.input.id = 'terminal'
  this.input.setAttribute('placeholder', '>')
  const spacer = ' | '

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
    let html = `<div><span>#</span>${spacer}<span>ENV </span>${spacer}<span>VOL</span>${spacer}</div>`

    for (const id in pilot.synthetiser.channels) {
      html += this._channel(id, pilot.synthetiser.channels[id])
    }

    this.display.innerHTML = html
  }

  this._channel = function (id, data) {
    return `<div><span><b>${str36(id).toUpperCase().padEnd(1, '-')}</b></span>${spacer}<span>${this._envelope(data.envelope)}</span>${spacer}</div>`
  }

  this._envelope = function (env) {
    if (!env || !env.attack) { return '' }
    return `${str36(Math.floor(env.attack * 15))}${str36(Math.floor(env.decay * 15))}${str36(Math.floor(env.sustain * 15))}${str36(Math.floor(env.release * 15))}`
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

  function str36 (int) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'][parseInt(int)] }
  function int36 (str) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].indexOf(`${str}`) }
}

module.exports = Terminal
