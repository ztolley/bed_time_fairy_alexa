'use strict'

const criteria = {
  'slots': {'CHILDNAME': 'GB_FIRST_NAME'},
  'utterances': ["{his name's|her name's|his name is|her name is|} {CHILDNAME}"]
}

function action (req, res) {
  // see if we are in a flow by checking session.currentJourney
  if (req.session('journeyName') !== 'ADDCHILD') {
    res.fail('Not currently adding a bed time')
    return
  }

  let childName = req.slot('CHILDNAME')
  res.session('childName', childName)

  res.say(`What time does ${childName} go to bed?`)
    .shouldEndSession(false)
    .send()
}

module.exports = {
  criteria,
  action
}
