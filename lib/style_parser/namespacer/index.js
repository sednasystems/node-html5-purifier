'use strict';
var async = require('async');
var postfixer = require('./postfixer.js');
var prefixer = require('./prefixer.js');

/**
 * Style Namespacer.
 *
 * @impl namespace
 */

/**
 * Namespaces styles with the provided prefix and postfixes.
 *
 * @cb err, string
 */
function namespace(styles, prefix, postfix, sanitizerLogger, messageDir, cb) {
  async.waterfall([
    // prefix styles
    function(cb) {
      if (prefix) {
        sanitizerLogger(`MessageDir: ${messageDir} StyleParser: Prepend`);
        prefixer.prepend(styles, prefix, sanitizerLogger, messageDir, cb);
      } else {
        cb(null, styles);
      }
    },
    // postfix styles
    function(prefixedStyles, cb) {
      if (postfix) {
        sanitizerLogger(`MessageDir: ${messageDir} StyleParser: append`);
        postfixer.append(prefixedStyles, postfix, cb);
      } else {
        cb(null, prefixedStyles);
      }
    }
  ], cb);
}

function stripNamespace(styles, prefix, postfix, cb) {
  async.waterfall([
    // strip styles
    function(cb1) {
      if (prefix) {
        var reverted = true;
        async.whilst(function() {
          return reverted;
        }, function(cb2) {
          prefixer.strip(styles, prefix, function(err, revertedStyles, isReverted) {
            reverted = isReverted;
            styles = revertedStyles;
            cb2();
          });
        }, function(err) {
          if (err) return cb1(err);
          return cb1(null, styles);
        });
      } else {
        cb1(null, styles);
      }
    },
    // strip styles
    function(prefixedStyles, cb1) {
      if (postfix) {
        var reverted = true;
        async.whilst(function() {
          return reverted;
        }, function(cb2) {
          postfixer.strip(styles, postfix, function(err, revertedStyles, isReverted) {
            reverted = isReverted;
            styles = revertedStyles;
            cb2();
          });
        }, function(err) {
          if (err) return cb1(err);
          return cb1(null, styles);
        });
      } else {
        cb1(null, prefixedStyles);
      }
    }
  ], cb);
}




exports.namespace = namespace;
exports.stripNamespace = stripNamespace;
