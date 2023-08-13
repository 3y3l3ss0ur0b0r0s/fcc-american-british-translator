const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
  
  translate(text, locale) {
    console.log("In translator.translate().");
    // ----- Catching errors --------------------------------------------------------------------
    // (If one or more of the required fields is missing, return { error: 'Required field(s) missing' }.)
    if(text == null || locale == null) {
      return { error: 'Required field(s) missing' };
    }
    // (If text is empty, return { error: 'No text to translate' })
    if(text == "") {
      return { error: 'No text to translate' };
    }
    // (If locale does not match one of the two specified locales, return { error: 'Invalid value for locale field' }.)
    if(locale != "american-to-british" && locale != "british-to-american") {
      return { error: 'Invalid value for locale field' };
    }
    console.log("Made it past error-checking.");
    // ----- / Catching errors ------------------------------------------------------------------
    // ----- Get originalLanguage value ---------------------------------------------------------
    let originalLanguage = locale.substring(0, locale.indexOf('-'));
    let newLanguage = originalLanguage == 'british' ? 'american' : 'british';
    console.log("originalLanguage: " + originalLanguage + ", newLanguage: " + newLanguage);
    // ----- / Get originalLanguage value -------------------------------------------------------
    // ------------------------------------------------------------------------------------------
    // ----- Look for American-only or British-only content -------------------------------------
    // (The /api/translate route should handle the way time is written in American and British English. For example, ten thirty is written as "10.30" in British English and "10:30" in American English. The span element should wrap the entire time string, i.e. <span class="highlight">10:30</span>.)

    //
    // translation logic here
    //
    // remember, any replaced strings need to be wrapped in <span class="highlight">...</span>
    // make a deep copy of the text string to alter
    let translation = text;
    console.log("translation: " + translation);
    if(originalLanguage == "british") {
      console.log("originalLanguage == \"british\": " + originalLanguage);
      
      // for words - british to american
      Object.entries(britishOnly).map((wordPair) => {
        let originalWord = wordPair[0];
        let originalWordRegex = new RegExp(`(?<![A-Za-z\-])${originalWord}(?![A-Za-z\-])`, 'i');
        let translatedWord = wordPair[1];
        while(originalWordRegex.test(translation) == true) {
          translation = translation.replace(originalWordRegex, ('<span class="highlight">' + translatedWord + '</span>'));
          //console.log("\tTranslated something else! Here: " + translation);
        } // end while (for continuing to replace found originalWords)
      }); // end .map()

      Object.entries(americanToBritishSpelling).map((wordPair) => {
        let originalWord = wordPair[1];
        let originalWordRegex = new RegExp(`(?<![A-Za-z\-])${originalWord}(?![A-Za-z\-])`, 'i');
        let translatedWord = wordPair[0];
        while(originalWordRegex.test(translation) == true) {
          translation = translation.replace(originalWordRegex, ('<span class="highlight">' + translatedWord + '</span>'));
          //console.log("\tTranslated something else! Here: " + translation);
        } // end while (for continuing to replace found originalWords)
      }); // end .map()
      
      // for titles - british to american
      Object.entries(americanToBritishTitles).map((titlePair) => {
        let originalWord = titlePair[1];
        let translatedWord = titlePair[0];
        console.log("originalWord: " + originalWord + ", translatedWord: " + translatedWord);
        translatedWord = translatedWord.replace(/^([a-z]{1})/, translatedWord.charAt(0).toUpperCase());
        // find the translated word, but with a period at the end
        // double-backslash for period because between ` characters...?
        let wordRegex = new RegExp(`(?<![A-Za-z])${originalWord}(?![\\.A-Z])`, 'i');
        while(wordRegex.test(translation) == true) {
          translation = translation.replace(wordRegex, ('<span class="highlight">' + translatedWord + '</span>')); 
          console.log("\tTranslated something else! Here: " + translation);
          return;
        } // end while
      }); // end .map()
        
      // for times - british to american
      let timeRegex = /(\d{1,2})\.(\d{2})/;
      let timeMatch = translation.match(timeRegex);
      let firstPart;
      let lastPart;
      while(timeMatch != null) {
        firstPart = timeMatch[1];
        lastPart = timeMatch[2];
        let newTime = '<span class="highlight">' + firstPart + ":" + lastPart + '</span>';
        timeRegex = /(\d{1,2})\.(\d{2})/;
        translation = translation.replace(timeRegex, newTime);
        timeMatch = translation.match(timeRegex);
      } // end while
    } else if (originalLanguage == "american") {
      console.log("originalLanguage == \"american\": " + originalLanguage);
      
      // for words - american to british
      Object.entries(americanOnly).map((wordPair) => {
        let originalWord = wordPair[0];
        let originalWordRegex = new RegExp(`(?<![A-Za-z\-])${originalWord}(?![A-Za-z\-])`, 'i');
        let translatedWord = wordPair[1];
        while(originalWordRegex.test(translation) == true) {
          translation = translation.replace(originalWordRegex, ('<span class="highlight">' + translatedWord + '</span>'));
          //console.log("\tTranslated something else! Here: " + translation);
        } // end while (for continuing to replace found originalWords)
      }); // end .map()

      Object.entries(americanToBritishSpelling).map((wordPair) => {
        let originalWord = wordPair[0];
        let originalWordRegex = new RegExp(`(?<![A-Za-z\-])${originalWord}(?![A-Za-z\-])`, 'i');
        let translatedWord = wordPair[1];
        while(originalWordRegex.test(translation) == true) {
          translation = translation.replace(originalWordRegex, ('<span class="highlight">' + translatedWord + '</span>')); //
          //console.log("\tTranslated something else! Here: " + translation);
        } // end while (for continuing to replace found originalWords)
      }); // end .map()
      
      // for titles - american to british
      Object.entries(americanToBritishTitles).map((titlePair) => {
        let originalWord = titlePair[0];
        let translatedWord = titlePair[1];
        translatedWord = translatedWord.replace(/^([a-z]{1})/, translatedWord.charAt(0).toUpperCase());
        // find the translated word, but with a period at the end
        let wordRegex = new RegExp(`(?<![A-Za-z])${translatedWord}\\.`, 'i');
        while(wordRegex.test(translation) == true) {
          translation = translation.replace(wordRegex, ('<span class="highlight">' + translatedWord + '</span>'));
          console.log("\tTranslated something else! Here: " + translation);
        } // end while
      }); // end .map()
        
      // for times - american to british
      let timeRegex = /(\d{1,2}):(\d{2})/;
      let timeMatch = translation.match(timeRegex);
      let firstPart;
      let lastPart;
      while(timeMatch != null) {
        firstPart = timeMatch[1];
        lastPart = timeMatch[2];
        let newTime = '<span class="highlight">' + firstPart + "." + lastPart + '</span>';
        timeRegex = /(\d{1,2}):(\d{2})/;
        translation = translation.replace(timeRegex, newTime);
        timeMatch = translation.match(timeRegex);
      } // end while
    } // end if (for language)
    // ----- / Look for American-ounly or British-only content -----------------------------------
    // ----- Return translation -----------------------------------------------------------------
    // (If text requires no translation, return "Everything looks good to me!" for the translation value.)
    // if nothing was changed, return "Everything looks good to me!"
    console.log("text: " + text);
    console.log("translation: " + translation);
    if(translation == text) {
      return "Everything looks good to me!";
    }
    return translation;
  } // end translate()
} // end Translator

module.exports = Translator;

// ------------------------------------------------------------------------------------------