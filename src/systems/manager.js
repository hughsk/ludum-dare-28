var bs = require('bindlestiff')

module.exports = createManager

function createManager(game) {
  var manager = bs.manager()
  manager.game = game
  return manager
}
