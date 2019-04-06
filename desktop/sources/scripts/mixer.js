'use strict'

function Mixer (pilot) {
  this.el = document.createElement('div')
  this.el.id = 'mixer'
  this.display = document.createElement('div')
  this.display.id = 'display'
  this.input = document.createElement('input')

  this.chwr = document.createElement('div')
  this.chwr.className = 'wrapper'
  this.chwr.id = 'chwr'
  this.fxwr = document.createElement('div')
  this.fxwr.className = 'wrapper'
  this.fxwr.id = 'fxwr'
  this.mswr = document.createElement('div')
  this.mswr.className = 'wrapper'
  this.mswr.id = 'mswr'

  this.channels = []
  this.effects = {}
  this.masters = {}

  this.install = function (host) {
    this.el.appendChild(this.display)
    this.el.appendChild(this.input)
    host.appendChild(this.el)

    for (const id in pilot.synthetiser.channels) {
      const el = document.createElement('div')
      el.id = `ch${id}`
      this.channels.push(el)
      this.chwr.appendChild(el)
    }

    for (const id in pilot.synthetiser.effects) {
      const el = document.createElement('div')
      el.id = `fx${id}`
      this.effects[id] = el
      this.fxwr.appendChild(el)
    }
    for (const id in pilot.synthetiser.masters) {
      const el = document.createElement('div')
      el.id = `ms${id}`
      this.masters[id] = el
      this.mswr.appendChild(el)
    }

    this.display.appendChild(this.chwr)
    this.display.appendChild(this.fxwr)
    this.display.appendChild(this.mswr)
  }

  this.start = function () {
    this.updateAll()
    this.input.focus()
  }

  this.updateAll = function () {
    for (const id in this.channels) {
      this.channels[id].innerHTML = this._channel(id, pilot.synthetiser.channels[id])
    }
    for (const id in this.effects) {
      this.effects[id].innerHTML = this._effect(id, pilot.synthetiser.effects[id])
    }
    for (const id in this.masters) {
      this.masters[id].innerHTML = this._master(id, pilot.synthetiser.masters[id])
    }
  }

  this.updateChannel = function (data) {
    if (!data || !this.channels[data.channel]) { return }

    this.channels[data.channel].innerHTML = this._channel(data.channel, data)
    this.channels[data.channel].className = data.isNote === true ? 'note' : 'ctrl'
    setTimeout(() => { this.channels[data.channel].className = '' }, 100)
  }

  this.updateEffect = function (data) {
    if (!data || !this.effects[data.name]) { return }

    this.effects[data.name].innerHTML = this._effect(data.name, data)
    this.effects[data.name].className = 'ctrl'
    setTimeout(() => { this.effects[data.name].className = '' }, 100)
  }

  this.updateMaster = function (data) {
    if (!data || !this.masters[data.name]) { return }

    this.masters[data.name].innerHTML = this._master(data.name, data)
    this.masters[data.name].className = 'ctrl'
    setTimeout(() => { this.masters[data.name].className = '' }, 100)
  }

  this._channel = function (channel, data) {
    const synth = pilot.synthetiser.channels[channel]
    const algo = channel < 4 ? 'AM' : 'FM'
    return `<span><b>${str36(channel).toUpperCase().padEnd(1, '-')}</b> ${this._osc(pilot.synthetiser.channels[channel])} ${this._envelope(synth.envelope)}</span> ${this._octaves(data)}`
  }

  this._osc = function (synth) {
    return `<span>${synth.oscillator ? synth.oscillator._oscillator.type.substr(0, 2) : '--'}/${synth.modulation ? synth.modulation._oscillator.type.substr(0, 2) : '--'}</span>`
  }

  this._envelope = function (env) {
    if (!env) { return '??' }
    return `${to16(env.attack)}${to16(env.decay)}${to16(env.sustain)}${to16(env.release)}`
  }

  this._octaves = function (data) {
    let html = ''
    for (let i = 0; i < 8; i++) {
      html += (data && data.note && i === data.octave ? '<span>' + data.note + '</span>' : '.')
    }
    return html
  }

  this._effect = function (id, data) {
    let html = ''
    html += `<span><b>${id.substr(0, 3).toUpperCase()}</b></span> `
    html += `<span>${to16(pilot.synthetiser.effects[id].wet.value)}${this.read16(id)}</span> `

    for (let i = 0; i < 8; i++) {
      const reach = parseInt(pilot.synthetiser.effects[id].wet.value * 8)
      const longs = this.read(id) * reach
      html += i < longs ? '<span>|</span>' : i < reach ? '|' : '.'
    }

    html += ``
    return html
  }

  this._master = function (id, data) {
    let html = ''
    html += `<span><b>${id.substr(0, 3).toUpperCase()}</b></span> -- `
    for (let i = 0; i < 8; i++) {
      const reach = 0
      html += i < reach ? '<span>|</span>' : '.'
    }

    html += ``
    return html
  }

  this.read16 = function (id) {
    return to16(this.read(id))
  }

  this.read = function (id) {
    if (id === 'reverb') {
      return pilot.synthetiser.effects[id].roomSize.value
    } else if (id === 'distortion') {
      return pilot.synthetiser.effects[id].distortion
    } else if (id === 'chorus') {
      return pilot.synthetiser.effects[id].depth
    } else if (id === 'feedback') {
      return pilot.synthetiser.effects[id].delayTime.value
    } else {
      return 0
    }
  }

  this.validate = function (value) {
    pilot.synthetiser.run(value)
    this.updateAll()
  }

  // Modes

  this.setMode = function (mode) {
    this.el.className = mode ? `${mode}` : ''
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

  function to16 (float) { return str36(Math.floor(float * 15)) }
  function str36 (int) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'][parseInt(int)] }
  function int36 (str) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].indexOf(`${str}`) }
}

module.exports = Mixer
