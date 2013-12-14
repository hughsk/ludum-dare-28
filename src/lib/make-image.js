module.exports = makeImage

function makeImage(src) {
  var img = document.createElement('img')
  img.src = src
  return img
}
