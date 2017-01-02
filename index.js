'use strict'

const Alexa = require('alexa-app')
const app = new Alexa.app('bedtimefairy')
const childListIntent = require('./src/intents/childlist')
const addChild = require('./src/intents/addchild')
const dataHelper = require('./src/data/childdatahelper')
const childName = require('./src/intents/childname')
const setBedTime = require('./src/intents/setbedtime')
const welcome = require('./src/intents/welcome')
const askChildBedtime = require('./src/intents/getchildbedtime')
const getBedTime = require('./src/intents/getchildbedtime')
const isItBedTime = require('./src/intents/isitbedtime')
const removeAll = require('./src/intents/removeall')
const removeChild = require('./src/intents/removechild')
const winston = require('winston')

const defaultLogLevel = (process.env.NODE_ENV === 'development') ? 'debug' : 'error'
winston.level = process.env.LOG_LEVEL || defaultLogLevel

app.launch(welcome)

app.intent('childlist', childListIntent.criteria, childListIntent.action)
app.intent('addChild', addChild.criteria, addChild.action)
app.intent('setChildName', childName.criteria, childName.action)
app.intent('setBedTime', setBedTime.criteria, setBedTime.action)
app.intent('askBedTime', askChildBedtime.criteria, askChildBedtime.action)
app.intent('getBedTime', getBedTime.criteria, getBedTime.action)
app.intent('isItBedTime', isItBedTime.criteria, isItBedTime.action)
app.intent('removeAll', removeAll.criteria, removeAll.action)
app.intent('removeChild', removeChild.criteria, removeChild.action)

app.pre(function(req, res) {
  dataHelper.createTable()
})

module.exports = app
