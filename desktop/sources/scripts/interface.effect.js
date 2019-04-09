'use strict'

const Tone = require('tone')
const Interface = require('./interface')

function EffectInterface (pilot, id, node) {
  Interface.call(this, pilot, id, node)

  this.node = node
  this.node.wet.value = 0

  this.el = document.createElement('div')
  this.el.id = `ch${id}`
  this.el.className = 'effect'
  this.cid_el = document.createElement('span')
  this.cid_el.className = `cid`
  this.val_el = document.createElement('span')
  this.val_el.className = `val`

  this.cid_el.innerHTML = `${id}`

  this.el.appendChild(this.cid_el)
  this.el.appendChild(this.val_el)

  // Run

  this.run = function (msg) {
    if (!msg || msg.substr(0, 3).toLowerCase() !== id) { return }

    if (msg.substr(0, 3).toLowerCase() === id) {
      this.operate(`${msg}`.substr(3))
    }
  }

  this.operate = function (msg) {
    const data = parse(`${msg}`)
    if (!data) { console.warn(`Unknown data`); return }
    this.setEffect(data)
  }

  this.setEffect = function (data) {
    if (this.lastEffect && performance.now() - this.lastEffect < 100) { return }

    this.node.wet.value = data.wet

    if (!isNaN(data.value)) {
      if (data.code === 'rev') {
        this.node.roomSize.value = data.value
      } else if (data.code === 'dis') {
        this.node.distortion = data.value
      } else if (data.code === 'bit') {
        this.node.bits = clamp(parseInt(data.value * 8), 1, 8)
      } else if (data.code === 'cho') {
        this.node.depth = data.value
      } else if (data.code === 'fee') {
        this.node.delayTime.value = data.value
      } else if (data.code === 'tre') {
        this.node.depth.value = data.value
      } else if (data.code === 'vib') {
        this.node.depth.value = data.value
      } else if (data.code === 'aut') {
        this.node.depth.value = data.value
      }
    }
    this.lastEffect = performance.now()
    this.updateEffect(data, true)
  }

  // Updates

  this.updateAll = function (data, force = false) {
    this.updateEffect(data, force)
  }

  this.updateEffect = function (data, force = false) {
    if (pilot.animate !== true) { return }
    if (force !== true && (!data || !data.isEffect)) { return }

    let value = 0
    if (id === 'rev') {
      value = this.node.roomSize.value
    } else if (id === 'dis') {
      value = this.node.distortion
    } else if (id === 'cho') {
      value = this.node.depth
    } else if (id === 'bit') {
      value = this.node.bits / 8
    } else if (id === 'fee') {
      value = this.node.delayTime.value
    } else if (id === 'tre') {
      value = this.node.depth.value
    } else if (id === 'vib') {
      value = this.node.depth.value
    } else if (id === 'aut') {
      value = this.node.depth.value
    }

    setContent(this.val_el, `${to16(this.node.wet.value)}${to16(value)}`)
    setClass(this.val_el, 'val active')
    setTimeout(() => { setClass(this.val_el, 'val') }, 50)
  }

  // Parsers

  function parse (msg) {
    if (msg.length !== 2 && msg.length !== 1) { console.warn(`Misformatted effect`, msg); return }
    const wet = int36(msg.substr(0, 1)) / 15
    const value = int36(msg.substr(1, 1)) / 15
    return { isEffect: true, code: id, wet: wet, value: value }
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
