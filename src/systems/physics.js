var bs = require('bindlestiff')

module.exports = PhysicsSystem

function PhysicsSystem(game) {
  if (!(this instanceof PhysicsSystem)) return new PhysicsSystem(game)
  this.game = game
}

PhysicsSystem.prototype.tick = function() {
  var physical = this.game.manager.find('physical')

  for (var i = 0, l = physical.length; i < l; i += 1) {
    var p = physical[i]

    p.position[0] += p.speed[0]
    p.position[1] += p.speed[1]
  }
}

PhysicsSystem.component = bs.component('physical')
  .on('init', function() {
    this.position = new Float64Array(2)
    this.speed = new Float64Array(2)
  })
