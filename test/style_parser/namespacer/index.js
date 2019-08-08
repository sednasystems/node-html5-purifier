var namespacer = require(APP_DIR + '/lib/style_parser/namespacer');

/**
 * HTML Purifier Style Parser Namespacer
 */
describe('lib - html purifier - style parser - namespacer', function() {

  it('should contain the namespace function', function() {
    var hasNamespaceFunction = (typeof(namespacer.namespace) !== 'undefined');
    expect(hasNamespaceFunction).to.be.ok();
  });

  it('should contain the stripNamespace function', function() {
    var hasNamespaceFunction = (typeof(namespacer.stripNamespace) !== 'undefined');
    expect(hasNamespaceFunction).to.be.ok();
  });
  it('should not cause exception', function(done) {
    var dirty = '@font-face\n' + '\t}font-family:??;}';
    var clean = '@font-face\n' + '\t}font-family:??;}';

    namespacer.namespace(dirty, "ugc-", "ugc",  () => {}, "", function(err, postfixed) {
      expect(postfixed).to.equal(clean);
      done();
    });
  });
});
