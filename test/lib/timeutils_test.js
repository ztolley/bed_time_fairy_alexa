'use strict';
process.env.TEST = true;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const timeUtils = require('../../lib/timeutils');

describe('Is it bed time?', () => {

  it('should return the right time for 7 oclock', () => {
    const timeResult = timeUtils.readableTime('07:00');
    expect(timeResult).to.eq('7:00pm');
  });
  it('should return the right time for 7:04', () => {
    const timeResult = timeUtils.readableTime('07:04');
    expect(timeResult).to.eq('7:04pm');
  });
  it('should return the right time for 7:45', () => {
    const timeResult = timeUtils.readableTime('07:45');
    expect(timeResult).to.eq('7:45pm');
  });
  it('should return the right time for 1945', () => {
    const timeResult = timeUtils.readableTime('19:45');
    expect(timeResult).to.eq('7:45pm');
  });

});



