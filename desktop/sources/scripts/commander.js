'use strict'

function Commander (pilot) {
  this.el = document.createElement('div')
  this.el.id = 'commander'
  this.input = document.createElement('input')

  // History of commands entered.
  this.history = []

  // Index of history command to show in input.
  this.historyIndex = 0

  // Holds whether the user is browsing the history or not.
  this.isBrowsingHistory = false

  this.install = function (host) {
    this.el.appendChild(this.input)
    host.appendChild(this.el)
  }

  this.start = function () {

  }

  this.input.oninput = (e) => {

  }

  this.input.onkeydown = (e) => {
    switch (e.keyCode) {
    case 40: // Down
      e.preventDefault()
      if (!this.isBrowsingHistory) {
        return
      }

      if (this.history.length) {
        if (this.historyIndex === this.history.length - 1) {
          this.isBrowsingHistory = false
          this.input.value = ''
          return
        }

        this.historyIndex += 1
        this.input.value = this.history[this.historyIndex]
      }
      break
    case 38: // Up
      e.preventDefault()
      if (!this.isBrowsingHistory) {
        this.historyIndex = this.history.length
      }

      this.isBrowsingHistory = true
      if (this.history.length && this.historyIndex > 0) {
        this.historyIndex -= 1
        this.input.value = this.history[this.historyIndex]
      }

      break
    }
  }

  this.input.onkeypress = (e) => {
    if (e.keyCode !== 13) { return }
    e.preventDefault()
    this.isBrowsingHistory = false
    this.history.push(this.input.value)
    pilot.mixer.run(this.input.value)
    this.input.value = ''
  }
}

module.exports = Commander
