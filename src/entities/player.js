var bs = require('bindlestiff')
var specials = require('./player-specials')

var Player = module.exports = bs.define()

  .use(require('../systems/physics').component)

  .use(bs.component('player')
    .on('init', function() {
      this.game = window.currentGame
      this.wasPressed = false
      this.speediness = 3
      this.special = 0
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
  function(game) {
    this.angle -= 0.05
  },
  function(game) {
    this.position[0] += Math.cos(this.angle) * this.speediness
    this.position[1] += Math.sin(this.angle) * this.speediness
  },
  function(game) {
    this.angle += 0.05
  },
  function(game, down, up) {
    specials[this.special].emit('tick', this)
    if (down) {
      specials[this.special].emit('init', this)
    } else
    if (up) {
      specials[this.special].emit('stop', this)
    }
  }
]
