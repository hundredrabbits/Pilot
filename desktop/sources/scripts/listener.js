'use strict'

function Listener (pilot) {
  const dgram = require('dgram')
  this.server = dgram.createSocket('udp4')

  // Server

  this.server.on('message', (msg, rinfo) => {
    pilot.play(msg)
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
