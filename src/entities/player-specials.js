var EventEmitter = require('events').EventEmitter
var specials = module.exports = []
var halfpi = Math.PI / 2

var scratch0 = new Float64Array(2)
var scratch1 = new Float64Array(2)

fireRate(8, define('Shooter'), function(game) {
  scratch0[0] = Math.cos(this.angle) * 5
  scratch0[1] = Math.sin(this.angle) * 5

  game.projectiles.spawn('shooter'
    , 1      // damage
    , this.position // position
    , scratch0 // speed
    , 1      // 1 - friction
    , true   // safe
    , 10     // radius
    , 100   // lifetime
  )
})

fireRate(9, define('Double Shooter'), function(game) {
  scratch0[0] = Math.cos(this.angle) * 6
  scratch0[1] = Math.sin(this.angle) * 6
  scratch1[0] = this.position[0] + Math.cos(this.angle + halfpi) * 10
  scratch1[1] = this.position[1] + Math.sin(this.angle + halfpi) * 10
  game.projectiles.spawn('shooter', 1, scratch1, scratch0, 1, true, 10, 100)
  scratch1[0] = this.position[0] + Math.cos(this.angle - halfpi) * 10
  scratch1[1] = this.position[1] + Math.sin(this.angle - halfpi) * 10
  game.projectiles.spawn('shooter', 1, scratch1, scratch0, 1, true, 10, 100)
})

fireRate(5, define('Scatter Shooter'), function(game) {
  var a = Math.random() * 0.3
  scratch0[0] = Math.cos(this.angle) * 5.75
  scratch0[1] = Math.sin(this.angle) * 5.75
  if (Math.random() < 0.9)
    game.projectiles.spawn('shooter', 1, this.position, scratch0, 1, true, 10, 100)
  scratch1[0] = this.position[0] + Math.cos(this.angle + halfpi) * 15
  scratch1[1] = this.position[1] + Math.sin(this.angle + halfpi) * 15
  scratch0[0] = Math.cos(this.angle + a) * 5.75
  scratch0[1] = Math.sin(this.angle + a) * 5.75
  if (Math.random() < 0.9)
    game.projectiles.spawn('shooter', 1, scratch1, scratch0, 1, true, 10, 100)
  scratch1[0] = this.position[0] + Math.cos(this.angle - halfpi) * 15
  scratch1[1] = this.position[1] + Math.sin(this.angle - halfpi) * 15
  scratch0[0] = Math.cos(this.angle - a) * 5.75
  scratch0[1] = Math.sin(this.angle - a) * 5.75
  if (Math.random() < 0.9)
    game.projectiles.spawn('shooter', 1, scratch1, scratch0, 1, true, 10, 100)
})

define('Laser').on('tick', function(game) {

})

function define(title) {
  var special = new EventEmitter
  special.title = title

  specials.push(special)
  return special
}

function fireRate(rate, special, listener) {
  var counter = 0
  var firing = false

  return special.on('tick', function(player) {
    if (!firing) return
    counter = (counter+1)%rate
    if (!counter) listener.call(player, player.game)
  }).on('init', function() {
    firing = true
  }).on('stop', function() {
    firing = false
  })
}
