'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

const childlist = require('../../intents/childlist');

chai.use(chaiAsPromised);

describe('Child list intent', () => {
    describe('Phrases explaining children added', () => {
        context('when there are no children', () => {
            const children = [];
            it('should tell you there are no children', () => {
                const phrase = childlist.getChildListPhrase(children);
                expect(phrase).to.eq('You have not added any children yet.');
            });
        });
    });
});

