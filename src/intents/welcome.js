'use strict'

const childDataHelper = require('../data/childdatahelper')

function welcome (req, res) {
  childDataHelper.getChildren(req.data.session.user.userId)
    .then((children) => {
      if (children.length === 0) {
        wouldYouLikeToAddSomeone(req, res)
        return
      }

      let prompt = 'Welcome to bedtime fairy.'
      res.say(prompt).reprompt(prompt).shouldEndSession(false)
      res.send()
    })
    .catch((error) => {
      if (error.code && error.code === 404) {
        wouldYouLikeToAddSomeone(req, res)
        return
      }

      console.log(error)
      let prompt = 'Welcome to bedtime fairy. Something is acting weird, but someones working on it.'
      res.say(prompt).reprompt(prompt).shouldEndSession(true)
      res.send()
    })

  return false
}

function wouldYouLikeToAddSomeone (req, res) {
  const prompt = 'Welcome to bedtime fairy. If you would like to add someone then say "Add a child".'
  const reprompt = 'If you would like to add someone then say "Add a child".'
  res.say(prompt).reprompt(reprompt).shouldEndSession(false).send()
}

module.exports = welcome
