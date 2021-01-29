var sanitizer = require(APP_DIR + '/lib/html_parser/sanitizer');

/**
 * HTML Purifier HTML Parser Sanitizer Unit Test
 */
describe('library - html purifier - html parser - sanitizer - sanitizer', function() {

  it('should contain the sanitize function', function() {
    var hasSanitizeFunction = (typeof(sanitizer.sanitize) !== 'undefined');
    expect(hasSanitizeFunction).to.be.ok();
  });

  it('should remove dangerous tags', function(done) {
    var dirty = '<div><script>alert();</script>hello world</div>';

    sanitizer.sanitize(dirty, function(err, sanitized) {
      expect(sanitized).to.be('<div>hello world</div>');
      done();
    });
  });

  it('should fix nested dangerous tags', function(done) {
    var dirty = '<div <script>alert();</script>>hello world</div>';

    sanitizer.sanitize(dirty, function(err, sanitized) {
      expect(sanitized).to.be('<div>alert();&gt;hello world</div>');
      done();
    });
  });

  it('should close a missing tag', function(done) {
    var dirty = '<div>hello world';

    sanitizer.sanitize(dirty, function(err, sanitized) {
      expect(sanitized).to.be('<div>hello world</div>');
      done();
    });
  });

  it('should convert html entities', function(done) {
    var dirty = '&';

    sanitizer.sanitize(dirty, function(err, sanitized) {
      expect(sanitized).to.be('&amp;');
      done();
    });
  });

  it('should keep urls', function(done) {
    var dirty = '<a href="http://www.google.com">Google</a>';

    sanitizer.sanitize(dirty, function(err, sanitized) {
      expect(sanitized).to.be('<a href="http://www.google.com">Google</a>');
      done();
    });
  });

  it('should not sanitize fonts', function(done) {
    var dirty = '<span style="font-family: \'Courier New\'">hello world</span>';

    sanitizer.sanitize(dirty, function(err, sanitized) {
      expect(sanitized).to.be('<span style="font-family: &#34;courier new&#34;">hello world</span>');
      done();
    });
  });

  it('should keep img src', function(done) {
    var dirty = '<div dir="ltr"><img src="cid:ii_ilo0sxul0_15366e0cac25aa09" width="486" height="365"><br><br></div>';
    sanitizer.sanitize(dirty, function(err, sanitized) {
      expect(err).to.be.equal(null);
      expect(sanitized).to.be.equal('<div dir="ltr"><img src="cid:ii_ilo0sxul0_15366e0cac25aa09" width="486" height="365"><br><br></div>');
      done();
    });
  });

});
