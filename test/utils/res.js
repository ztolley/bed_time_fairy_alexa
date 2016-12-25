'use strict'

function Res (done) {
  this.said = ''
  this.done = done
  this.cardObject = {}
  this.sessionData = {}
}

Res.prototype.say = function (words) {
  this.said = words
  return this
}

Res.prototype.reprompt = function () {
  return this
}

Res.prototype.session = function (key, value) {
  this.sessionData[key] = value
  return this
}

Res.prototype.shouldEndSession = function () {
  return this
}

Res.prototype.send = function () {
  this.done({said: this.said, card: this.cardObject, session: this.sessionData})
}

Res.prototype.card = function (cardObject) {
  this.cardObject = cardObject
  return this
}

Res.prototype.fail = function() {
  return this
}

module.exports = Res
