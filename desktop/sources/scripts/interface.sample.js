import ChannelInterface from './interface.channel.js'
import {str36,to16,clamp} from './interface.js'
'use strict'

export default function SampleInterface (pilot, id, node, name) {
  ChannelInterface.call(this, pilot, str36(id), id+1, node)

  this.samp_el = document.createElement('span')
  this.samp_el.className = `cid`
  this.samp_el.innerHTML = name
  this.el.appendChild(this.samp_el)
  this.el.appendChild(this.canvas)

  this.parts = ['synth-C2', 'synth-C3']
  this.buffers = {}
  this.isReady = false
  this.name = name

  this.parent_install = this.install
  this.install = (host) => {
    this.parent_install(host)
    console.log(name, 'Loading Samples..')
    for (const id in this.parts) {
      this.load(this.parts[id])
    }
  }

  this.load = (part) => {
    const url = `/media/${name}/${part}.wav`
    var buffer = new Tone.Buffer(url, () => {
      this.buffers[part] = buffer.get()
      this.node.add(part.split('-')[1], this.buffers[part])
      this.check()
    })
  }

  this.check = () => {
    if (Object.keys(this.buffers).length === this.parts.length) {
      this.isReady = true
      console.log(name, 'Loading Samples Finished..')
    }
  }

  this.operate = function (msg) {
    const data = this.parseNote(`${msg}`)
    if (!data) { console.warn(`${this.name} Unknown data`); return }
    if (!this.isReady) { console.warn(`${this.name} still loading`); return }
    this.playNote(data)
  }

  this.updateAll = function (data, force = false) {
  }

  this.reset = function() {
  }


  this.randEnv = function () {
  }

  this.randOsc = function () {
  }

}