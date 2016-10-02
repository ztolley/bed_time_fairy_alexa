'use strict';

const Alexa = require('alexa-app');
const app = new Alexa.app('bedtimefairy');
const childListIntent = require('./intents/childlist');
const dataHelper = require('./data/childdatahelper');


app.launch(function(req, res) {
  var prompt = 'Welcome to bed time fairy.';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('childlist', childListIntent.criteria, childListIntent.action);


app.pre(function(req, res) {
  dataHelper.createTable();
});

module.exports = app;
