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

  it('should keep img data', function(done) {
    var dirty = '<img class="sedna-signature-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIVSURBVDhPhZJfSNNRFMe/v226qVOnTpfgn+G0IgJFFKeslNCHHgT/gqLg9pDh2yJ8jKGRICpIL4tUynyQhvgioRQRiaKgog9mDyo40Io0nDiWpvTrntN+Y83AD9zfPffe8z3n3nN+ElwuFSzeesh4DsAgxmX4IMku6ALPJLyyNwqhJ3iAKzGJsFtsKDddQ26CCTv+Ayzub2Nka5btEDKeSBi1HwqTM9rS8jB1x4l13x70Gi2+/TzCzaQMZMQm4Vz+jeZZNya8y+TKqMT4R3hv4QVuzfSg+E0XDk79HIQyE+O3O9CQXcQ2QWK+6nTlQzxYGg9Fpkzvv27wuupdH2o/PIXvV4ADFCRnsQ+L6Y2UoSQ1hzcVXm7PoWNxlO2WnFIYomOhkVS4f7WC91hMxSGM2nieI3Fb29BkLmEhUWG6zjOvqKpETVYhajIL2SboNg3ZxWgVWcNR/DX0oRbkxqdx5KEyB3wfA1zhMVs7VzwSpWWcWakmYdTqMVTqYLv/0wyMuotPUfypz7JZb8RmbW/oTQrLP3a4wuRsTbWgMv0G71Mr575v/s1M16AfgNoTTlGKmedHa5NwzA9jN3DI7SQhIcTSCRnUz/8FoMyPC+qwWt2NAfGMwc9vgyeAGnX5xyLAXVpsHH3B1O4aH+g1Ohi0cdCpo+A/P0Xnymt4vEt8xsgYk+BpjMZJXK9YOIPblyOEOFM7/wCFk72VnT/DRQAAAABJRU5ErkJggg==" width="18px" height="18px">';
    sanitizer.sanitize(dirty, function(err, sanitized) {
      expect(err).to.be.equal(null);
      expect(sanitized).to.be.equal('<img class="sedna-signature-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIVSURBVDhPhZJfSNNRFMe/v226qVOnTpfgn+G0IgJFFKeslNCHHgT/gqLg9pDh2yJ8jKGRICpIL4tUynyQhvgioRQRiaKgog9mDyo40Io0nDiWpvTrntN+Y83AD9zfPffe8z3n3nN+ElwuFSzeesh4DsAgxmX4IMku6ALPJLyyNwqhJ3iAKzGJsFtsKDddQ26CCTv+Ayzub2Nka5btEDKeSBi1HwqTM9rS8jB1x4l13x70Gi2+/TzCzaQMZMQm4Vz+jeZZNya8y+TKqMT4R3hv4QVuzfSg+E0XDk79HIQyE+O3O9CQXcQ2QWK+6nTlQzxYGg9Fpkzvv27wuupdH2o/PIXvV4ADFCRnsQ+L6Y2UoSQ1hzcVXm7PoWNxlO2WnFIYomOhkVS4f7WC91hMxSGM2nieI3Fb29BkLmEhUWG6zjOvqKpETVYhajIL2SboNg3ZxWgVWcNR/DX0oRbkxqdx5KEyB3wfA1zhMVs7VzwSpWWcWakmYdTqMVTqYLv/0wyMuotPUfypz7JZb8RmbW/oTQrLP3a4wuRsTbWgMv0G71Mr575v/s1M16AfgNoTTlGKmedHa5NwzA9jN3DI7SQhIcTSCRnUz/8FoMyPC+qwWt2NAfGMwc9vgyeAGnX5xyLAXVpsHH3B1O4aH+g1Ohi0cdCpo+A/P0Xnymt4vEt8xsgYk+BpjMZJXK9YOIPblyOEOFM7/wCFk72VnT/DRQAAAABJRU5ErkJggg==" width="18px" height="18px">');
      done();
    });
  });

});
