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
    if (id > 160) return bindings // ignore special keys like cmd/ctrl/etc.
    var name = keys[id]

    if (name === '<backspace>') return bindings
    if (name === '<tab>') return bindings
    if (name === '<clear>') return bindings
    if (name === '<enter>') return bindings
    if (name === '<shift>') return bindings
    if (name === '<control>') return bindings
    if (name === '<menu>') return bindings
    if (name === '<meta>') return bindings
    if (name === '<alt>') return bindings

    bindings[name] = 'pressed'
    return bindings
  }, {})
)
