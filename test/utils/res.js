'use strict';

function Res(done) {
  this.said = '';
  this.done = done;
  this.cardObject = {};
}

Res.prototype.say = function(words) {
  this.said = words;
  return this;
};

Res.prototype.reprompt = function(words) {
  return this;
};

Res.prototype.session = function(sessionVars) {
  return this;
};

Res.prototype.shouldEndSession = function(shoudEnd) {
  return this;
}

Res.prototype.send = function() {
  this.done({said: this.said, card: this.cardObject});
};

Res.prototype.card = function(cardObject) {
  this.cardObject = cardObject;
  return this;
};

module.exports = Res;
