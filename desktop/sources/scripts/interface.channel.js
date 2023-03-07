import {Interface, clamp, str36, from16, isUpperCase} from './interface.js'
import transposeTable from './transpose.js'
'use strict'

const Tone = require('tone')

const OCTAVE = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B']
const MAJOR = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const MINOR = ['c', 'd', 'F', 'f', 'g', 'a', 'C']

export default function ChannelInterface (pilot, id, index, node) {
  Interface.call(this, pilot, `ch${id}`, index, node)
  this.el.className = 'channel'
  this.cid_el = document.createElement('span')
  this.cid_el.className = 'cid'
  this.cid_el.innerHTML = `${id}`
  this.el.appendChild(this.cid_el)
  
  // Run
  this.run = function (msg) {
    this.operate(msg)
  }

  this.playNote = function (data) {
    if (isNaN(data.octave)) { return }
    if (OCTAVE.indexOf(data.note) < 0) { console.warn(`Unknown Note`); return }
    const name = `${data.note}${data.sharp}${data.octave}`
    const length = clamp(data.length, 0.1, 0.9)
    this.node.triggerAttackRelease(name, length, '+0', data.velocity)
  }



  // Updates


  this.parseNote = function(msg) {
    if (msg.length < 2) { console.warn(`Misformatted note`); return }
    const octave = clamp(parseInt(msg.substr(0, 1)), 0, 8)
    const note = msg.substr(1, 1)
    const velocity = msg.length >= 3 ? from16(msg.substr(2, 1)) : 0.66
    const length = msg.length === 4 ? from16(msg.substr(3, 1)) : 0.1
    const transposed = transpose(note, octave)
    //console.log(transposed)
    return { isNote: true, octave: transposed.octave, note: transposed.note, sharp: isUpperCase(transposed.note) === false ? '#' : '', string: `${octave}${note}`, length: length, velocity: velocity }
  }

  // Tools

  function transpose (n, o = 3) {
    if (!transposeTable[n]) { console.log('Unknown transpose: ', n); return null }
    const octave = clamp(parseInt(o) + parseInt(transposeTable[n].charAt(1)), 0, 8)
    const note = transposeTable[n].charAt(0)
    const value = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B'].indexOf(note)
    const id = clamp((octave * 12) + value + 24, 0, 127)
    return { id, value, note, octave }
  }

  this.randEnv = function () {
  }

  this.randOsc = function () {
  }

}
