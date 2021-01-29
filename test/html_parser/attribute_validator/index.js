var validator = require(APP_DIR + '/lib/html_parser/attribute_validator');

/**
 * HTML Purifier HTML Parser Attribute Validator Unit Test
 */
describe('library - html purifier - html parser - attribute validator - validator', function() {

  it('should contain the validate function', function() {
    var hasValidateFunction = (typeof(validator.validate) !== 'undefined');
    expect(hasValidateFunction).to.be.ok();
  });

  describe('validate()', function() {
    it('should keep whitelisted attributes', function(done) {
      var dirty = '<html class="test">hello world</html>';

      validator.validate(dirty, function(err, validated) {
        expect(err).to.be.equal(null);
        expect(validated).to.be.equal('<html class="test">hello world</html>');
        done();
      });
    });

    it('should remove unwhitelisted attributes', function(done) {
      var dirty = '<html script="test">hello world</html>';

      validator.validate(dirty, function(err, validated) {
        expect(err).to.be.equal(null);
        expect(validated).to.be.equal('<html>hello world</html>');
        done();
      });
    });

    it('should keep multiple whitelisted attributes', function(done) {
      var dirty = '<html id="test-id" class="test-class">hello world</html>';

      validator.validate(dirty, function(err, validated) {
        expect(err).to.be.equal(null);
        expect(validated).to.be.equal('<html id="test-id" class="test-class">hello world</html>');
        done();
      });
    });

    it('should keep multiple whitelisted attributes and remove unwhitelisted attributes', function(done) {
      var dirty = '<html id="test-id" class="test-class" script="hack">hello world</html>';

      validator.validate(dirty, function(err, validated) {
        expect(err).to.be.equal(null);
        expect(validated).to.be.equal('<html id="test-id" class="test-class">hello world</html>');
        done();
      });
    });

    it('should remove invalid attributes', function(done) {
      var dirty = '<html abc&*>hello world</html>';

      validator.validate(dirty, function(err, validated) {
        expect(err).to.be.equal(null);
        expect(validated).to.be.equal('<html>hello world</html>');
        done();
      });
    });

    it('should keep html entities', function(done) {
      var dirty = '<span style="font-family: \'courier new\'">hello world</span>';

      validator.validate(dirty, function(err, validated) {
        expect(err).to.be.equal(null);
        expect(validated).to.be.equal('<span style="font-family: \'courier new\'">hello world</span>');
        done();
      });
    });

    it('should keep img src', function(done) {
      var dirty = '<div dir="ltr"><img src="cid:ii_ilo0sxul0_15366e0cac25aa09" width="486" height="365"><br><br></div>';
      validator.validate(dirty, function(err, validated) {
        expect(err).to.be.equal(null);
        expect(validated).to.be.equal('<div><img src="cid:ii_ilo0sxul0_15366e0cac25aa09" width="486" height="365"><br><br></div>');
        done();
      });
    });
  });

});
