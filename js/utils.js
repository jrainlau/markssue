export const hijackHistory = function (type) {
  var orig = window.history[type]
  return function() {
      const rv = orig.apply(this, arguments)
      const e = new Event(type)
      e.arguments = arguments
      window.dispatchEvent(e)
      return rv
  }
}
