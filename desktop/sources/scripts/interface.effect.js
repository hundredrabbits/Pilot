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
    // console.log(id, msg)
  }

  this.operate = function (msg) {
    const data = parse(`${msg}`)
    console.log(msg, data)
  }

  this.setValue = function (data) {
    console.log(id, data)
    this.effect.wet.value = data.wet

    if (data.id === 'reverb') {
      this.effect.roomSize.value = data.value
    } else if (data.id === 'distortion') {
      this.effect.distortion = data.value
    } else if (data.id === 'chorus') {
      this.effect.depth = data.value
    } else if (data.id === 'feedback') {
      this.effect.delayTime.value = data.value
    }

    this.update(data)
  }

  // Updates

  this.update = function (data) {
    setClass(this.el, data && data.isNote ? 'channel note active' : data && data.isEnv ? 'channel envelope active' : data && data.isOsc ? 'channel oscillator active' : 'channel')
    this.updateValue(data)
  }

  this.updateValue = function (data) {
    setContent(this.env_el, '??')
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

  function parseEffect (name, msg) {
    if (msg.length !== 2) { console.warn(`Misformatted effect`, msg); return }
    const wet = int36(msg.substr(0, 1)) / 15
    const value = int36(msg.substr(1, 1)) / 15
    return { isEffect: true, name: name, wet: wet, value: value }
  }

  // Wave Codes
  const sfxCodes = ['dis', 'cho', 'rev', 'fee']
  const sfxNames = ['distortion', 'chorus', 'reverb', 'feedback']

  function sfxCode (n) {
    const name = n.toLowerCase()
    const index = wavNames.indexOf(name)
    return index > -1 ? wavCodes[index] : '??'
  }

  function sfxName (c) {
    const code = c.toLowerCase()
    const index = wavCodes.indexOf(code)
    return index > -1 ? wavNames[index] : '??'
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
