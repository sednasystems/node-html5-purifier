'use strict';
var blacklister = require('./blacklister.js');
var caja = require('google-caja-sanitizer');

/**
 * HTML Purifier Namepacer
 *
 * @impl namespace
 */

/**
 * Adds the specified prefixes and postfixes to all html classes and
 * ids within an html string.
 *
 * @cb err, string
 * @param htmlInput string
 * @pattern facade
 * @see http://code.google.com/p/google-caja/wiki/JsHtmlSanitizer
 * @see https://github.com/CLowbrow/node-caja-sanitizer
 */
function namespace(htmlInput, prefix, postfix, cb) {
  var outputCache = [];

  var omit = function(node) {
    outputCache.push(node);
  }.bind(this);

  var namespacer = caja.makeSaxParser({
    startdoc: omit,

    startTag: function(tagNameLowerCase, attribs, outputCache) {
      outputCache.push('<' + tagNameLowerCase); // output open tag and the tag's name

      var hasClass = false;
      var blacklisted = blacklister.verify(tagNameLowerCase);

      if (!blacklisted) {
        // parse attributes
        for (var i = 0; i < attribs.length; i += 2) {
          var key = attribs[i];
          var value = attribs[i + 1];
          // if parsing an "id" that has content
          if (key === 'id' && value) {
            // TODO: Filter invalid characters from attribute contents
            outputCache.push(' id="' + prefix + value + '"');
          }

          // if parsing an "class" that has content
          else if (key === 'class' && value) {
            hasClass = true;
            outputCache.push(' class="');

            // strip extra whitespace
            value = value.replace(/  +/g, ' ');

            // push class tokens
            var classTokens = value.split(' ');
            var classNames = postfix;
            for (var j = 0; j < classTokens.length; j++) {
              // TODO: Filter invalid characters from attribute contents
              classNames += ' ' + prefix + classTokens[j];
            }
            outputCache.push(classNames.trim());

            outputCache.push('"');
          }
          // otherwise, output any other types of attributes
          else {
            outputCache.push(' ' + key + '="' + value.replace(/"/g, '\'') + '"');
          }
        }

        // if the tag has no class, we add the postfix as a class
        if (!hasClass) {
          outputCache.push(' class="' + postfix + '"');
        }
      }

      // close the tag
      outputCache.push('>');
    },

    endTag: function(tagName, outputCache) {
      outputCache.push('</' + tagName + '>');
    },

    pcdata: omit,
    cdata: omit,
    rcdata: omit,
    endDoc: omit
  });

  namespacer(htmlInput, outputCache);

  cb(null, outputCache.join(''));
}

function stripNamespace(htmlInput, prefix, postfix, cb) {
  var outputCache = [];
  var replaced = false;

  var omit = function(node) {
    outputCache.push(node);
  }.bind(this);

  var namespacer = caja.makeSaxParser({
    startdoc: omit,

    startTag: function(tagNameLowerCase, attribs, outputCache) {
      outputCache.push('<' + tagNameLowerCase); // output open tag and the tag's name

      var blacklisted = blacklister.verify(tagNameLowerCase);

      if (!blacklisted) {
        // parse attributes
        for (var i = 0; i < attribs.length; i += 2) {
          var key = attribs[i];
          var value = attribs[i + 1];
          // if parsing an "id" that has content

          if (key === 'id' && value && value.indexOf(prefix) > -1) {
            outputCache.push(' id="' + value.replace(prefix, '') + '"');
            replaced = true;
          }

          // if parsing an "class" that has content
          else if (key === 'class' && value && (value.indexOf(prefix) > -1 || value.indexOf(postfix) > -1)) {
            replaced = true;
            var regex= new RegExp('(' + postfix + '(?!-))', 'i');
            value = value.replace(regex, '').trim();

            // strip extra whitespace
            value = value.replace(/  +/g, ' ');

            outputCache.push(' class="');
            var classTokens = value.split(' ');
            var classes = [];
            for (var j = 0; j < classTokens.length; j++) {
              classes.push(classTokens[j].replace(prefix, '').trim());
            }
            outputCache.push(classes.join(' '));
            outputCache.push('"');
          }
          // otherwise, output any other types of attributes
          else if (value !== '') {
            outputCache.push(' ' + key + '="' + value.replace(/"/g, '\'') + '"');
          }
        }
      }

      // close the tag
      outputCache.push('>');
    },

    endTag: function(tagName, outputCache) {
      outputCache.push('</' + tagName + '>');
    },

    pcdata: omit,
    cdata: omit,
    rcdata: omit,
    endDoc: omit
  });

  namespacer(htmlInput, outputCache);
  var revertedHtml = outputCache.join('');

  cb(null, revertedHtml, replaced);
}


exports.namespace = namespace;
exports.stripNamespace= stripNamespace;
