'use strict';
process.env.TEST = true;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const childDataHelper = require('../../data/childdatahelper');

const isItBedTimeIntent = require('../../intents/isitbedtime');
const Req = require('../utils/req');
const Res = require('../utils/res');
const moment = require('moment');


describe('Is it bed time?', () => {

  beforeEach((done) => {
    childDataHelper.dropTable()
      .then(() => {
        return childDataHelper.createTable();
      })
      .then(() => {
        isItBedTimeIntent.setDataHelper(childDataHelper);
        done();
      })
      .catch((error) => {
        console.log(error);
        done();
      })
  });

  it('should handle when it is not bed time for at least half an hour', (done) => {
    let bedTime = moment().add(1, 'hours').format('H:mm');

    childDataHelper.addChild('1234', 'Fred', bedTime)
    .then(() => {
      const req = new Req({'CHILDNAME': 'Fred'});
      const res = new Res((state) => {
        expect(state.said).to.eq("Don't worry Fred, it's not bedtime yet.");
        done();
      });

      isItBedTimeIntent.action(req, res);
    });
  });
  it('should handle when there is no child with that name', (done) => {
    let bedTime = moment().add(10, 'minutes').format('H:mm');

    childDataHelper.addChild('1234', 'Fred', bedTime)
      .then(() => {
        const req = new Req({'CHILDNAME': 'Wilma'});
        const res = new Res((state) => {
          expect(state.said).to.eq("I'm sorry, I couldn't find anyone called Wilma");
          done();
        });

        isItBedTimeIntent.action(req, res);
      });
  });
  it('should handle if bed time is within the next half hour', (done) => {
    let bedTime = moment().add(10, 'minutes').format('H:mm');

    childDataHelper.addChild('1234', 'Fred', bedTime)
      .then(() => {
        const req = new Req({'CHILDNAME': 'Fred'});
        const res = new Res((state) => {
          expect(state.said).to.eq("Fred must go to bed in 10 minutes.");
          done();
        });

        isItBedTimeIntent.action(req, res);
      });
  });
  it('should handle when it is after bed time', (done) => {
    let bedTime = moment().subtract(10, 'minutes').format('H:mm');

    childDataHelper.addChild('1234', 'Fred', bedTime)
      .then(() => {
        const req = new Req({'CHILDNAME': 'Fred'});
        const res = new Res((state) => {
          expect(state.said).to.eq("It is past Freds bedtime.");
          done();
        });

        isItBedTimeIntent.action(req, res);
      });
  });

});



