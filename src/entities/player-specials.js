var EventEmitter = require('events').EventEmitter
var specials = module.exports = []

fireRate(4, define('Shooter'), function(game) {

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
