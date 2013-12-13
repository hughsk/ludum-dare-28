var browserify = require('watchify')

module.exports = createBundler

function createBundler(options) {
  var transforms = [ 'glslifyify' ].concat(options.transforms || [])
  var minify = options.minify
  var debug = options.debug
  var count = 0

  if (minify) {
    transforms.push('uglifyify')
  }

  var bundler = browserify({
    entries: [__dirname + '/src/index.js']
    , debug: debug
    , insertGlobals: debug
  })

  transforms.forEach(function(tr) {
    bundler.transform(tr)
  })

  return function() {
    var label = 'browserify build #' + count++
    console.time(label)

    return bundler.bundle().once('end', function() {
      console.timeEnd(label)
    })
  }
}

if (!module.parent) {
  var uglify = require('uglify-js')
  var fs = require('fs')
  var buffer = ''

  createBundler({
    transforms: []
    , minify: true
    , debug: false
  })().on('data', function(data) {
    buffer += data
  }).once('end', function() {
    var result = uglify.minify(buffer, {
      fromString: true
    })

    fs.writeFileSync(__dirname + '/bundle.js', result.code)

    require('./rework')({
      debug: false
    })().pipe(
      fs.createWriteStream(__dirname + '/style.css')
    ).once('close', function() {
      process.exit()
    })
  })
}
