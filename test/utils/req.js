'use strict';


function Req(slots) {
  this.slots = slots || {};
}

Req.prototype.data = {
  session: {
    user: {
      userId: '1234'
    }
  }
};

Req.prototype.slot = function(slotName) {
  return this.slots[slotName];
};

module.exports = Req;
