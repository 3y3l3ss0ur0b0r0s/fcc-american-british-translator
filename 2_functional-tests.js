const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
  // Translation with text and locale fields: POST request to /api/translate
  test('Translation with text and locale fields: POST request to /api/translate', (done) => {
  chai.request(server)
    .keepOpen()
    .post('/api/translate')
    .send({
      text: "We are out in the parking lot.",
      locale: "american-to-british"
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      // make sure response is the correct translation
      assert.equal(res.body.translation, 'We are out in the <span class="highlight">car park</span>.');
      done();
    });
  });
  
  // Translation with text and invalid locale field: POST request to /api/translate
  test('Translation with text and invalid locale field: POST request to /api/translate', (done) => {
  chai.request(server)
    .keepOpen()
    .post('/api/translate')
    .send({
      text: "We are out in the parking lot.",
      locale: "english-to-english"
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      // make sure response has .error property: 'Invalid value for locale field'
      assert.equal(res.body.error, 'Invalid value for locale field');
      done();
    });
  });
  
  // Translation with missing text field: POST request to /api/translate
  test('Translation with missing text field: POST request to /api/translate', (done) => {
  chai.request(server)
    .keepOpen()
    .post('/api/translate')
    .send({
      locale: "american-to-british"
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      // make sure response has .error property: 'Required field(s) missing'
      assert.equal(res.body.error, 'Required field(s) missing');
      done();
    });
  });
  
  // Translation with missing locale field: POST request to /api/translate
    test('Translation with missing locale field: POST request to /api/translate', (done) => {
  chai.request(server)
    .keepOpen()
    .post('/api/translate')
    .send({
      text: "We are out in the parking lot."
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      // make sure response has .error property: 'Required field(s) missing'
      assert.equal(res.body.error, 'Required field(s) missing');
      done();
    });
  });
  
  // Translation with empty text: POST request to /api/translate
  test('Translation with empty text: POST request to /api/translate', (done) => {
  chai.request(server)
    .keepOpen()
    .post('/api/translate')
    .send({
      text: "",
      locale: "american-to-british"
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      // make sure response has .error property: 'No text to translate'
      assert.equal(res.body.error, 'No text to translate');
      done();
    });
  });

  // Translation with text that needs no translation: POST request to /api/translate
  test('Translation with text that needs no translation: POST request to /api/translate', (done) => {
  chai.request(server)
    .keepOpen()
    .post('/api/translate')
    .send({
      text: "We are out in the car park.",
      locale: "american-to-british"
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      // make sure response has "Everything looks good to me!" as the translation value
      assert.equal(res.body.translation, "Everything looks good to me!");
      done();
    });
  });

}); // end suite
