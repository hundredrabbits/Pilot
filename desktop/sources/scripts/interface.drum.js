import {Interface,str36,int36,from16,clamp} from './interface.js'
'use strict'

export default function DrumInterface (pilot, id, name) {
  this.parts = ['kick', 'kick-up', 'kick-down', 'tom', 'snare', 'snare-up', 'snare-down', 'clap', 'hat', 'hat-open', 'hat-shut', 'cymb', 'fx1', 'fx2', 'fx3', 'fx4']
  this.parts_url = {}
  this.isReady = false
  for (const id in this.parts) {
    const url = `/media/${name}/${this.parts[id]}.wav`
    this.parts_url[`${str36(id)}`] = url
  }
  console.log(name, 'Loading Drums..')
  const node = new Tone.Players(this.parts_url, () => {
    this.isReady = true
    console.log(name, 'Loading Drums Finished..')
  })
  Interface.call(this, pilot, `dr${str36(id)}`, id+1, node)

  this.el.className = 'effect'
  this.samp_el = document.createElement('span')
  this.samp_el.className = `cid`
  this.samp_el.innerHTML = `${str36(id)} ${name.substr(0,7)}`
  this.el.appendChild(this.samp_el)
  this.el.appendChild(this.canvas)

  this.name = name
  this.index = id

  this.run = function (msg) {
    this.operate(msg)
  }

  this.operate = function (msg) {
    const data = this.parseMsg(msg)
    if (!data) { console.warn(`${this.name} Unknown data`); return }
    if (!this.isReady) { console.warn(`${this.name} still loading`); return }
    this.playDrum(data)
  }

  this.parseMsg = function(msg) {
    if (msg.length < 1) { console.warn(`Misformatted note`); return }
    const pad = str36(clamp(int36(msg.substr(0, 1)), 0, this.parts.length))
    const volume = msg.length >= 2 ? from16(msg.substr(1, 1)) : 1
    const length = msg.length >= 3 ? from16(msg.substr(2, 1)) : 1
    return { pad: pad, length: length, volume: volume }
  }

  this.playDrum = (data) => {
    if (!this.node.has(data.pad)) {
      console.warn(`key ${data.pad} not found for playback`);
      return;
    }
    const player = this.node.get(data.pad);
    player.volume.value = (data.volume * 36) - 36
    player.start(undefined, 0, data.length)
  }

  this.updateAll = (data, force = false) => {}

  this.reset = () => {}

  this.rand = () => {}
}