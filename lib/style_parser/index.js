'use strict';
var async = require('async');
var namespacer = require('./namespacer');
var sanitizer = require('./sanitizer');

/**
 * HTML Purifier Style Parser.
 *
 * @impl purify
 */

/**
 * Removes all tags except style tags, then adds the given prefix
 * and postfix to the provided css input.
 *
 * @cb err, string
 * @pattern facade
 */
function parse(cssInput, prefix, postfix, sanitizerLogger, messageDir, cb) {
  async.waterfall([
    // remove everything except style tag contents
    function(cb) {
      sanitizerLogger && sanitizerLogger.debug(`MessageDir: ${messageDir} StyleParser: remove everything except style tag contents`);
      sanitizer.sanitize(cssInput, cb);
    },
    // namespace sanitized style tag contents
    function(sanitizedHtml, cb) {
      sanitizerLogger && sanitizerLogger.debug(`MessageDir: ${messageDir} StyleParser: add namespace`);
      namespacer.namespace(sanitizedHtml, prefix, postfix, cb);
    },
    // add style tags
    function(nameSpacedHtml, cb) {
      sanitizerLogger && sanitizerLogger.debug(`MessageDir: ${messageDir} StyleParser: add style tags`);
      nameSpacedHtml = addStyleTags(nameSpacedHtml);
      cb(null, nameSpacedHtml);
    }
  ], cb);
}

/**
 * Removes all tags except style tags, then removes the given prefix
 * and postfix from the provided css input.
 *
 * @cb err, string
 * @pattern facade
 */
function parsePurified(cssInput, prefix, postfix, deSanitizerLogger, messageDir, cb) {
  var strippedStyles;
  async.waterfall([
    // remove everything except style tag contents
    function(cb) {
      deSanitizerLogger && deSanitizerLogger.debug(`MessageDir: ${messageDir} StyleParser: remove everything except style tag contents`);
      sanitizer.sanitize(cssInput, cb);
    },
    // strip namespace
    function(sanitizedHtml, cb) {
      deSanitizerLogger && deSanitizerLogger.debug(`MessageDir: ${messageDir} StyleParser: strip namespace`);
      if ((typeof prefix !== 'undefined' || typeof postfix !== 'undefined') && sanitizedHtml !== '') {
        namespacer.stripNamespace(sanitizedHtml, prefix, postfix, function(err, stripped) {
          deSanitizerLogger && deSanitizerLogger.debug(`MessageDir: ${messageDir} StyleParser: add style tags`);
          strippedStyles = addStyleTags(stripped);
          cb(null, strippedStyles);
        });
      } else {
        cb(null, sanitizedHtml);
      }
    }
  ], cb);
}

/**
 * Wraps the given input by adding HTML style tags.
 *
 * @param styles string The CSS styles to put inside the style tags
 * @return string The CSS wrapped in style tags
 */
function addStyleTags(styles) {
  return (styles) ? '<style>' + styles + '</style>' : '';
}

exports.parse = parse;
exports.parsePurified = parsePurified;
