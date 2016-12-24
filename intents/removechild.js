'use strict'
const childDataHelper = require('../data/childdatahelper')
const nameUtils = require('../lib/nameutils')
const simpleCard = require('../lib/cardutils').simpleCard

const criteria = {
  'slots': {'CHILDNAME': 'AMAZON.GB_FIRST_NAME'},
  'utterances': [
    '{please|} {remove|delete} {CHILDNAME} {bedtime|}'
  ]
}

function nothingFound (res, childName, question) {
  let answer = `I'm sorry, I couldn't find anyone called ${childName}.`
  res
    .say(answer)
    .card(simpleCard(question, answer))
    .send()
}

function action (req, res) {
  let childName = req.slot('CHILDNAME')
  if (!childName) return
  let question = `Remove ${childName}.`

  try {
    childName = nameUtils.cleanName(childName)

    return childDataHelper.removeChild(req.data.session.user.userId, childName)
      .then(() => {
        let answer = `I have removed the bedtime slot for ${childName}.`
        res
          .say(answer)
          .card(simpleCard(question, answer))
          .send()
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
