'use strict';

function Res(done) {
  this.said = '';
  this.done = done;
}

Res.prototype.say = function(words) {
  this.said = words;
  return this;
};

Res.prototype.send = function() {
  this.done({said: this.said});
};


module.exports = Res;
