'use strict';
let childDataHelper = require('../data/childdatahelper');
const timeUtils = require('../lib/timeutils');


const criteria = {
  'slots': {'CHILDNAME': 'AMAZON.GB_FIRST_NAME'},
  'utterances': [
    "Is it {CHILDNAME}'s bed time {yet|}",
    "Is it {CHILDNAME}'s time for bed {yet|}"
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

          let timeDif = timeUtils.timeFromNow(child.bedTime);

          if (timeDif < 0) {
            console.log('past bed time');
            res.say(`It is past ${child.fullName}s bedtime.`).send();
          } else if (timeDif < 30) {
            res.say(`${child.fullName} must go to bed in ${timeDif} minutes.`).send();
          } else {
            res.say(`Don't worry ${child.fullName}, it's not bedtime yet.`).send();
          }

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

function setDataHelper(helper) {
  childDataHelper = helper;
}

module.exports = {
  criteria,
  action,
  setDataHelper
};
