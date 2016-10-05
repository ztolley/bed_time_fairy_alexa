'use strict';

const Alexa = require('alexa-app');
const app = new Alexa.app('bedtimefairy');
const childListIntent = require('./intents/childlist');
const addChild = require('./intents/addchild');
const dataHelper = require('./data/childdatahelper');
const childName = require('./intents/childname');
const setBedTime = require('./intents/setbedtime');
const welcome = require('./intents/welcome');
const askChildBedtime = require('./intents/getchildbedtime');
const getBedTime = require('./intents/getchildbedtime');

app.launch(welcome);

app.intent('childlist', childListIntent.criteria, childListIntent.action);
app.intent('addChild', addChild.criteria, addChild.action);
app.intent('setChildName', childName.criteria, childName.action);
app.intent('setBedTime', setBedTime.criteria, setBedTime.action);
app.intent('askBedTime', askChildBedtime.criteria, askChildBedtime.action);
app.intent('getBedTime', getBedTime.criteria, getBedTime.action);

app.pre(function(req, res) {
  dataHelper.createTable();
});

module.exports = app;
