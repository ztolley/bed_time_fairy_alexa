'use strict'

const criteria = {
  'slots': {'member': 'FAMILY_MEMBER'},
  'utterances': [
    '{|please} add {a |} {new |} {child|person}',
    '{|please} add my {MEMBER} {bedtime |}'
  ]
}

function action (req, res) {
  let member = req.slot('MEMBER')
  let prompt

  if (member === 'son' || member === 'sons') {
    prompt = 'Tell me your sons name'
  } else if (member === 'daughter' || member === 'daughters') {
    prompt = 'Tell me your daughters name'
  } else {
    prompt = 'Tell me your childs name'
  }
  res
    .say(prompt)
    .reprompt(prompt)
    .session('journeyName', 'ADDCHILD')
    .shouldEndSession(false)
    .send()
}

module.exports = {
  criteria,
  action
}
