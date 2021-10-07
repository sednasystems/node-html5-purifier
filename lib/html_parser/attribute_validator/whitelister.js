'use strict';
/**
 * HTML Purifier Attribute Sanitizer Whitelister
 *
 * @impl verify
 */

/**
 * The list of attributes that are not removed from the html attributes.
 * TODO: should read in the whitelist once from a config file on construction
 * TODO: Support data-* attribute name
 */
var whitelist = [
  'align',
  'bgcolor',
  'border',
  'class',
  'color',
  'colspan',
  'rowspan',
  'data-attachment-id',
  'data-cid',
  'data-sedna-block',
  'data-sedna-lite-route',
  'font-face',
  'face',
  'height',
  'href',
  'id',
  'name',
  'size',
  'src',
  'style',
  'valign',
  'width',

  // <ol> elements have a legitimate start property
  'start'
];

/**
 * Verifies the provided tag is in the whitelist.
 *
 * @param attributeName string
 */
function verify(attributeName) {
  for (var i = 0; i < whitelist.length; i++) {
    if (attributeName === whitelist[i]) {
      return true;
    }
  }

  return false;
}


exports.verify = verify;
