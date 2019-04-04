function Terminal (pilot) {
  this.el = document.createElement('div')
  this.el.id = 'terminal'

  this.install = function (host) {
    host.appendChild(this.el)
  }

  this.log = function (msg) {
    console.log(msg)
    this.el.innerHTML = `${msg}`
  }
}

module.exports = Terminal
