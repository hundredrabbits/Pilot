'use strict'

function Interface (id, synth) {
  this.el = document.createElement('div')
  this.el.id = `ch${id}`

  this.cid_el = document.createElement('span')
  this.cid_el.className = `cid`
  this.env_el = document.createElement('span')
  this.env_el.className = `env`
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
    this.el.appendChild(this.wav_el)
    this.el.appendChild(this.mod_el)
    this.el.appendChild(this.oct_el)

    host.appendChild(this.el)
  }

  this.run = function (msg) {
    console.log(msg)
    this.update()
  }

  this.update = function () {
    this.updateEnv()
  }

  this.updateEnv = function () {
    this.env_el.innerHTML = `${to16(this.synth.envelope.attack)}${to16(this.synth.envelope.decay)}${to16(this.synth.envelope.sustain)}${to16(this.synth.envelope.release)}`
  }

  function to16 (float) { return str36(Math.floor(float * 15)) }
  function str36 (int) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'][parseInt(int)] }
  function int36 (str) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].indexOf(`${str}`) }
}

module.exports = Interface
