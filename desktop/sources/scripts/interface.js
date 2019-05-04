'use strict'

const Tone = require('tone')

function Interface (pilot, id, node, meter = true) {
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

    context.lineJoin = 'round'
    context.lineWidth = 2
    context.strokeStyle = pilot.theme.active.f_med

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
    if (meter !== true) { return }

    const value = values.reduce((sum, num) => { return sum + num })

    context.clearRect(0, 0, canvasWidth, canvasHeight)

    context.beginPath()
    context.moveTo(0, parseInt(((values[0] + 1) / 2) * canvasHeight))

    if (Math.abs(value) > 0) {
      for (let i = 1, len = values.length; i < len; i++) {
        if (i % 17 !== 0) { continue }
        const x = parseInt(canvasWidth * (i / len))
        const y = parseInt(((values[i] + 1) / 2) * canvasHeight)
        context.lineTo(clamp(x, 2, canvasWidth - 2), clamp(y, 2, canvasHeight - 2))
      }
    }

    context.lineTo(canvasWidth, parseInt(((values[0] + 1) / 2) * canvasHeight))
    context.stroke()
  }

  function loop () {
    requestAnimationFrame(loop)
    draw(waveform.getValue())
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Interface
