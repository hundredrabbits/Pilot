'use strict'

function Interface (id, synth) {
  this.synth = synth

  this.run = function(msg){
    console.log(msg)
    
  }
}

module.exports = Interface
