var validator = require(APP_DIR + '/lib/html_parser/tag_validator');

/**
 * HTML Purifier HTML Parser Tag Validator Unit Test
 */
describe('library - html purifier - tag validator - validator', function() {

  it('should contain the validate function', function() {
    var hasValidateFunction = (typeof(validator.validate) !== 'undefined');
    expect(hasValidateFunction).to.be.ok();
  });

  describe('validate()', function() {
    it('should remove html tags', function(done) {
      var dirty = '<html>hello world</html>';

      validator.validate(dirty, function(err, validated) {
        expect(err).to.be.equal(null);
        expect(validated).to.be.equal('hello world');
        done();
      });
    });

    it('should allow div tags', function(done) {
      var dirty = '<html><div>hello world</div></html>';

      validator.validate(dirty, function(err, validated) {
        expect(err).to.be.equal(null);
        expect(validated).to.be.equal('<div>hello world</div>');
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
  });

});
