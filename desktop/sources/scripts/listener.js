'use strict'
const dgram = require('dgram')

function Listener (pilot) {
  this.server = dgram.createSocket('udp4')

  // Server

  this.server.on('message', (msg, rinfo) => {
    let path = msg.toString()
    let _route = route.bind(null, pilot, path)

    // play notes
    // /p{channel}{octave}{note}{?velocity}{?length}
    if (_route(/P(\d)(\d)([A-Ga-g])([0-9a-fA-F])+/,  'play')) return

    // channel modifications. mute 0-1, pan 0-Z I is centered, solo 0-1, volume 0-Z,
    // /p{channel}{param [mute,pan,solo,volume]}
    if (_route(/C(\d)(mute|pan|solo|vol|MUTE|PAN|SOLO|VOL)([0-9A-Za-z])/, 'channel')) return

    // synth changes
    // /S{channel}

  })

  this.server.on('listening', () => {
    const address = this.server.address()
    console.log(`Server listening for UDP:\n ${address.address}:${address.port}`)
  })

  this.server.on('error', (err) => {
    console.log(`Server error:\n ${err.stack}`)
    server.close()
  })

  this.server.bind(49160)
}

function route(pilot, path, regex, method) {
  let match = path.match(regex)
  if (!match) return false
  let args = match.slice(1)

  let func = pilot[method]
  func.apply(pilot, args)
  return true
}
