'use strict'

const Tone = require('tone')

function EffectInterface (id, effect) {
  this.el = document.createElement('div')
  this.el.id = `ch${id}`

  this.cid_el = document.createElement('span')
  this.cid_el.className = `cid`
  this.env_el = document.createElement('span')
  this.env_el.className = `env`

  this.canvas = document.createElement('canvas')

  const canvasWidth = 30 * 2
  const canvasHeight = 15 * 2

  this.canvas.width = canvasWidth
  this.canvas.height = canvasHeight

  this.canvas.style.width = (canvasWidth / 2) + 'px'
  this.canvas.style.height = (canvasHeight / 2) + 'px'

  const waveform = new Tone.Waveform(64)

  let context = this.canvas.getContext('2d')

  this.effect = effect

  this.install = function (host) {
    this.cid_el.innerHTML = `${id}`

    this.el.appendChild(this.cid_el)
    this.el.appendChild(this.env_el)
    this.el.appendChild(this.canvas)

    this.effect.wet.value = 0

    this.effect.fan(waveform)
    host.appendChild(this.el)
  }

  this.start = function () {
    this.update()
    loop()
  }

  function drawWaveform (values) {
    context.clearRect(0, 0, canvasWidth, canvasHeight)
    context.beginPath()
    context.lineJoin = 'round'
    context.lineWidth = 2
    context.strokeStyle = 'white'
    context.moveTo(0, parseInt(((values[0] + 1) / 2) * canvasHeight))
    for (let i = 1, len = values.length; i < len; i++) {
      context.lineTo(parseInt(canvasWidth * (i / len)), parseInt(((values[i] + 1) / 2) * canvasHeight))
    }
    context.stroke()
  }

  function loop () {
    requestAnimationFrame(loop)
    var waveformValues = waveform.getValue()
    drawWaveform(waveformValues)
  }

  this.connect = function (node) {
    this.effect.connect(node)
  }

  // Run

  this.run = function (msg) {

  }

  this.operate = function (msg) {
    const data = parse(`${msg}`)
  }

  this.setEnv = function (data) {
    // this.synth.envelope.attack = clamp(data.attack, 0.1, 0.9)
    // this.synth.envelope.decay = clamp(data.decay, 0.1, 0.9)
    // this.synth.envelope.sustain = clamp(data.sustain, 0.1, 0.9)
    // this.synth.envelope.release = clamp(data.release, 0.1, 0.9)
    this.update(data)
  }

  // Updates

  this.update = function (data) {
    setClass(this.el, data && data.isNote ? 'channel note active' : data && data.isEnv ? 'channel envelope active' : data && data.isOsc ? 'channel oscillator active' : 'channel')
    this.updateEnv(data)
  }

  this.updateEnv = function (data) {
    // setContent(this.env_el, `${to16(this.synth.envelope.attack)}${to16(this.synth.envelope.decay)}${to16(this.synth.envelope.sustain)}${to16(this.synth.envelope.release)}`)
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

  function parseEnv (msg) {
    if (msg.length !== 4) { console.warn(`Misformatted env`); return }
    const attack = int36(msg.substr(0, 1)) / 15
    const decay = int36(msg.substr(1, 1)) / 15
    const sustain = int36(msg.substr(2, 1)) / 15
    const release = int36(msg.substr(3, 1)) / 15
    return { isEnv: true, attack: attack, decay: decay, sustain: sustain, release: release, string: 'env' }
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
  function from16 (str) { return (int36(str) / 15) }
  function to16 (float) { return str36(Math.floor(float * 15)) }
  function str36 (int) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'][parseInt(int)] }
  function int36 (str) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].indexOf(`${str}`) }
  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }

  // Dom Tools
  function setClass (el, cl) { if (el.className !== cl) { el.className = cl } }
  function setContent (el, ct) { if (el.innerHTML !== ct) { el.innerHTML = ct } }
}

module.exports = EffectInterface
