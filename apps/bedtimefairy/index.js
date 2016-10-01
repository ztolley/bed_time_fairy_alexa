'use strict';

const Alexa = require('alexa-app');
const app = new Alexa.app('bedtimefairy');
const childlistIntent = require('./intents/childlist');

app.launch(function(req, res) {
  var prompt = 'Welcome to bed time fairy.';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('childlist', childlistIntent.criteria, childlistIntent.action);

module.exports = app;
