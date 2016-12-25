'use strict'

function Req (slots) {
  this.slots = slots || {}
  this.data = {
    session: {
      user: {
        userId: '1234'
      }
    }
  }
}

Req.prototype.session = function (key, value) {
  this.data.session[key] = value
}

Req.prototype.slot = function (slotName) {
  return this.slots[slotName]
}

module.exports = Req
