'use strict';
var validator = require('google-caja-sanitizer');
var whitelister = require('./whitelister');

/**
 * HTML Purifier Tag Validator
 *
 * @impl validate
 */

/**
 * Removes all tags that are not on the whitelist.
 *
 * @cb err, string
 * @param htmlInput string
 * @pattern facade
 * @see http://code.google.com/p/google-caja/wiki/JsHtmlSanitizer
 * @see https://github.com/CLowbrow/node-caja-sanitizer
 */
function validate(htmlInput, cb) {
  var outputCache = [];

  // TODO: move this out to a private function, where base sanitizer can extend from
  var omit = function(node) {
    outputCache.push(node);
  }.bind(this);

  var parser = validator.makeSaxParser({
    startDoc: omit,
    startTag: function(tagNameLowerCase, attribs, outputCache) {
      var whitelisted = whitelister.verify(tagNameLowerCase);

      if (whitelisted) {
        outputCache.push('<' + tagNameLowerCase);

        for (var i = 0; i < attribs.length; i += 2) {
          var key = attribs[i];
          var value = attribs[i + 1];

          outputCache.push(' ' + key + '="' + value.replace(/"/g, '\'') + '"');
        }

        outputCache.push('>');
      }
    },
    endTag: function(tagName, outputCache) {
      var whitelisted = whitelister.verify(tagName);

      if (whitelisted)
        outputCache.push('</' + tagName + '>');
    },
    pcdata: omit,
    cdata: omit,
    rcdata: omit,
    endDoc: omit
  });

  parser(htmlInput, outputCache);

  cb(null, outputCache.join(''));
}


exports.validate = validate;
