/* globals describe: true, it: true */
'use strict'
process.env.TEST = true

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

const childNameIntent = require('../../intents/childname')
const Req = require('../utils/req')
const Res = require('../utils/res')

describe('Is it bed time?', () => {
  it('Should set the child name session variable', (done) => {
    const req = new Req({'CHILDNAME': 'Leroy'})
    const res = new Res((state) => {
      expect(state.session.childName).to.eq('Leroy')
      done()
    })

    childNameIntent.action(req, res)
  })

  it('Should say it added the child name', (done) => {
    const req = new Req({'CHILDNAME': 'Leroy'})
    const res = new Res((state) => {
      expect(state.said).to.eq('What time does Leroy go to bed?')
      done()
    })

    childNameIntent.action(req, res)
  })
})
