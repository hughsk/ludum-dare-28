var bs = require('bindlestiff')
var pool = require('object-pool')({
    init:    function() { return new Projectile }
  , enable:  function(projectile) { projectile.enabled(true) }
  , disable: function(projectile) { projectile.enabled(false) }
})

module.exports = ProjectileSystem

function ProjectileSystem(game) {
  if (!(this instanceof ProjectileSystem)) return new ProjectileSystem(game)

  this.game = game
}

ProjectileSystem.prototype.tick = function() {
  var enemies = this.game.manager.find('enemy')
  var enemyCount = enemies.length
  var player = this.game.player
  var n = pool.list.length
  var p = pool.list.first

  while (n--) {
    var projectile = p.data
    var pos = projectile.position
    p = p.next

    projectile.lifetime -= 1
    if (projectile.lifetime < 1) {
      pool.remove(projectile)
    }

    if (projectile.safe) {
      var e = enemyCount
      while (e--) {
        var enemy = enemies[e]
        var ex = enemy.position[0]-pos[0]
        var ey = enemy.position[1]-pos[1]
        var distsq = ex*ex+ey*ey
        if (distsq < projectile.radius) {
          enemy.trigger('hurt', projectile.damage)
        }
      }
    } else {
      var px = player.position[0]-pos[0]
      var py = player.position[1]-pos[1]
      var distsq = px*px+py*py
      if (distsq < projectile.radius) {
        player.trigger('hurt', projectile.damage)
      }
    }
  }
}

ProjectileSystem.prototype.render = function(ctx) {
  var n = pool.list.length
  var p = pool.list.first

  ctx.fillStyle = '#fff'
  while (n--) {
    var projectile = p.data
    p = p.next

    ctx.fillRect(projectile.position[0]-5, projectile.position[1]-5, 10, 10)
  }
}

ProjectileSystem.prototype.spawn = function(
  kind, // string name
  damage,
  position,
  speed,
  friction,
  radius,
  safe, // safe to hit player
  lifetime
) {
  var projectile = pool.create()

  projectile.parent = this
  projectile.kind = kind
  projectile.damage = damage
  projectile.position[0] = position[0]
  projectile.position[1] = position[1]
  projectile.speed[0] = speed[0]
  projectile.speed[1] = speed[1]
  projectile.friction = friction
  projectile.safe = safe
  projectile.radius = radius // actually stored as radius^2
  projectile.lifetime = lifetime

  this.game.manager.add(projectile)

  return projectile
}

var Projectile = bs.define()
  .use(require('./physics').component)
  .use(bs.component('projectile')
    .on('init', function() {
      this.parent = null
      this.friction = 1
      this.alive = false
      this.kind = null
      this.safe = true
      this.damage = 0
    })
  )

Projectile.prototype.enabled = function(value) {
  if (!(this.alive = value)) {
    this.parent.game.manager.remove(this)
  }

  return value
}
