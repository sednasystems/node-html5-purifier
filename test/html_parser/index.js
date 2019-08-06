var parser = require(APP_DIR + '/lib/html_parser');

/**
 * HTML Purifier HTML Parser Unit Test
 */
describe('library - html purifier - html parser', function() {

  it('should contain the parse function', function() {
    var hasParseFunction = (typeof(parser.parse) !== 'undefined');
    expect(hasParseFunction).to.be.ok();
  });

  it('should contain the parsePurified function', function() {
    var hasParsePurifiedFunction = (typeof(parser.parsePurified) !== 'undefined');
    expect(hasParsePurifiedFunction).to.be.ok();
  });

});

describe('library - html purifier - html parser - parsePurified', function() {
  const messageId = 1;
  it('should remove both prefix and postfix', function(done) {
    var POSTFIX = 'ugc';
    var PREFIX = 'ugc-';
    var dirty = '<span class="ugc ugc-ugc ugc-ugc-moz-cite-prefix ugc-test ugc">my string</span>';
    var expected = '<span class="moz-cite-prefix test">my string</span>';

    parser.parsePurified(dirty, PREFIX, POSTFIX, () => {}, messageId, function(err, namespaced) {
      expect(namespaced).to.be.equal(expected);
      done();
    });
  });
  it('should handle the case when ugc appears in text part of html', function(done) {
    var POSTFIX = 'ugc';
    var PREFIX = 'ugc-';
    var dirty = '<span class="ugc ugc-ugc ugc-ugc-moz-cite-prefix ugc-test ugc">my string has ugc</span>';
    var expected = '<span class="moz-cite-prefix test">my string has ugc</span>';

    parser.parsePurified(dirty, PREFIX, POSTFIX, () => {}, messageId, function(err, namespaced) {
      expect(namespaced).to.be.equal(expected);
      done();
    });
  });

  it('should remove empty class', function(done) {
    var POSTFIX = 'ugc';
    var PREFIX = 'ugc-';
    var dirty = '<span class="ugc ugc-ugc ugc-ugc ugc ugc">my string has ugc</span>';
    var expected = '<span>my string has ugc</span>';

    parser.parsePurified(dirty, PREFIX, POSTFIX, () => {}, messageId, function(err, namespaced) {
      expect(namespaced).to.be.equal(expected);
      done();
    });
  });

  it('should recursively remove multiple ugc tags without leaving dashes', function(done) {
    var POSTFIX = 'ugc';
    var PREFIX = 'ugc-';
    var clean = '<p class="ugc ugc-ugc ugc-ugc-moz-cite-prefix ugc-ugc-ugc-ugc-ugc-MsoNormal">Text</p>';

      var expected = '<p class="moz-cite-prefix MsoNormal">Text</p>';

      parser.parsePurified(clean, PREFIX, POSTFIX, () => {}, messageId, function(err, stripped) {
        expect(stripped).to.equal(expected);
        done();
      });

    });


});
