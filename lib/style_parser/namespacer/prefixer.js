'use strict';
var css = require('css');
/**
 * Style Namespacer Prefixer.
 *
 * @impl prefix
 */

/**
 * Prefixes the given styles.
 *
 * @cb err, string
 */
function prepend(styles, prefix, sanitizerLogger, messageDir, cb) {

  sanitizerLogger(`MessageDir: ${messageDir} StyleParser: style parsing started using css library`);
  var obj = css.parse(styles, {silent: true});

  sanitizerLogger(`MessageDir: ${messageDir} StyleParser: style parsing end using css library`);

  if (obj.stylesheet.parsingErrors.length > 0) {
    sanitizerLogger(`MessageDir: ${messageDir} StyleParser: badly formatted style`);
    return cb(null, styles);
  }

  obj.stylesheet.rules = obj.stylesheet.rules.map(function (rule) {
    if (rule.type !== 'rule') {
      return rule;
    }
    sanitizerLogger(`MessageDir: ${messageDir} StyleParser: regex start`);
    rule.selectors = rule.selectors.map(function (selector) {
      return prefixSelector(selector, prefix);
    });

    return rule;
  });
  sanitizerLogger(`MessageDir: ${messageDir} StyleParser: regex end`);
  cb(null, css.stringify(obj, {compress: true}));
}

function prefixSelector(selector, prefix) {
  return selector.replace(/(\.|#)(-?[_a-z][_a-z0-9\-]*)/ig, '$1' + prefix + '$2');
}

function strip(styles, prefix, cb) {
  var obj = css.parse(styles);
  var sheet = obj.stylesheet;
  var isReverted = false;
  sheet.rules.forEach(function(rule, ruleIndex) {
    if (rule.type === 'rule') {
      rule.selectors.forEach(function(selector, selectorIndex) {
        if (selector.indexOf(prefix) > -1 && selector !== prefix) {
          obj.stylesheet.rules[ruleIndex].selectors[selectorIndex] = selector.replace(prefix, '').trim();
          isReverted = true;
        }
      });
    }
  });
  cb(null, css.stringify(obj), isReverted);
}


exports.prepend = prepend;
exports.strip = strip;
