'use strict'

function Interface (id, synth) {
  this.el = document.createElement('div')
  this.el.id = `ch${id}`

  this.cid_el = document.createElement('span')
  this.cid_el.className = `cid`
  this.env_el = document.createElement('span')
  this.env_el.className = `env`
  this.osc_el = document.createElement('span')
  this.osc_el.className = `osc`
  this.wav_el = document.createElement('span')
  this.wav_el.className = `wav`
  this.mod_el = document.createElement('span')
  this.mod_el.className = `mod`
  this.oct_el = document.createElement('span')
  this.oct_el.className = `oct`

  this.synth = synth

  this.install = function (host) {
    this.cid_el.innerHTML = `${str36(id)}`

    this.el.appendChild(this.cid_el)
    this.el.appendChild(this.env_el)
    this.osc_el.appendChild(this.wav_el)
    this.osc_el.appendChild(this.mod_el)
    this.el.appendChild(this.osc_el)
    this.el.appendChild(this.oct_el)

    host.appendChild(this.el)
  }

  this.run = function (msg) {
    console.log(msg)
    this.update()
  }

  this.update = function () {
    this.updateEnv()
    this.updateOsc()
    this.updateOct()
  }

  this.updateEnv = function () {
    this.env_el.innerHTML = `${to16(this.synth.envelope.attack)}${to16(this.synth.envelope.decay)}${to16(this.synth.envelope.sustain)}${to16(this.synth.envelope.release)}`
  }

  this.updateOsc = function () {
    this.wav_el.innerHTML = `${this.synth.oscillator ? this.synth.oscillator._oscillator.type.substr(0, 2) : '--'}`
    this.mod_el.innerHTML = `${this.synth.modulation ? this.synth.modulation._oscillator.type.substr(0, 2) : '--'}`
  }

  this.updateOct = function (data) {
    let html = ''
    for (let i = 0; i < 8; i++) {
      html += (data && data.note && i === data.octave ? '<span>' + data.note + '</span>' : '.')
    }
    this.oct_el.innerHTML = html
  }

  function to16 (float) { return str36(Math.floor(float * 15)) }
  function str36 (int) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'][parseInt(int)] }
  function int36 (str) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].indexOf(`${str}`) }
}

module.exports = Interface
