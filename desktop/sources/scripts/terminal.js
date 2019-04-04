'use strict'

function Terminal (pilot) {
  this.el = document.createElement('div')
  this.el.id = 'terminal'
  this.display = document.createElement('div')
  this.display.id = 'display'
  this.input = document.createElement('input')
  this.input.setAttribute('placeholder', '>')
  const spacer = '.'

  this.channels = []

  this.install = function (host) {
    this.el.appendChild(this.display)
    this.el.appendChild(this.input)
    host.appendChild(this.el)

    for (const id in pilot.synthetiser.channels) {
      const el = document.createElement('div')
      el.id = `ch${id}`
      this.channels.push(el)
      this.display.appendChild(el)
    }
  }

  this.start = function () {
    this.update()
    this.input.focus()
  }

  this.update = function (data) {
    if (!data || !this.channels[data.channel]) { return }

    const synth = pilot.synthetiser.channels[data.channel]

    this.channels[data.channel].innerHTML = this._channel(data.channel, synth, data.string)
    this.channels[data.channel].className = data.isNote === true ? 'note' : 'ctrl'
    setTimeout(() => { this.channels[data.channel].className = '' }, 50)
  }

  this._channel = function (ch, synth, msg = '') {
    return `<span><b>${str36(ch).toUpperCase().padEnd(1, '-')}</b></span>${spacer}<span>${this._envelope(synth.envelope)}</span>${spacer}<span>${msg}</span>`
  }

  this._envelope = function (env) {
    if (!env) { return '??' }
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
