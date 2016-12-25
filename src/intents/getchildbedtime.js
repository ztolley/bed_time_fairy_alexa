'use strict'
const childDataHelper = require('../data/childdatahelper')
const timeUtils = require('../lib/timeutils')
const nameUtils = require('../lib/nameutils')
const simpleCard = require('../lib/cardutils').simpleCard

const criteria = {
  'slots': {'CHILDNAME': 'AMAZON.GB_FIRST_NAME'},
  'utterances': [
    'When is {CHILDNAME} bed time',
    'When does {CHILDNAME} go to bed'
  ]
}

function nothingFound (res, childName, question) {
  let answer = `I'm sorry, I couldn't find anyone called ${childName}`
  res
    .say(answer)
    .card(simpleCard(question, answer))
    .send()
}

function action (req, res) {
  let childName = req.slot('CHILDNAME')
  if (!childName) return
  let question = `When does ${childName} goto bed?`

  try {
    childName = nameUtils.cleanName(childName)

    childDataHelper.findChild(req.data.session.user.userId, childName)
      .then((child) => {
        if (child) {
          let answer = `${child.fullName}'s bedtime is ${timeUtils.readableTime(child.bedTime)}`
          res
            .say(`${child.fullName}'s bedtime is ${timeUtils.readableTime(child.bedTime)}`)
            .card(simpleCard(question, answer))
            .send()
        } else {
          nothingFound(res, childName, question)
        }
      })
      .catch((error) => {
        console.log(error)
        nothingFound(res, childName, question)
      })
  } catch (error) {
    console.log(error)
    nothingFound(res, childName, question)
  }

  return false
}

module.exports = {
  criteria,
  action
}
