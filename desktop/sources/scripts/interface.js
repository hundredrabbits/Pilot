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
  this.oct_el = document.createElement('span')
  this.oct_el.className = `oct`

  this.synth = synth

  this.install = function (host) {
    this.cid_el.innerHTML = `${str36(id)}`

    this.el.appendChild(this.cid_el)
    this.el.appendChild(this.env_el)
    this.el.appendChild(this.osc_el)
    this.el.appendChild(this.oct_el)

    host.appendChild(this.el)
  }

  this.start = function () {
    // set Osc
    const wav = wavNames[id % wavNames.length]
    const mod = wavNames[(Math.floor(id / 3) + 6) % wavNames.length]
    this.setOsc({ wav: wav, mod: mod })
  }

  // Run

  this.run = function (msg) {
    const channel = `${msg}`.substr(0, 1)
    if (int36(channel) === id) {
      this.operate(`${msg}`.substr(1))
    } else {
      this.update()
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
    } else {
      console.warn('Unknown format', data)
    }
  }

  this.playNote = function (data) {
    if (isNaN(data.octave)) { console.warn(`Unknown Octave`); return }
    if (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'a', 'b', 'c', 'd', 'e', 'f', 'g'].indexOf(data.note) < 0) { console.warn(`Unknown Note`); return }
    this.synth.triggerAttackRelease(`${data.note}${data.sharp}${data.octave}`, data.length)
    this.update(data)
  }

  this.setEnv = function (data) {
    this.synth.envelope.attack = data.attack
    this.synth.envelope.decay = data.decay
    this.synth.envelope.sustain = data.sustain
    this.synth.envelope.release = data.release
    this.update(data)
  }

  this.setOsc = function (data) {
    if (data.wav && this.synth.oscillator) {
      this.synth.oscillator._oscillator.set('type', data.wav)
    }
    if (data.mod && this.synth.modulation) {
      this.synth.modulation._oscillator.set('type', data.mod)
    }
    this.update(data)
  }

  // Updates

  this.update = function (data) {
    setClass(this.el, data && data.isNote ? 'channel note active' : data ? 'channel setting active' : '')
    this.updateEnv(data)
    this.updateOsc(data)
    this.updateOct(data)
  }

  this.updateEnv = function (data) {
    setContent(this.env_el, `${to16(this.synth.envelope.attack)}${to16(this.synth.envelope.decay)}${to16(this.synth.envelope.sustain)}${to16(this.synth.envelope.release)}`)
  }

  this.updateOsc = function (data) {
    setContent(this.osc_el, `${this.synth.oscillator ? wavCode(this.synth.oscillator._oscillator.type) : '--'}${this.synth.modulation ? wavCode(this.synth.modulation._oscillator.type) : '--'}`)
  }

  this.updateOct = function (data) {
    let html = ''
    for (let i = 0; i < 8; i++) {
      html += (data && data.note && i === data.octave ? data.note : '.')
    }
    setContent(this.oct_el, html)
  }

  // Parsers

  function parse (msg) {
    const cmd = msg.substr(0, 3).toLowerCase()
    const val = msg.substr(3)
    if (cmd === 'osc') {
      return parseOsc(val)
    }
    if (cmd === 'env') {
      return parseEnv(val)
    }
    return parseNote(msg)
  }

  function parseNote (msg) {
    if (msg.length < 2) { console.warn(`Misformatted note`); return }
    const octave = clamp(parseInt(msg.substr(0, 1)), 0, 8)
    const note = msg.substr(1, 1)
    const sharp = note.toLowerCase() === note ? '#' : ''
    const velocity = 1
    const length = msg.length === 4 ? from16(msg.substr(3, 1)) : 0.1
    return { isNote: true, octave: octave, note: note, sharp: sharp, string: `${octave}${note}`, length: length }
  }

  function parseEnv (msg) {
    if (msg.length !== 4) { console.warn(`Misformatted env`); return }
    const attack = int36(msg.substr(0, 1)) / 15
    const decay = int36(msg.substr(1, 1)) / 15
    const sustain = int36(msg.substr(2, 1)) / 15
    const release = int36(msg.substr(3, 1)) / 15
    return { isEnv: true, attack: attack, decay: decay, sustain: sustain, release: release, string: 'env' }
  }

  function parseOsc (msg) {
    if (msg.length !== 4) { console.warn(`Misformatted env`); return }
    return { isOsc: true, wav: (msg.length == 2 || msg.length == 4 ? wavName(msg.substr(0, 2)) : null), mod: (msg.length == 4 ? wavName(msg.substr(2, 2)) : null), string: 'osc' }
  }

  // Wave Codes
  const wavCodes = ['si', 'tr', 'sq', '4i', '4r', '4q', '8i', '8r', '8q']
  const wavNames = ['sine', 'triangle', 'square', 'sine4', 'triangle4', 'square4', 'sine8', 'triangle8', 'square8']

  function wavCode (n) {
    const name = n.toLowerCase()
    const index = wavNames.indexOf(name)
    return index > -1 ? wavCodes[index] : '??'
  }

  function wavName (c) {
    const code = c.toLowerCase()
    const index = wavCodes.indexOf(code)
    return index > -1 ? wavNames[index] : 'sine'
  }

  // Helpers
  function to16 (float) { return str36(Math.floor(float * 15)) }
  function str36 (int) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'][parseInt(int)] }
  function int36 (str) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].indexOf(`${str}`) }
  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }

  // Dom Tools
  function setClass (el, cl) { if (el.className !== cl) { el.className = cl } }
  function setContent (el, ct) { if (el.innerHTML !== ct) { el.innerHTML = ct } }
}

module.exports = Interface
