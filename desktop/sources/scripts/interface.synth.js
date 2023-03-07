import ChannelInterface from './interface.channel.js'
import {str36,int36,to16,clamp} from './interface.js'
'use strict'

const Tone = require('tone')

const WAVCODES = ['si', 'tr', 'sq', 'sw', '2i', '2r', '2q', '2w', '4i', '4r', '4q', '4w', '8i', '8r', '8q', '8w']
const WAVNAMES = ['sine', 'triangle', 'square', 'sawtooth', 'sine2', 'triangle2', 'square2', 'sawtooth2', 'sine4', 'triangle4', 'square4', 'sawtooth4', 'sine8', 'triangle8', 'square8', 'sawtooth8']

export default function SynthInterface (pilot, id, node) {
  ChannelInterface.call(this, pilot, str36(id), id, node)

  this.env_el = document.createElement('span')
  this.env_el.className = `env`
  this.osc_el = document.createElement('span')
  this.osc_el.className = `osc`

  this.el.appendChild(this.env_el)
  this.el.appendChild(this.osc_el)
  this.el.appendChild(this.canvas)

  this.operate = function (msg) {
    const data = this.parse(`${msg}`)
    if (!data) { console.warn(`Unknown data`); return }
    if (data.isEnv) {
      this.setEnv(data)
    } else if (data.isOsc) {
      this.setOsc(data)
    } else if (data.isNote) {
      this.playNote(data)
    } else if (data.isRen) {
      this.randEnv()
    } else if (data.isRos) {
      this.randOsc()
    }
  }

  this.reset = function() {
    this.setEnv({ isEnv: true,
      attack: 0.001,
      decay: clamp(((8 - (id % 8)) / 8), 0.01, 0.9),
      sustain: clamp(((id % 4) / 4), 0.01, 0.9),
      release: clamp(((id % 6) / 6), 0.01, 0.9)
    })
  }

  this.setEnv = function (data) {
    if (this.lastEnv && performance.now() - this.lastEnv < 100) { return }
    if (id > 11 && id != 16) { return }
    if (!this.node.voices) {
      if (!this.node.envelope) { return }
      if (!isNaN(data.attack)) { this.node.envelope.attack = clamp(data.attack, 0.01, 1.0) }
      if (!isNaN(data.decay)) { this.node.envelope.decay = clamp(data.decay, 0.01, 1.0) }
      if (!isNaN(data.sustain)) { this.node.envelope.sustain = clamp(data.sustain, 0.01, 1.0) }
      if (!isNaN(data.release)) { this.node.envelope.release = clamp(data.release, 0.01, 1.0) }
    } else {
      for (const id in this.node.voices) {
        if (!this.node.voices[id].envelope) { continue }
        if (!isNaN(data.attack)) { this.node.voices[id].envelope.attack = clamp(data.attack, 0.01, 1.0) }
        if (!isNaN(data.decay)) { this.node.voices[id].envelope.decay = clamp(data.decay, 0.01, 1.0) }
        if (!isNaN(data.sustain)) { this.node.voices[id].envelope.sustain = clamp(data.sustain, 0.01, 1.0) }
        if (!isNaN(data.release)) { this.node.voices[id].envelope.release = clamp(data.release, 0.01, 1.0) }
      }
    }
    this.lastEnv = performance.now()
    this.updateEnv(data)
  }

  this.setOsc = function (data) {
    if (this.lastOsc && performance.now() - this.lastOsc < 100) { return }
    if (!this.node.voices) {
      if (data.wav && this.node.oscillator) {
        this.node.oscillator._oscillator.set('type', data.wav)
      }
      if (data.mod && this.node.modulation) {
        this.node.modulation._oscillator.set('type', data.mod)
      }
    } else {
      for (const id in this.node.voices) {
        if (data.wav && this.node.voices[id].oscillator) {
          this.node.voices[id].oscillator._oscillator.set('type', data.wav)
        }
        if (data.mod && this.node.voices[id].modulation) {
          this.node.voices[id].modulation._oscillator.set('type', data.mod)
        }        
      }
    }
    this.lastOsc = performance.now()
    this.updateOsc(data)
  }

  this.updateAll = function (data, force = false) {
    this.updateEnv(data, force)
    this.updateOsc(data, force)
  }

  this.updateEnv = function (data, force = false) {
    if (pilot.animate !== true) { return }
    if (force !== true && (!data || !data.isEnv)) { return }
    const node = !this.node.voices ? this.node : this.node.voices[0];
    if (!node.envelope) { return }
    setContent(this.env_el, `${to16(node.envelope.attack)}${to16(node.envelope.decay)}${to16(node.envelope.sustain)}${to16(node.envelope.release)}`)
  }

  this.updateOsc = function (data, force = false) {
    if (pilot.animate !== true) { return }
    if (force !== true && (!data || !data.isOsc)) { return }
    const node = !this.node.voices ? this.node : this.node.voices[0];
    setContent(this.osc_el, `${node.oscillator ? wavCode(node.oscillator._oscillator.type) : '--'}${node.modulation ? wavCode(node.modulation._oscillator.type) : '--'}`)
  }

  this.randEnv = function () {
    const a = to16(Math.random() * 0.25)
    const s = to16(Math.random() * 0.5)
    const d = to16(Math.random() * 0.75)
    const r = to16(Math.random() * 1)
    this.operate(`env${a}${s}${d}${r}`)
  }

  this.randOsc = function () {
    const a = WAVCODES[parseInt(Math.random() * WAVCODES.length)]
    const b = WAVCODES[parseInt(Math.random() * WAVCODES.length)]
    this.operate(`osc${a}${b}`)
  }

  // Parsers
  this.parse = function(msg) {
    const cmd = msg.substr(0, 3).toLowerCase()
    const val = msg.substr(3)
    if (cmd === 'osc') {
      return this.parseOsc(val)
    } else if (cmd === 'env') {
      return this.parseEnv(val)
    } else if (cmd === 'ren') {
      return { isRen: true }
    } else if (cmd === 'ros') {
      return { isRos: true }
    }
    return this.parseNote(msg)
  }

  this.parseEnv = function(msg) {
    if (msg.length < 1) { console.warn(`Misformatted env`); return }
    const attack = int36(msg.substr(0, 1)) / 15
    const decay = msg.length > 1 ? int36(msg.substr(1, 1)) / 15 : null
    const sustain = msg.length > 2 ? int36(msg.substr(2, 1)) / 15 : null
    const release = msg.length > 3 ? int36(msg.substr(3, 1)) / 15 : null
    return { isEnv: true, attack: attack, decay: decay, sustain: sustain, release: release, string: 'env' }
  }

  this.parseOsc = function(msg) {
    if (msg.length < 2) { console.warn(`Misformatted osc`); return }
    return { isOsc: true, wav: (msg.length > 1 ? wavName(msg.substr(0, 2)) : null), mod: (msg.length > 3 ? wavName(msg.substr(2, 2)) : null), string: 'osc' }
  }

  // Wave Codes

  function wavCode (n) {
    const name = n.toLowerCase()
    const index = WAVNAMES.indexOf(name)
    return index > -1 ? WAVCODES[index] : '??'
  }

  function wavName (c) {
    const code = c.toLowerCase()
    const index = WAVCODES.indexOf(code)
    return index > -1 ? WAVNAMES[index] : 'sine'
  }
  // Dom Tools
  function setClass (el, cl) { if (el.className !== cl) { el.className = cl } }
  function setContent (el, ct) { if (el.innerHTML !== ct) { el.innerHTML = ct } }
}
