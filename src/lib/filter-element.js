var slice = Array.prototype.slice

module.exports = filter

function filter(nodes, tag) {
  tag = tag.toUpperCase()
  return slice.call(nodes).filter(function(node) {
    return (node.tagName || '').toUpperCase() === tag
  })
}
