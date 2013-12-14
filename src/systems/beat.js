var Chirp = require('../../chirps')
var drums = require('../../chirps/drum-loop/song')

module.exports = BeatSystem

function BeatSystem(game) {
  if (!(this instanceof BeatSystem)) return new BeatSystem(game)
  var chirp = this.chirp = new Chirp.Engine

  if (this.supported = chirp.start())
    chirp.open(drums)

  this.game = game
  this.drums = chirp.tracks[0]
  this.lastPosition = 0
  this.lastBeat = false
  this.playing = false
  this.elapsed = 0
  this.section = 0
  this.bar = 0
}

BeatSystem.prototype.start = start
function start() {
  if (this.supported) this.chirp.play()
}

BeatSystem.prototype.stop = stop
function stop() {

}

BeatSystem.prototype.beat = function() {
  return this.chirp.tracks[0].position * this.chirp.bpm
}

BeatSystem.prototype.position = function() {
  return this.chirp.tracks[0].position
}

BeatSystem.prototype.tick = tick
function tick() {
  //
  // Detect the end of the drum loop
  //
  var position = this.position()
  var last = this.lastPosition

  this.bar = Math.floor(this.chirp.position / this.chirp.bps) % 4
  this.rollover = last - position > 1
  this.lastPosition = position
  this.section += this.rollover ? 1 : 0
  this.section %= 4
  this.elapsed += this.rollover
    ? position
    : last - position

  //
  // Switch HUD power
  //
  if (this.rollover) {
    var powers = this.game.dom.powers
    var curr = this.section
    var prev = (curr + 3) % 4

    powers[curr].classList.add('current')
    powers[prev].classList.remove('current')
  }

  //
  // Detect beats (continuous)
  //
  var notes = this.drums.notes
  var playing = false

  for (var i = 0; i < notes.length; i += 1) {
    if (!notes[i].finished && notes[i].played) {
      playing = true
      break
    }
  }

  this.playing = playing

  //
  // Detect beats (hits only)
  //
  if (this.lastBeat) {
    this.beating = !this.playing
  } else {
    this.beating =  this.playing
  }

  this.lastBeat = this.playing && (this.lastBeat - this.elapsed < 0.1)
    ? this.elapsed
    : false

}
