var controls = require('kb-controls')
var keys = require('vkey')
var max = Math.max

module.exports = InputSystem

function InputSystem(game) {
  if (!(this instanceof InputSystem)) return new InputSystem(game)
  this.game = game
}

InputSystem.prototype.tick = function tick() {
  this.pressed = input.pressed
}

//
// Listen to all keyboard and mouse input
//
var input = controls(
  Object.keys(keys).reduce(function(bindings, id) {
    var name = keys[id]
    bindings[name] = 'pressed'
    return bindings
  }, {})
)
