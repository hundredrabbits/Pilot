import Interface from './interface.js'
import transposeTable from './transpose.js'
'use strict'

const Tone = require('tone')

const OCTAVE = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B']
const MAJOR = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const MINOR = ['c', 'd', 'F', 'f', 'g', 'a', 'C']
const WAVCODES = ['si', 'tr', 'sq', 'sw', '2i', '2r', '2q', '2w', '4i', '4r', '4q', '4w', '8i', '8r', '8q', '8w']
const WAVNAMES = ['sine', 'triangle', 'square', 'sawtooth', 'sine2', 'triangle2', 'square2', 'sawtooth2', 'sine4', 'triangle4', 'square4', 'sawtooth4', 'sine8', 'triangle8', 'square8', 'sawtooth8']

export default function ChannelInterface (pilot, id, node) {
  Interface.call(this, pilot, id, node, true)

  this.node = node

  this.el = document.createElement('div')
  this.el.id = `ch${id.toString(16)}`
  this.el.className = 'channel'
  this.cid_el = document.createElement('span')
  this.cid_el.className = `cid`
  this.env_el = document.createElement('span')
  this.env_el.className = `env`
  this.osc_el = document.createElement('span')
  this.osc_el.className = `osc`

  this.cid_el.innerHTML = `${str36(id)}`

  this.el.appendChild(this.cid_el)
  this.el.appendChild(this.env_el)
  this.el.appendChild(this.osc_el)
  this.el.appendChild(this.canvas)

  // Run

  this.run = function (msg) {
    const channel = `${msg}`.substr(0, 1)
    if (int36(channel) === id) {
      this.operate(`${msg}`.substr(1))
    }
  }

  this.operate = function (msg) {
    const data = parse(`${msg}`)
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

  this.playNote = function (data) {
    if (isNaN(data.octave)) { return }
    if (OCTAVE.indexOf(data.note) < 0) { console.warn(`Unknown Note`); return }
    if (this.lastNote && performance.now() - this.lastNote < 100) { return }
    const name = `${data.note}${data.sharp}${data.octave}`
    const length = clamp(data.length, 0.1, 0.9)
    this.node.triggerAttackRelease(name, length, '+0', data.velocity)
    this.lastNote = performance.now()
  }

  this.setEnv = function (data) {
    if (this.lastEnv && performance.now() - this.lastEnv < 100) { return }
    if (!this.node.envelope) { return }
    if (id > 11) { return }
    if (!isNaN(data.attack)) { this.node.envelope.attack = clamp(data.attack, 0.01, 1.0) }
    if (!isNaN(data.decay)) { this.node.envelope.decay = clamp(data.decay, 0.01, 1.0) }
    if (!isNaN(data.sustain)) { this.node.envelope.sustain = clamp(data.sustain, 0.01, 1.0) }
    if (!isNaN(data.release)) { this.node.envelope.release = clamp(data.release, 0.01, 1.0) }
    this.lastEnv = performance.now()
    this.updateEnv(data)
  }

  this.setOsc = function (data) {
    if (this.lastOsc && performance.now() - this.lastOsc < 100) { return }
    if (data.wav && this.node.oscillator) {
      this.node.oscillator._oscillator.set('type', data.wav)
    }
    if (data.mod && this.node.modulation) {
      this.node.modulation._oscillator.set('type', data.mod)
    }
    this.lastOsc = performance.now()
    this.updateOsc(data)
  }

  // Updates

  this.updateAll = function (data, force = false) {
    this.updateEnv(data, force)
    this.updateOsc(data, force)
  }

  this.updateEnv = function (data, force = false) {
    if (pilot.animate !== true) { return }
    if (force !== true && (!data || !data.isEnv)) { return }
    if (!this.node.envelope) { return }
    setContent(this.env_el, `${to16(this.node.envelope.attack)}${to16(this.node.envelope.decay)}${to16(this.node.envelope.sustain)}${to16(this.node.envelope.release)}`)
  }

  this.updateOsc = function (data, force = false) {
    if (pilot.animate !== true) { return }
    if (force !== true && (!data || !data.isOsc)) { return }
    setContent(this.osc_el, `${this.node.oscillator ? wavCode(this.node.oscillator._oscillator.type) : '--'}${this.node.modulation ? wavCode(this.node.modulation._oscillator.type) : '--'}`)
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

  function parse (msg) {
    const cmd = msg.substr(0, 3).toLowerCase()
    const val = msg.substr(3)
    if (cmd === 'osc') {
      return parseOsc(val)
    } else if (cmd === 'env') {
      return parseEnv(val)
    } else if (cmd === 'ren') {
      return { isRen: true }
    } else if (cmd === 'ros') {
      return { isRos: true }
    }
    return parseNote(msg)
  }

  function parseNote (msg) {
    if (msg.length < 2) { console.warn(`Misformatted note`); return }
    const octave = clamp(parseInt(msg.substr(0, 1)), 0, 8)
    const note = msg.substr(1, 1)
    const velocity = msg.length >= 3 ? from16(msg.substr(2, 1)) : 0.66
    const length = msg.length === 4 ? from16(msg.substr(3, 1)) : 0.1
    const transposed = transpose(note, octave)
    //console.log(transposed)
    return { isNote: true, octave: transposed.octave, note: transposed.note, sharp: isUpperCase(transposed.note) === false ? '#' : '', string: `${octave}${note}`, length: length, velocity: velocity }
  }

  function parseEnv (msg) {
    if (msg.length < 1) { console.warn(`Misformatted env`); return }
    const attack = int36(msg.substr(0, 1)) / 15
    const decay = msg.length > 1 ? int36(msg.substr(1, 1)) / 15 : null
    const sustain = msg.length > 2 ? int36(msg.substr(2, 1)) / 15 : null
    const release = msg.length > 3 ? int36(msg.substr(3, 1)) / 15 : null
    return { isEnv: true, attack: attack, decay: decay, sustain: sustain, release: release, string: 'env' }
  }

  function parseOsc (msg) {
    if (msg.length < 2) { console.warn(`Misformatted osc`); return }
    return { isOsc: true, wav: (msg.length > 1 ? wavName(msg.substr(0, 2)) : null), mod: (msg.length > 3 ? wavName(msg.substr(2, 2)) : null), string: 'osc' }
  }

  // Tools

  function transpose (n, o = 3) {
    if (!transposeTable[n]) { console.log('Unknown transpose: ', n); return null }
    const octave = clamp(parseInt(o) + parseInt(transposeTable[n].charAt(1)), 0, 8)
    const note = transposeTable[n].charAt(0)
    const value = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B'].indexOf(note)
    const id = clamp((octave * 12) + value + 24, 0, 127)
    return { id, value, note, octave }
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

  // Helpers
  function letterValue (c) { return c.toLowerCase().charCodeAt(0) - 97 }
  function isUpperCase (s) { return `${s}`.toUpperCase() === `${s}` }
  function from16 (str) { return (int36(str) / 15) }
  function to16 (float) { return str36(Math.floor(float * 15)) }
  function str36 (int) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'][parseInt(int)] }
  function int36 (str) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].indexOf(`${str.toLowerCase()}`) }
  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }

  // Dom Tools
  function setClass (el, cl) { if (el.className !== cl) { el.className = cl } }
  function setContent (el, ct) { if (el.innerHTML !== ct) { el.innerHTML = ct } }
}
