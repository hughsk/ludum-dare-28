var bs = require('bindlestiff')
var specials = require('./player-specials')

var Player = module.exports = bs.define()

  .use(require('../systems/physics').component)

  .use(bs.component('player')
    .on('init', function() {
      this.game = window.currentGame
      this.wasPressed = false
      this.speediness = 3
      this.special = 2
      this.angle = 0
    })
    .on('tick', function(game) {
      var section = game.beats.section
      var pressed = game.input.pressed
      var down = this.wasPressed && pressed
      var up = this.wasPressed && !pressed

      if (this.wasPressed = pressed) {
        bars[section].call(this, game, down, up)
      }
    })
  )

var bars = [
  // up
  function(game) {
    this.position[1] -= this.speediness
  },
  // spin
  function(game) {
    this.angle += 0.05
  },
  // special
  function(game, down, up) {
    specials[this.special].emit('tick', this)
    if (down) specials[this.special].emit('init', this)
    if (up)   specials[this.special].emit('stop', this)
  },
  // down
  function(game) {
    this.position[1] += this.speediness
  },
]
