'use strict'

const Tone = require('tone')

function Interface (pilot, id, node) {
  this.node = node
  this.waveform = new Tone.Waveform(512)

  this.el = document.createElement('div')
  this.el.id = `ch${id}`
  this.canvas = document.createElement('canvas')

  const waveform = this.waveform
  const canvasWidth = 30 * 2
  const canvasHeight = 15 * 2
  const context = this.canvas.getContext('2d')

  this.install = function (host) {
    this.canvas.width = canvasWidth
    this.canvas.height = canvasHeight
    this.canvas.style.width = (canvasWidth / 2) + 'px'
    this.canvas.style.height = (canvasHeight / 2) + 'px'

    this.node.fan(this.waveform)
    this.el.appendChild(this.canvas)
    host.appendChild(this.el)
  }

  this.start = function () {
    this.updateAll({}, true)
    loop()
  }

  this.connect = function (node) {
    this.node.connect(node)
  }

  function draw (values) {
    if (pilot.animate !== true) { return }
    context.clearRect(0, 0, canvasWidth, canvasHeight)
    context.beginPath()
    context.lineJoin = 'round'
    context.lineWidth = 2
    context.strokeStyle = pilot.theme.active.f_med
    context.moveTo(0, parseInt(((values[0] + 1) / 2) * canvasHeight))
    for (let i = 1, len = values.length; i < len; i++) {
      if (i % 17 !== 0) { continue }
      const x = parseInt(canvasWidth * (i / len))
      const y = parseInt(((values[i] + 1) / 2) * canvasHeight)
      context.lineTo(clamp(x, 2, canvasWidth - 2), clamp(y, 2, canvasHeight - 2))
    }
    context.stroke()
  }

  function loop () {
    requestAnimationFrame(loop)
    draw(waveform.getValue())
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Interface
