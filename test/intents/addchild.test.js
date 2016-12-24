'use strict';
process.env.TEST = true;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

const addChildintent = require('../../intents/addchild');
const Req = require('../utils/req');
const Res = require('../utils/res');


describe('Is it bed time?', () => {

  it('Handle when you wish to add your son', (done) => {
    const req = new Req({'MEMBER': 'son'});
    const res = new Res((state) => {
      expect(state.said).to.eq("Tell me your sons name");
      done();
    });

    addChildintent.action(req, res);
  });
  it('Handle when you wish to add your daughter', (done) => {
    const req = new Req({'MEMBER': 'daughter'});
    const res = new Res((state) => {
      expect(state.said).to.eq("Tell me your daughters name");
      done();
    });

    addChildintent.action(req, res);
  });
  it('Handle when you wish to add your child', (done) => {
    const req = new Req();
    const res = new Res((state) => {
      expect(state.said).to.eq("Tell me your childs name");
      done();
    });

    addChildintent.action(req, res);
  });

  it('should set a session variable to start getting child details');

});



