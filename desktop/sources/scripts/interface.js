const Tone = require('tone')

function Interface (pilot, id, index, node) {
  this.node = node
  this.meter = new Tone.Meter(0.95)
  this.waveform = new Tone.Waveform(256)

  this.el = document.createElement('div')
  this.el.id = id
  this.el.style.setProperty('--id', index)
  this.canvas = document.createElement('canvas')

  const self = this

  const waveform = this.waveform
  const meter = this.meter
  const canvasWidth = 13 * 4
  const canvasHeight = 13 * 2
  const context = this.canvas.getContext('2d')

  let lastUpdate = null

  this.install = function (host) {
    this.canvas.width = canvasWidth
    this.canvas.height = canvasHeight
    this.canvas.style.width = (canvasWidth / 2) + 'px'
    this.canvas.style.height = (canvasHeight / 2) + 'px'

    context.lineJoin = 'round'
    context.lineWidth = 2
    context.strokeStyle = pilot.theme.active.f_high

    this.node.connect(this.meter)
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

  function draw (level) {
    if (pilot.animate !== true) { return }
    if (lastUpdate && performance.now() - lastUpdate < 30) { return }

    context.clearRect(0, 0, canvasWidth, canvasHeight)

    drawActivity()
    drawWaveform()

    lastUpdate = performance.now()
  }

  function drawWaveform () {
    const values = waveform.getValue()
    const level = meter.getLevel()
    const gain = Tone.dbToGain(level)

    context.beginPath()
    context.moveTo(0, parseInt(((values[0] + 1) / 2) * canvasHeight))

    if (gain > 0.01) {
      for (let i = 1, len = values.length; i < len; i++) {
        if (i % 17 !== 0) { continue }
        const x = parseInt(canvasWidth * (i / len))
        const y = parseInt(((values[i] + 1) / 2) * canvasHeight)
        context.lineTo(clamp(x, 2, canvasWidth - 2), clamp(y, 2, canvasHeight - 2))
      }
    }

    context.lineTo(canvasWidth, parseInt(((values[0] + 1) / 2) * canvasHeight))

    context.stroke()
    context.closePath()
  }

  function drawActivity () {
    if (!self) { return }
    if (!self.lastNote) { return }

    const elapsed = performance.now() - self.lastNote
    const max = 500

    context.beginPath()
    context.arc(2, 4, 2, 0, 2 * Math.PI, false)
    context.fillStyle = `rgba(255,255,255,${(1 - (elapsed / max))})`
    context.fill()
    context.closePath()
  }

  function loop () {
    requestAnimationFrame(loop)
    draw()
  }

}
// Helpers
function letterValue (c) { return c.toLowerCase().charCodeAt(0) - 97 }
function isUpperCase (s) { return `${s}`.toUpperCase() === `${s}` }
function from16 (str) { return (int36(str) / 15) }
function int36 (str) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].indexOf(`${str.toLowerCase()}`) }
function to16 (float) { return str36(Math.floor(float * 15)) }
function str36 (int) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'][parseInt(int)] }
function clamp (v, min, max) { return v < min ? min : v > max ? max : v }

export {Interface, str36, int36, from16, to16, clamp, letterValue, isUpperCase}