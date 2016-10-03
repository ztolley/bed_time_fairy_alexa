'use strict';

const childDataHelper = require('../data/childdatahelper');
const timeUtils = require('../lib/timeutils');
const criteria = {
  'slots': {'BEDTIME': 'TIME'},
  'utterances': ['{her bedtime is |his bedtime is|} {BEDTIME}']
};
const BEDTIME = 'BEDTIME';


function action(req, res) {

  try {
    // see if we are in a flow by checking session.currentJourney
    if (req.session('journeyName') !== 'ADDCHILD') {
      res.fail('Not currently adding a bed time');
      return;
    }

    const childName = req.session('childName');
    if (!childName || childName.length === 0) {
      res
        .shouldEndSession(true)
        .say(`I'm so confused. Please start again.`)
        .send();

      return;
    }


    if (!req.slot(BEDTIME) || !timeUtils.validTime(req.slot(BEDTIME))) {
      res
        .shouldEndSession(false)
        .say(`I'm sorry, I don't understand the bed time you told me, can you try again?`)
        .reprompt(`Try telling me the time ${childName} goes to bed, for example: Seven Thirty`)
        .send();

      return;
    }

    const bedTime = timeUtils.makeAllTimesPM(req.slot('BEDTIME'));

    childDataHelper.addChild(
      req.data.session.user.userId,
      childName,
      bedTime)
      .then(() => {
        res
          .shouldEndSession(true)
          .say(`OK, I have set ${childName}'s bedtime to ${bedTime}`)
          .send();
      })
      .catch((error) => {
        if (error.code && error.code == 409) {
          res
            .shouldEndSession(true)
            .say(`It looks like you have already added a bed time for ${childName}.`)
            .send();
        } else {
          handleError(error);
        }
      });

  } catch(error) {
    handleError(error)
  }
  return false;
}

function handleError(error) {
  console.log(error);
  res
    .shouldEndSession(true)
    .say("I'm sorry, but for some reason I am unable to do that right now. I've let someone know, hopefully they can fix it")
    .send();
}


module.exports = {
  criteria,
  action
};
