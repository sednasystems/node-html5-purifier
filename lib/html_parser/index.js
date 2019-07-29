'use strict';
var async = require('async');
var attributeValidator = require('./attribute_validator');
var namespacer = require('./namespacer');
var pcdataValidator = require('./pcdata_validator');
var sanitizer = require('./sanitizer');
var tagValidator = require('./tag_validator');

/**
 * HTML Purifier HTML Parser
 *
 * @impl parse
 */

/**
 * Removes unwhitelisted tags and attributes from the provided htmlInput. In
 * addition, id and class attributes are namespaced with the provided prefix and
 * postfix.
 *
 * @cb err, string
 * @pattern facade
 */
function parse(htmlInput, prefix, postfix, sanitizerLogger, messageDir, cb) {
  async.waterfall([
    // remove invalid pcdata, ie) <![if mso ...]>
    function(cb) {
      sanitizerLogger && sanitizerLogger.info(`MessageDir: ${messageDir} HTML Parser: Remove invalid pcdata`);
      pcdataValidator.filter(htmlInput, cb);
    },
    // sanitize - caja sanitizes, tag balances, and converts html entities
    function(pcdataValidated, cb) {
      sanitizerLogger && sanitizerLogger.info(`MessageDir: ${messageDir} HTML Parser: google caja sanitizer`);
      sanitizer.sanitize(pcdataValidated, cb);
    },
    // remove all tags that are not on the tags whitelist
    function(sanitizedHtml, cb) {
      sanitizerLogger && sanitizerLogger.info(`MessageDir: ${messageDir} HTML Parser: remove all tags that are not on the tags whitelist`);
      tagValidator.validate(sanitizedHtml, cb);
    },
    // remove all tags that are not on the attributes whitelist
    function(tagValidatedHtml, cb) {
      sanitizerLogger && sanitizerLogger.info(`MessageDir: ${messageDir} HTML Parser: remove all tags that are not on the attributes whitelist`);
      attributeValidator.validate(tagValidatedHtml, cb);
    },
    // namespace id and class attributes
    function(attributeSanitizedHtml, cb) {
      if (typeof prefix !== 'undefined' || typeof postfix !== 'undefined') {
        sanitizerLogger && sanitizerLogger.info(`MessageDir: ${messageDir} "HTML Parser: add namespace`);
        namespacer.namespace(attributeSanitizedHtml, prefix, postfix, cb);
      } else {
        cb(null, attributeSanitizedHtml);
      }
    },
  ], cb);
}

function parsePurified(htmlInput, prefix, postfix, deSanitizerLogger, messageDir, cb) {
  async.waterfall([
    // remove invalid pcdata, ie) <![if mso ...]>
    function(cb) {
      deSanitizerLogger && deSanitizerLogger.info(`MessageDir: ${messageDir} HTML Parser: Remove invalid pcdata`);
      pcdataValidator.filter(htmlInput, cb);
    },
    // sanitize - caja sanitizes, tag balances, and converts html entities
    function(pcdataValidated, cb) {
      deSanitizerLogger && deSanitizerLogger.info(`MessageDir: ${messageDir} HTML Parser: google caja sanitizer`);
      sanitizer.sanitize(pcdataValidated, cb);
    },
    // remove all tags that are not on the tags whitelist
    function(sanitizedHtml, cb) {
      deSanitizerLogger && deSanitizerLogger.info(`MessageDir: ${messageDir} HTML Parser: remove all tags that are not on the tags whitelist`);
      tagValidator.validate(sanitizedHtml, cb);
    },
    // remove all tags that are not on the attributes whitelist
    function(tagValidatedHtml, cb) {
      deSanitizerLogger && deSanitizerLogger.info(`MessageDir: ${messageDir} HTML Parser: remove all tags that are not on the attributes whitelist`);
      attributeValidator.validate(tagValidatedHtml, cb);
    },
    function(attributeSanitizedHtml, cb) {
      // strip prefix and postfix from id and class attributes recursively
      if (typeof prefix !== 'undefined' || typeof postfix !== 'undefined') {
        var isReplaced = true;
        async.whilst(function() {
          return isReplaced;
        }, function(cb) {
          deSanitizerLogger && deSanitizerLogger.info(`MessageDir: ${messageDir} HTML Parser: strip namespace`);
          namespacer.stripNamespace(attributeSanitizedHtml, prefix, postfix, function(err, revertedHtml, replaced) {
            attributeSanitizedHtml = revertedHtml;
            isReplaced = replaced;
            cb();
          });
        }, function(err) {
          if (err) return cb(err);
          return cb(null, attributeSanitizedHtml);
        });
      } else {
        cb(null, attributeSanitizedHtml);
      }
    },
  ], cb);
}


exports.parse = parse;
exports.parsePurified = parsePurified;
