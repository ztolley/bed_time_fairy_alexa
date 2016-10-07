'use strict';

const childDataHelper = require('../data/childdatahelper');
const criteria = {
  'utterances': [
    '{delete|remove} {|all|my|our} children {|living in this house|living here|here}'
  ]
};

function action(req, res) {

  childDataHelper.removeAllChildren(req.data.session.user.userId)
    .then(() => {
      res.say("I have removed all the children from my bed times.");
      res.send();
    })
    .catch((e) => {
      console.log(e);
      res.say("Sorry, not sure why but I am unable to do that right now.");
      res.send();
    });

  return false;
}


module.exports = {
  criteria,
  action
};
