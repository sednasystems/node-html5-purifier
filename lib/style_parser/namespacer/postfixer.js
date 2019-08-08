'use strict';
var css = require('css');
/**
 * Style Namespacer Postfixer.
 *
 * @impl postfix
 */

/**
 * Postfixes the given styles.
 *
 * @cb err, string
 */
function append(styles, postfix, cb) {
  var obj = css.parse(styles, {silent: true});

  if (obj.stylesheet.parsingErrors.length > 0) {
    return cb(null, styles);
  }

  obj.stylesheet.rules = obj.stylesheet.rules.map(function (rule) {
    if (rule.type !== 'rule') {
      return rule;
    }

    rule.selectors = rule.selectors.map(function (selector) {
      return getPostFixedSelector(selector, postfix);
    });

    return rule;
  });

  cb(null, css.stringify(obj));
}

function getPostFixedSelector(selector, postfix) {
  var selectorHash = selector.split(':');

  if (selectorHash.length === 1) {
    return selector + postfix;
  }

  return selectorHash[0] + postfix + ':' + selectorHash.slice(1).join(':');
}

function strip(styles, postfix, cb) {
  var obj = css.parse(styles);
  var sheet = obj.stylesheet;
  var isReverted = false;
  sheet.rules.forEach(function(rule, ruleIndex) {
    if (rule.type === 'rule') {
      rule.selectors.forEach(function(selector, selectorIndex) {
        if (selector.indexOf(postfix) > -1 && postfix !== selector) {
          obj.stylesheet.rules[ruleIndex].selectors[selectorIndex] = selector.replace(postfix, '').trim();
          isReverted = true;
        }
      });
    }
  });

  cb(null, css.stringify(obj), isReverted);
}



exports.append = append;
exports.strip = strip;
