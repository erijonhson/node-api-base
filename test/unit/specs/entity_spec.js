/* global describe, expect, it */

const entityService = require('../../../src/services/entity/entity.service');

describe('Entity Unit Test', () => {

  it('returns entities', (done) => {
    entityService.indexAsync({limit: 1, offset: 1}).then((data) => {
      expect(data).to.to.include.all.keys('count', 'rows');
      done();
    }).catch(done);
  });

});
