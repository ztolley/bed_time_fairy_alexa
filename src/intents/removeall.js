'use strict'

const simpleCard = require('../lib/cardutils').simpleCard
const childDataHelper = require('../data/childdatahelper')
const criteria = {
  'utterances': [
    '{delete|remove} {|all|my|our} children {|living in this house|living here|here}'
  ]
}

function action (req, res) {
  let question = 'Remove all from bedtime fairy'

  childDataHelper.removeAllChildren(req.data.session.user.userId)
    .then(() => {
      res
        .say('I have removed all the children from my bed times.')
        .card(simpleCard(question, 'I have removed all the children from my bed times.'))
        .send()
    })
    .catch((e) => {
      console.log(e)
      res
        .say('Sorry, not sure why but I am unable to do that right now.')
        .card(question, 'Sorry, not sure why but I am unable to do that right now.')
        .send()
    })

  return false
}

module.exports = {
  criteria,
  action
}
