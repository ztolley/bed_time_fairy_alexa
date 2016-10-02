'use strict';
const childDataHelper = require('../data/childdatahelper');
const timeUtils = require('../lib/timeutils');


const criteria = {
  'slots': {'CHILDNAME': 'AMAZON.GB_FIRST_NAME'},
  'utterances': [
    "When is {CHILDNAME} bed time",
    "When does {CHILDNAME} go to bed",
    "Is it {CHILDNAME}'s bed time",
    "Is it {CHILDNAME}'s time for bed"
  ]
};

function nothingFound(res, childName) {
  res.say(`I'm sorry, I couldn't find anyone called ${childName}`);
  res.send();
}

function action(req, res) {

  let childName = req.slot('CHILDNAME');
  if (!childName) return;

  try {
    childDataHelper.findChild(req.data.session.user.userId, childName)
      .then((child) => {
        if (child) {
          res.say(`${child.fullName}'s bedtime is ${timeUtils.readableTime(child.bedTime)}`)
            .send();
        } else {
          nothingFound(res, childName);
        }
      })
      .error((error) => {
        console.log(error);
        nothingFound(res, childName);
      });
  } catch(error) {
    console.log(error);
    nothingFound(res, childName);
  }

  return false;
}

module.exports = {
  criteria,
  action
};
