var prefixer = require(APP_DIR + '/lib/style_parser/namespacer/prefixer.js');

/**
 * HTML Purifier Style Parser Namespacer Prefixer
 */

describe('lib - html purifier - style parser - namespacer - prefixer', function() {

  it('should contain the namespace function', function() {
    var hasPrependFunction = (typeof(prefixer.prepend) !== 'undefined');
    expect(hasPrependFunction).to.be.ok();
  });

  it('should contain the strip function', function() {
    var hasStripFunction = (typeof(prefixer.strip) !== 'undefined');
    expect(hasStripFunction).to.be.ok();
  });

  describe('prefix', function() {
    var PREFIX = 'ugc-';
    const messageId = "";

    it('should add the prefix to just a class', function(done) {
      var dirty = '.link {margin-top:0;}';
      var clean = '.ugc-link {\n  margin-top: 0;\n}';

      prefixer.prepend(dirty, PREFIX, null, messageId, function(err, prefixed) {
        expect(prefixed).to.equal(clean);
        done();
      });
    });

    it('should add the prefix to a tag and class', function(done) {
      var dirty = 'p.orig {margin-top:0;}';
      var clean = 'p.ugc-orig {\n  margin-top: 0;\n}';

      prefixer.prepend(dirty, PREFIX, null, messageId, function(err, prefixed) {
        expect(prefixed).to.equal(clean);
        done();
      });
    });

    it('should add the prefix with multiple tags', function(done) {
      var dirty = '.first .second .third {margin-top:0;}';
      var clean = '.ugc-first .ugc-second .ugc-third {\n  margin-top: 0;\n}';

      prefixer.prepend(dirty, PREFIX, null, messageId, function(err, prefixed) {
        expect(prefixed).to.equal(clean);
        done();
      });
    });

    it('should add the prefix with multiple class blocks', function(done) {
      var dirty = 'p.orig, div.test .link {margin-top:0;}';
      var clean = 'p.ugc-orig,\ndiv.ugc-test .ugc-link {\n  margin-top: 0;\n}';

      prefixer.prepend(dirty, PREFIX, null, messageId, function(err, prefixed) {
        expect(prefixed).to.equal(clean);
        done();
      });
    });

    it('should add the prefix to an id', function(done) {
      var dirty = '#orig {margin-top:0;}';
      var clean = '#ugc-orig {\n  margin-top: 0;\n}';

      prefixer.prepend(dirty, PREFIX, null, messageId, function(err, prefixed) {
        expect(prefixed).to.equal(clean);
        done();
      });
    });

    it('should add the prefix to id with tag', function(done) {
      var dirty = 'p#orig {margin-top:0;}';
      var clean = 'p#ugc-orig {\n  margin-top: 0;\n}';

      prefixer.prepend(dirty, PREFIX, null, messageId, function(err, prefixed) {
        expect(prefixed).to.equal(clean);
        done();
      });
    });

    it('should treat id that is a valid tag name as an id name', function(done) {
      var dirty = '#div {margin-top:0;}';
      var clean = '#ugc-div {\n  margin-top: 0;\n}';

      prefixer.prepend(dirty, PREFIX, null, messageId, function(err, prefixed) {
        expect(prefixed).to.equal(clean);
        done();
      });
    });

    it('should prefix multiple', function(done) {
      var dirty = '#link ,#link2 #link3 #link4 #link5, p#test {margin-top:0;}';
      var clean = '#ugc-link,\n#ugc-link2 #ugc-link3 #ugc-link4 #ugc-link5,\np#ugc-test {\n  margin-top: 0;\n}';

      prefixer.prepend(dirty, PREFIX, null, messageId, function(err, prefixed) {
        expect(prefixed).to.equal(clean);
        done();
      });
    });

    it('should ignore badly formatted styles', function(done) {
      var dirty = '#link ,#link2 #link3 #link4 #link5, p#test }margin-top:0;}';
      var clean = '#link ,#link2 #link3 #link4 #link5, p#test }margin-top:0;}';

      prefixer.prepend(dirty, PREFIX, null, messageId, function(err, prefixed) {
        expect(prefixed).to.equal(clean);
        done();
      });
    });
  });

  describe('strip', function() {
    var PREFIX = 'ugc-';

    it('should remove the prefix to just a class', function(done) {
      var clean = '.ugc-link { margin-top: 0; }';
      var expected = '.link {\n  margin-top: 0;\n}';

      prefixer.strip(clean, PREFIX, function(err, stripped) {
        expect(stripped).to.equal(expected);
        done();
      });
    });

    it('should remove the prefix from a tag and class', function(done) {
      var clean = 'p.ugc-orig { margin-top: 0; }';
      var expected = 'p.orig {\n  margin-top: 0;\n}';

      prefixer.strip(clean, PREFIX, function(err, stripped) {
        expect(stripped).to.equal(expected);
        done();
      });
    });

    it('should remove the prefix from an id', function(done) {
      var expected = '#orig {\n  margin-top: 0;\n}';
      var clean = '#ugc-orig { margin-top: 0; }';

      prefixer.strip(clean, PREFIX, function(err, stripped) {
        expect(stripped).to.equal(expected);
        done();
      });
    });

    it('should remove the prefix from id with tag', function(done) {
      var expected = 'p#orig {\n  margin-top: 0;\n}';
      var clean = 'p#ugc-orig { margin-top: 0; }';

      prefixer.strip(clean, PREFIX, function(err, stripped) {
        expect(stripped).to.equal(expected);
        done();
      });
    });

    it('should treat id that is a valid tag name as an id name', function(done) {
      var expected = '#div {\n  margin-top: 0;\n}';
      var clean = '#ugc-div { margin-top: 0; }';

      prefixer.strip(clean, PREFIX, function(err, stripped) {
        expect(stripped).to.equal(expected);
        done();
      });
    });

    it('should return formatted multi-line styles', function(done) {
      var clean = 'P.ugc-p5 {\n';
      clean += 'margin-left: 1px;\n';
      clean += 'margin-right: 1px;\n';
      clean += '}\n';
      var expected = 'P.p5 {\n  margin-left: 1px;\n  margin-right: 1px;\n}';

      prefixer.strip(clean, PREFIX, function(err, stripped) {
        expect(stripped).to.equal(expected);
        done();
      });
    });

    it('should not strip prefix tag if there is no other classname content', function(done) {
      var input = '.Default_Paragraph_Font{text-indent:0.00in;text-align:left;vertical-align:top;}\n'
        + '.ugc{text-indent:0.00in;text-align:left;vertical-align:top;font-size:12.00\n'
        + 'pt;mso-style-next:\'ugc\';margin:0.07in 0.00in;}\n'
        + '.ugc-1{text-indent:0.00in;text-align:left;vertical-align:top;font-size:10.0\n'
        + '0pt;margin:0.00in;}'
      ;
      var expected = '.Default_Paragraph_Font {\n  text-indent: 0.00in;\n  text-align: left;\n  '
        + 'vertical-align: top;\n}\n\n'
        + '.ugc {\n  text-indent: 0.00in;\n  text-align: left;\n  vertical-align: top;\n  font-size: 12.00'
        + '\npt;\n  mso-style-next: \'ugc\';\n  margin: 0.07in 0.00in;\n}\n\n'
        + '.1 {\n  text-indent: 0.00in;\n  text-align: left;\n  vertical-align: top;\n  font-size: 10.0'
        + '\n0pt;\n  margin: 0.00in;\n}'
      ;

      prefixer.strip(input, PREFIX, function(err, stripped) {
        expect(stripped).to.equal(expected);
        done();
      });
    });

  });

});
