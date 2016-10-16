'use strict';
const childDataHelper = require('../data/childdatahelper');
const nameUtils = require('../lib/nameutils');

const criteria = {
  'slots': {'CHILDNAME': 'AMAZON.GB_FIRST_NAME'},
  'utterances': [
    "{please|} {remove|delete} {CHILDNAME} {bedtime|}"
  ]
};

function nothingFound(res, childName) {
  res.say(`I'm sorry, I couldn't find anyone called ${childName}.`);
  res.send();
}

function action(req, res) {

  let childName = req.slot('CHILDNAME');
  if (!childName) return;

  try {

    childName = nameUtils.cleanName(childName);

    childDataHelper.removeChild(req.data.session.user.userId, childName)
      .then(() => {
        res.say(`I have removed the bedtime slot for ${childName}.`)
          .send();
      })
      .catch((error) => {
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
