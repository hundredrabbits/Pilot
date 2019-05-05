'use strict'

const Tone = require('tone')

function Interface (pilot, id, node, meter = true) {
  this.node = node
  this.waveform = new Tone.Meter(0.95)

  this.el = document.createElement('div')
  this.el.id = `ch${id}`
  this.canvas = document.createElement('canvas')

  const waveform = this.waveform
  const canvasWidth = 13 * 2
  const canvasHeight = 13 * 2
  const context = this.canvas.getContext('2d')
  let lastUpdate = null

  this.install = function (host) {
    this.canvas.width = canvasWidth
    this.canvas.height = canvasHeight
    this.canvas.style.width = (canvasWidth / 2) + 'px'
    this.canvas.style.height = (canvasHeight / 2) + 'px'

    context.lineJoin = 'round'
    context.lineWidth = 30
    context.strokeStyle = pilot.theme.active.f_high

    this.node.connect(this.waveform)
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

  function draw (level) {
    if (pilot.animate !== true) { return }
    if (meter !== true) { return }
    if (lastUpdate && performance.now() - lastUpdate < 30) { return }

    const gain = Tone.dbToGain(level)

    if (gain < 0.01) { return }

    const x = ((gain * canvasWidth))
    const y = parseInt(canvasWidth / 2)

    context.clearRect(0, 0, canvasWidth, canvasHeight)
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(x, y)
    context.stroke()
    lastUpdate = performance.now()
  }

  function loop () {
    requestAnimationFrame(loop)
    draw(waveform.getLevel())
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = Interface
