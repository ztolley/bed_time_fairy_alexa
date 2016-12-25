'use strict'
let childDataHelper = require('../data/childdatahelper')
const timeUtils = require('../lib/timeutils')
const nameUtils = require('../lib/nameutils')
const simpleCard = require('../lib/cardutils').simpleCard

const criteria = {
  'slots': {'CHILDNAME': 'AMAZON.GB_FIRST_NAME'},
  'utterances': [
    'Is it {CHILDNAME} bed time {yet|}',
    'Is it {CHILDNAME} time for bed {yet|}'
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

  childName = nameUtils.cleanName(childName)
  let question = `Is it ${childName}s bedtime yet?`

  try {
    childDataHelper.findChild(req.data.session.user.userId, childName)
      .then((child) => {
        if (child) {
          let timeDif = timeUtils.timeFromNow(child.bedTime)
          let answer

          if (timeDif < 0) {
            answer = `It is past ${child.fullName}s bedtime.`
          } else if (timeDif < 30) {
            answer = `${child.fullName} must go to bed in ${timeDif} minutes.`
          } else {
            answer = `Don't worry ${child.fullName}, it's not bedtime yet.`
          }

          res
            .say(answer)
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

function setDataHelper (helper) {
  childDataHelper = helper
}

module.exports = {
  criteria,
  action,
  setDataHelper
}
