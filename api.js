'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      console.log("In app.route().post().");
      // for ease of typing
      let text = req.body.text;
      let locale = req.body.locale;
      // for debugging
      console.log("text: " + text + ", locale: " + locale);

      // call translator.translate() and send an error response if the result is an error; otherwise, send the a response object with text and translation properties
      let translationResult = translator.translate(text, locale);
      if(translationResult.hasOwnProperty("error") == true) {
        console.log("translationResult has an error. Sending error: " + translationResult.error);
        res.send({ error: translationResult.error });
      } else {
        let responseObject = {
          text: req.body.text,
          translation: translationResult
        }
        console.log("translationResult has no errors. Sending response object: ");
        console.log(responseObject);
        res.send(responseObject);
      } // end if-else checking for error
    }); // end .post()
}; // end module.exports function
