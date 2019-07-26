'use strict';
const async = require('async');
const htmlParser = require('./html_parser');
const styleParser = require('./style_parser');
const sanitizerLogger = require('./logger').get('sanitizer');
const deSanitizerLogger = require('./logger').get('de_sanitizer');

/**
 * HTML Purifier Library.
 */

/**
 * Removes unwhitelisted tags and attributes from the provided htmlInput. In
 * addition, id and class attributes are namespaced with the provided prefix and
 * postfix.
 *
 * @param String htmlInput
 * @param Object options
 * @cb err, string
 */
function purify(htmlInput, options, cb) {
  if (typeof htmlInput === 'undefined') {
    return cb(null, '');
  }

  var prefix = options.prefix;
  var postfix = options.postfix;
  async.parallel([
    // purify style tag contents
    function(cb) {
      const stylePostfix = options.postfix === undefined ? undefined : '.' + options.postfix;
      sanitizerLogger.info("Style parsing started");
      styleParser.parse(htmlInput, prefix, stylePostfix, cb);
    },
    // purify html body contents
    function(cb) {
      sanitizerLogger.info("HTML parsing started");
      htmlParser.parse(htmlInput, prefix, postfix, cb);
    },
  ], function(err, results) {
    if (err) return cb(err);

    cb(null, results.join(''));
  });
}

/**
 * Strips provided prefix and postfix from id and class attributes
 *
 * @param String htmlInput
 * @param Object options
 * @cb err, string
 */
function revertNamespace(htmlInput, options, cb) {
  if (typeof htmlInput === 'undefined') {
    return cb(null, '');
  }

  var prefix = options.prefix;
  var postfix = options.postfix;
  async.parallel([
    // purify style tag contents
    function(cb) {
      deSanitizerLogger.info("Style parsing started");
      styleParser.parsePurified(htmlInput, prefix, '.' + postfix, cb);
    },
    // purify html body contents
    function(cb) {
      deSanitizerLogger.info("HTML parsing started");
      htmlParser.parsePurified(htmlInput, prefix, postfix, cb);
    },
  ], function(err, results) {
    if (err) return cb(err);

    cb(null, results.join(''));
  });
}


exports.purify = purify;
exports.revertNamespace = revertNamespace;
