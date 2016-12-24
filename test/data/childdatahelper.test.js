/* global beforeEach: true, describe: true, it: true, context: true */

'use strict'
process.env.TEST = true

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect
const childDataHelper = require('../../data/childdatahelper')

chai.use(chaiAsPromised)

describe('Child data helper', () => {
  let bedTimeFairyTable

  beforeEach((done) => {
    childDataHelper.dropTable()
      .then(() => {
        return childDataHelper.createTable()
      })
      .then((table) => {
        bedTimeFairyTable = table
        done()
      })
      .catch((error) => {
        console.log(error)
        done()
      })
  })

  describe('Allows you to edit children', () => {
    context('When the database is empty', () => {
      it('Should create an entry with the user id if you are adding a child for first time', (done) => {
        childDataHelper.addChild('1234', 'Fred', 1930)
          .then(() => {
            return bedTimeFairyTable.scan()
          })
          .then((allrecords) => {
            expect(allrecords.length).to.eq(1)
            expect(allrecords[0].userId).to.eq('1234')
            expect(allrecords[0].children.length).to.equal(1)
            expect(allrecords[0].children[0]).to.eql({
              fullName: 'Fred',
              bedTime: 1930
            })
            done()
          })
      })
      it('Should return an error saying no child found if you try to edit a child', (done) => {
        childDataHelper.updateChild('1234', 'Fred', 1930)
          .then(() => {
            expect.fail()
          })
          .catch((error) => {
            expect(error.code).to.eq(404)
            done()
          })
      })
    })
    context('When there is some data in the database', () => {
      beforeEach((done) => {
        bedTimeFairyTable
          .insert({
            userId: '1234',
            children: [{fullName: 'Jade', bedTime: 2000}]
          })
          .then(() => {
            done()
          })
      })
      it('Should add a new child to child property if child with name doesnt exist', (done) => {
        childDataHelper.addChild('1234', 'Fred', 1930)
          .then(() => {
            return bedTimeFairyTable.scan()
          })
          .then((allrecords) => {
            expect(allrecords.length).to.eq(1)
            expect(allrecords[0].userId).to.eq('1234')
            expect(allrecords[0].children.length).to.equal(2)
            expect(allrecords[0].children[1]).to.eql({
              fullName: 'Fred',
              bedTime: 1930
            })
            done()
          })
          .catch((error) => {
            expect.fail(error)
          })
      })
      it('Should update an existing child property if it exists', (done) => {
        childDataHelper.updateChild('1234', 'Jade', 2100)
          .then(() => {
            return bedTimeFairyTable.scan()
          })
          .then((allrecords) => {
            expect(allrecords.length).to.eq(1)
            expect(allrecords[0].userId).to.eq('1234')
            expect(allrecords[0].children.length).to.equal(1)
            expect(allrecords[0].children[0]).to.eql({
              fullName: 'Jade',
              bedTime: 2100
            })
            done()
          })
      })
      it('Should allow you to remove a child', (done) => {
        childDataHelper.removeChild('1234', 'Jade')
          .then(() => {
            return bedTimeFairyTable.scan()
          })
          .then((allrecords) => {
            expect(allrecords[0].children.length).to.eq(0)
            done()
          })
      })
      it('Should return an error telling you the child doesnt exist if you try to edit a non existant child', (done) => {
        childDataHelper.updateChild('1234', 'James', 2100)
          .then(() => {
            expect.fail()
          })
          .catch((error) => {
            expect(error.code).to.eq(404)
            done()
          })
      })
      it('Should return an error telling you the child doesnt exist if you try to remove a non existant child', (done) => {
        childDataHelper.removeChild('1234', 'James', 2100)
          .then(() => {
            expect.fail()
          })
          .catch((error) => {
            expect(error.code).to.eq(404)
            done()
          })
      })
      it('Should return an error tell you the child already exists if you try to add a child with a name that exists', (done) => {
        childDataHelper.addChild('1234', 'Jade', 1930)
          .then(() => {
            expect.fail()
          })
          .catch((error) => {
            expect(error.code).to.eq(409)
            done()
          })
      })
    })
  })

  describe('Lookup child data', () => {
    beforeEach((done) => {
      bedTimeFairyTable
        .insert({
          userId: '1234',
          children: [{fullName: 'Jade', bedTime: 2000}]
        })
        .then(() => {
          done()
        })
    })
    it('Should return a list of all the users children', (done) => {
      childDataHelper.getChildren('1234')
        .then((children) => {
          expect(children.length).to.eq(1)
          expect(children).to.eql([{fullName: 'Jade', bedTime: 2000}])
          done()
        })
    })
    it('Should return the bed time for a given child name for a user', (done) => {
      childDataHelper.getBedTime('1234', 'Jade')
        .then((bedTime) => {
          expect(bedTime).to.eq(2000)
          done()
        })
    })
    it('Should return the bed time for a child given a plural match', (done) => {
      childDataHelper.getBedTime('1234', 'Jades')
        .then((bedTime) => {
          expect(bedTime).to.eq(2000)
          done()
        })
    })
    it('Should get a 404 if you ask for children for a user id that doesnt exist', (done) => {
      childDataHelper.getChildren('1244')
        .then(() => {
          expect.fail()
        })
        .catch((error) => {
          expect(error.code).to.eq(404)
          done()
        })
    })
    it('Should get a 404 if you ask for a bed time for a user id that doesnt exist', (done) => {
      childDataHelper.getBedTime('1244', 'Fred')
        .then(() => {
          expect.fail()
        })
        .catch((error) => {
          expect(error.code).to.eq(404)
          done()
        })
    })
    it('Should get a 404 if you ask for a bed time for a child that doesnt exist', (done) => {
      childDataHelper.getBedTime('1234', 'Fred')
        .then(() => {
          expect.fail()
        })
        .catch((error) => {
          expect(error.code).to.eq(404)
          done()
        })
    })
  })
})
