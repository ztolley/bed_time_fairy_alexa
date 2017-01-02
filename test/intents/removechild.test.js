/* globals describe: true, it: true, beforeEach: true */
'use strict'
process.env.TEST = true

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect
const childDataHelper = require('../../src/data/childdatahelper')

const removeChildIntent = require('../../src/intents/removechild')
const Req = require('../utils/req')
const Res = require('../utils/res')

describe('Remove child intent', () => {
  beforeEach((done) => {
    childDataHelper.dropTable()
      .then(() => {
        return childDataHelper.createTable()
      })
      .then(() => {
        return childDataHelper.addChild('1234', 'Leroy', '19:00')
      })
      .then(() => {
        done()
      })
      .catch((error) => {
        console.log(error)
        done()
      })
  })

  it('should handle when it finds the child', (done) => {
    const req = new Req({'CHILDNAME': 'Leroy'})
    const res = new Res((state) => {
      expect(state.said).to.eq('I have removed the bedtime slot for Leroy.')
      childDataHelper.getChildren('1234')
        .then((children) => {
          expect(children.length).to.eq(0)
          done()
        })
    })

    removeChildIntent.action(req, res)
  })
  it('should handle when there is no child with that name', (done) => {
    const req = new Req({'CHILDNAME': 'Jade'})
    const res = new Res((state) => {
      expect(state.said).to.eq('I\'m sorry, I couldn\'t find anyone called Jade.')
      done()
    })

    try {
      removeChildIntent.action(req, res)
    } catch (error) {
      console.log(error)
    }
  })
})
