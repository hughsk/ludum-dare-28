var bs = require('bindlestiff')

var Bullet = module.exports = bs.define()

  .use(require('../systems/physics').component)
