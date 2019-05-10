const dgram = require('dgram')

export default function Listener (pilot) {
  this.server = dgram.createSocket('udp4')

  this.server.on('message', (msg, rinfo) => {
    pilot.mixer.run(`${msg}`)
  })

  this.server.on('listening', () => {
    const address = this.server.address()
    console.log(`Server listening for UDP:\n ${address.address}:${address.port}`)
  })

  this.server.on('error', (err) => {
    console.log(`Server error:\n ${err.stack}`)
    server.close()
  })

  this.server.bind(49161) // TODO - make this configurable
}
