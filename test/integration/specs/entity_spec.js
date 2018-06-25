/* global describe, expect, HttpStatusCodes, it, request */

describe('Entity API', function() {

  describe('GET /entities', () => {
    it('returns entities', done => {
      request
        .get('/entities')
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(HttpStatusCodes.OK);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('POST /entities', () => {
    it('sends an entity', done => {
      request
        .post('/entities')
        .send({ 'attr': 'Example integration test' })
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(HttpStatusCodes.OK);
          expect(res.body).to.have.property('attr', 'Example integration test');
          done();
        });
    });
  });

});
