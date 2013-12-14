// Modules
var filterElements = require('./lib/filter-element')
var img = require('./lib/make-image')
var raf = require('raf')

// Systems
var projectiles = require('./systems/projectiles')
var physics = require('./systems/physics')
var manager = require('./systems/manager')
var input = require('./systems/input')
var beats = require('./systems/beat')

// Entities
var Player = require('./entities/player')

// DOM Elements
var dom = {
    hud: document.getElementById('hud')
  , powers: filterElements(
    document.getElementById('power-list').childNodes
  , 'li')
}

var images = {
  sections: [
      img('css/up.png')
    , img('css/turn.png')
    , img('css/go.png')
    , img('css/down.png')
  ]
}

module.exports = Game

function Game() {
  if (!(this instanceof Game)) return new Game

  window.currentGame = this

  // systems
  this.projectiles = projectiles(this)
  this.physics     = physics(this)
  this.manager     = manager(this)
  this.input       = input(this)
  this.beats       = beats(this)
  this.dom         = dom

  this.player  = new Player(this)
  this.player.position[0] = 0
  this.player.position[1] = 0

  this.start()
}

Game.prototype.start = function start() {
  var self = this

  this.beats.start()

  raf().on('data', function() {
    self.tick()
    self.render()
  })
}

Game.prototype.tick = function tick() {
  this.beats.tick()
  this.input.tick()

  this.physics.tick()
  this.projectiles.tick()
}

var canvas = document.createElement('canvas')
var ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

document.body.appendChild(canvas)

var scale = 10
Game.prototype.render = function() {
  var playing = this.beats.playing
  var beating = this.beats.beating
  var section = this.beats.section
  var bar = this.beats.bar
  var player = this.player

  player.trigger('tick', this)

  switch (section) {
    case 0: ctx.fillStyle = '#0ff'; break
    case 1: ctx.fillStyle = '#0f0'; break
    case 2: ctx.fillStyle = '#00f'; break
    case 3: ctx.fillStyle = '#f00'; break
  }

  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.globalAlpha = 0.8
  ctx.drawImage(images.sections[section], (window.innerWidth-800)/2, (window.innerHeight-600)/2, 800, 600)
  ctx.globalAlpha = 1

  ctx.save()
  ctx.translate(window.innerWidth/2, window.innerHeight/2)
    ctx.fillStyle = playing ? '#fff' : '#aaa'
    if (beating) {
      scale = 20
    } else {
      scale += (10 - scale) * 0.05
    }

    ctx.save()
    ctx.translate(player.position[0], player.position[1])
    ctx.rotate(player.angle)
      ctx.fillRect(-scale, -scale, scale*2, scale*2)
    ctx.restore()

    this.projectiles.render(ctx)
  ctx.restore()
}

// Start the game
new Game
