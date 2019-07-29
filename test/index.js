var purifier = require(APP_DIR + '/lib/index');

/**
 * HTML Purifier Unit Test.
 */

describe('library - html purifier', function() {
  var purify = purifier.purify;

  it('should contain the purify function', function() {
    var hasPurifyFunction = (typeof(purify) !== 'undefined');
    expect(hasPurifyFunction).to.be.ok();
  });

  it('should contain the revertNamespace function', function() {
    var revertNamespace = (typeof(purifier.revertNamespace) !== 'undefined');
    expect(revertNamespace).to.be.ok();
  });

  it('should support prefix and postfix', function(done) {
    var options = { prefix: 'xyz', postfix: 'abc' };
    var input = '<span class="hello">testing</span>';
    purify(input, options, function(err, res) {
      expect(err).to.not.be.an(Error);
      expect(res).to.equal('<span class="abc xyzhello">testing</span>');
      done();
    });
  });

  it('should not require any options', function(done) {
    var options = {};
    var input = '<style>body {\n  background-color: blue;\n}</style><span class="hello">testing</span>';
    purify(input, options, function(err, res) {
      expect(err).to.not.be.an(Error);
      expect(res).to.equal(input);
      done();
    });
  });

  it('should add prefix and postfix to all classes', function(done) {
    var options = { prefix: 'ugc-', postfix: 'ugc' };
    var input = '<style>td {\n  background-color: blue;\n}.xl123 {color: blue} </style><span class="hello">testing</span>';
    var res = '<style>td.ugc {\n  background-color: blue;\n}\n\n.ugc-xl123.ugc {\n  color: blue;\n}</style><span class="ugc ugc-hello">testing</span>';
    purify(input, options, function(err, res) {
      expect(err).to.not.be.an(Error);
      expect(res).to.equal(res);
      done();
    });
  });

  it('should handle undefined input', function(done) {
    var options = { prefix: 'abc', postfix: 'ugc' };
    purify(undefined, options, function(err, res) {
      expect(res).to.equal('');
      done();
    });
  });

  /**
   * No joke, an actual html page found in the wild had 20,000 nested css selectors.
   * A large block of improperly nested selectors repeated hundred's of times.
   *
   * Tests for a 'RangeError: Maximum call stack size exceeded' exception, thrown by the
   * 'css' module that uses recursion when css tags are nested.
   */

  it('should discard nested selectors', function(done) {
    this.timeout(7000);
    var options = { prefix: 'abc', postfix: 'ugc' };
    var text = '@media only screen {div{display:block}\n';
    text = repeat(text, 100);
    text = '<style type="text/css">' + text + '</style>';
    text = repeat(text, 200);
    text = '<style type="text/css">\nbody {padding: 0}</style>' + text; // something valid in this mess
    purify(text, options, function(err, res) {
      expect(res).to.equal('<style>body.ugc {\n  padding: 0;\n}</style>');
      done();
    });
  });

  it('should not strip newlines from the html body', function(done) {
    var options = { prefix: 'abc', postfix: 'ugc' };
    var text = "<br><font size=2 face='sans-serif'>You are kindly requested to amend your\n" +
      "Address book and/or bookmarks and start using the following new email addresses\r\n" +
      "with immediate effect</font>\r" +
      "<br>";

    purify(text, options, function(err, res) {
      expect(res).to.equal(
        '<br class="ugc"><font size="2" face="sans-serif" class="ugc">'+
        'You are kindly requested to amend your\nAddress book and/or'+
        ' bookmarks and start using the following new email'+
        ' addresses\r\nwith immediate effect</font>\r<br class="ugc">'
      );
      done();
    });
  });

  it('should preserve data attribute', function(done) {
    var options = { prefix: 'abc', postfix: 'ugc' };
    purify('<a data-attachment-id="178">File link</a>', options, function(err, res) {
      expect(res).to.contain('data-attachment-id');
      expect(res).to.equal('<a data-attachment-id="178" class="ugc">File link</a>');
      done();
    });
  });

  it('should preserve cid attribute', function(done) {
    var options = { prefix: 'abc', postfix: 'ugc' };
    purify('<a data-attachment-id="178" data-cid="12345">File link</a>', options, function(err, res) {
      expect(res).to.contain('data-cid');
      expect(res).to.equal('<a data-attachment-id="178" data-cid="12345" class="ugc">File link</a>');
      done();
    });
  });

  describe('revertNamespace', function() {
    var revert = purifier.revertNamespace;
    it('should support prefix and postfix', function(done) {
      var options = { prefix: 'xyz', postfix: 'abc' };
      var input = '<span class="abc xyzhello">testing</span>';
      revert(input, options, function(err, res) {
        expect(err).to.not.be.an(Error);
        expect(res).to.equal('<span class="hello">testing</span>');
        done();
      });
    });

    it('should revert namespace from both html and style', function(done) {
      var options = { prefix: 'xyz-', postfix: 'abc' };
      var input = '<style>#xyz-link, #xyz-link2 #xyz-link3 #xyz-link4 #xyz-link5, p#xyz-test .abc{ margin-top:0; }</style><span class="abc xyz-hello">testing</span>';
      revert(input, options, function(err, res) {
        expect(err).to.not.be.an(Error);
        expect(res).to.equal('<style>#link,\n#link2 #link3 #link4 #link5,\np#test {\n  margin-top: 0;\n}</style><span class="hello">testing</span>');
        done();
      });
    });

    it('should not require any options', function(done) {
      var options = {};
      var input = '<span class="hello">testing</span>';
      revert(input, options, function(err, res) {
        expect(err).to.not.be.an(Error);
        expect(res).to.equal(input);
        done();
      });
    });

    it('should handle undefined input', function(done) {
      var options = { prefix: 'abc', postfix: 'ugc' };
      revert(undefined, options, function(err, res) {
        expect(res).to.equal('');
        done();
      });
    });

    it('should not strip newlines from the html body', function(done) {
      var options = { prefix: 'abc', postfix: 'ugc' };
      var text = '<br class="ugc"><font size="2" face="sans-serif" class="ugc">'+
        'You are kindly requested to amend your\nAddress book and/or'+
        ' bookmarks and start using the following new email'+
        ' addresses\r\nwith immediate effect</font>\r<br class="ugc">';

      revert(text, options, function(err, res) {
        expect(res).to.equal(
            "<br><font size=\"2\" face=\"sans-serif\">You are kindly requested to amend your\n" +
            "Address book and/or bookmarks and start using the following new email addresses\r\n" +
            "with immediate effect</font>\r" +
            "<br>"
        );
        done();
      });
    });

    it('should preserve data attribute', function(done) {
      var options = { prefix: 'abc', postfix: 'ugc' };
      revert('<a data-attachment-id="178" class="ugc">File link</a>', options, function(err, res) {
        expect(res).to.contain('data-attachment-id');
        expect(res).to.equal('<a data-attachment-id="178">File link</a>');
        done();
      });
    });

    it('should preserve cid attribute', function(done) {
      var options = { prefix: 'abc', postfix: 'ugc' };
      revert('<a data-attachment-id="178" data-cid="12345" class="ugc">File link</a>', options, function(err, res) {
        expect(res).to.contain('data-cid');
        expect(res).to.equal('<a data-attachment-id="178" data-cid="12345">File link</a>');
        done();
      });
    });

    it('should parse style correctly', function(done) {
      var options = { prefix: 'ugc-', postfix: 'ugc' };

      var clean = '<style>.ugc-ugc-ugc-ugc-ugc-ugc-cs95E872D0 { text-align: left; text-indent: 0pt;} .ugc-ugc-ugc-ugc-ugc-ugc-csA16174BA.ugc-ugc-ugc-ugc-ugc-ugc { color: #000000;} .ugc-ugc-ugc-ugc-ugc-ugc-cs5E98E930 { color: #000000; } .ugc-ugc-ugc-ugc-ugc-ugc-cs3FE84AE4 { color: #000000; }</style>';

      var expected = '<style>.cs95E872D0 {\n  text-align: left;\n  text-indent: 0pt;\n}\n\n.csA16174BA {\n  color: #000000;\n}\n\n.cs5E98E930 {\n  color: #000000;\n}\n\n.cs3FE84AE4 {\n  color: #000000;\n}</style>';
      revert(clean, options, function(err, res) {
        expect(res).to.equal(expected);
        done();
      });
    });

    it('should parse style correctly', function(done) {
      var options = { prefix: 'ugc-', postfix: 'ugc' };

      var clean = '<style>.table{max-width:965px;font-size:12px;font-family:arial,helvetica;text-align:justify;border-collapse:collapse;border:1px solid black}.footer{font-size:12px;font-family:arial,helvetica;text-align:justify;border-collapse:collapse}.header{color:white;background:#00309B;font-family:arial,helvetica;font-weight:bold;text-align:center}.subheader{color:white;background:#00309B;font-family:arial,helvetica;text-align:center}.blankrow{height:6px;background-color:lightgray}.piccell{color:black;background-color:white;padding:0;text-align:left}.propcell{color:#00309B;background-color:white;white-space:nowrap;text-align:left;border:1px solid black;width:25%}.valcell{color:#00309B;background-color:white;white-space:nowrap;text-align:left;border:1px solid black;width:auto}.valcellgreen{color:#00309B;background-color:green;white-space:nowrap;text-align:left;border:1px solid black;width:25%}.valcellred{color:#00309B;background-color:red;white-space:nowrap;text-align:left;border:1px solid black;width:25%}.valcellorange{color:#00309B;background-color:orange;white-space:nowrap;text-align:left;border:1px solid black;width:25%}.relcellgreen{color:#00309B;background-color:green;white-space:nowrap;text-align:left;border:1px solid black;width:25%}.relcellred{color:#00309B;background-color:red;white-space:nowrap;text-align:left;border:1px solid black;width:25%}.relcellorange{color:#00309B;background-color:orange;white-space:nowrap;text-align:left;border:1px solid black;width:25%}</style>';

      var expected = '<style>.table {\n  max-width: 965px;\n  font-size: 12px;\n  font-family: arial,helvetica;\n  text-align: justify;\n  border-collapse: collapse;\n  border: 1px solid black;\n}\n\n.footer {\n  font-size: 12px;\n  font-family: arial,helvetica;\n  text-align: justify;\n  border-collapse: collapse;\n}\n\n.header {\n  color: white;\n  background: #00309B;\n  font-family: arial,helvetica;\n  font-weight: bold;\n  text-align: center;\n}\n\n.subheader {\n  color: white;\n  background: #00309B;\n  font-family: arial,helvetica;\n  text-align: center;\n}\n\n.blankrow {\n  height: 6px;\n  background-color: lightgray;\n}\n\n.piccell {\n  color: black;\n  background-color: white;\n  padding: 0;\n  text-align: left;\n}\n\n.propcell {\n  color: #00309B;\n  background-color: white;\n  white-space: nowrap;\n  text-align: left;\n  border: 1px solid black;\n  width: 25%;\n}\n\n.valcell {\n  color: #00309B;\n  background-color: white;\n  white-space: nowrap;\n  text-align: left;\n  border: 1px solid black;\n  width: auto;\n}\n\n.valcellgreen {\n  color: #00309B;\n  background-color: green;\n  white-space: nowrap;\n  text-align: left;\n  border: 1px solid black;\n  width: 25%;\n}\n\n.valcellred {\n  color: #00309B;\n  background-color: red;\n  white-space: nowrap;\n  text-align: left;\n  border: 1px solid black;\n  width: 25%;\n}\n\n.valcellorange {\n  color: #00309B;\n  background-color: orange;\n  white-space: nowrap;\n  text-align: left;\n  border: 1px solid black;\n  width: 25%;\n}\n\n.relcellgreen {\n  color: #00309B;\n  background-color: green;\n  white-space: nowrap;\n  text-align: left;\n  border: 1px solid black;\n  width: 25%;\n}\n\n.relcellred {\n  color: #00309B;\n  background-color: red;\n  white-space: nowrap;\n  text-align: left;\n  border: 1px solid black;\n  width: 25%;\n}\n\n.relcellorange {\n  color: #00309B;\n  background-color: orange;\n  white-space: nowrap;\n  text-align: left;\n  border: 1px solid black;\n  width: 25%;\n}</style>';
      revert(clean, options, function(err, res) {
        expect(res).to.equal(expected);
        done();
      });
    });

    it('should parse style correctly when there are comments in style', function(done) {
      var options = { prefix: 'ugc-', postfix: 'ugc' };

      var clean = '<style><!--/* Font Definitions */@font-face {font-family:SimSun; panose-1:2 1 6 0 3 1 1 1 1 1;} @font-face {font-family:SimSun; panose-1:2 1 6 0 3 1 1 1 1 1;}/* Style Definitions */ p.ugc-MsoNormal, li.MsoNormal, div.ugc{margin:0in;margin-bottom:.0001pt; \font-size:11.0pt;font-family:"Calibri","serif";} </style>';

      var expected = '<style>/* Font Definitions */\n\n@font-face {\n  font-family: SimSun;\n  panose-1: 2 1 6 0 3 1 1 1 1 1;\n}\n\n@font-face {\n  font-family: SimSun;\n  panose-1: 2 1 6 0 3 1 1 1 1 1;\n}\n\n/* Style Definitions */\n\np.MsoNormal,\nli.MsoNormal,\ndiv {\n  margin: 0in;\n  margin-bottom: .0001pt;\n  ont-size: 11.0pt;\n  font-family: "Calibri","serif";\n}</style>';

      revert(clean, options, function(err, res) {
        expect(res).to.equal(expected);
        done();
      });
    });

  });

});

/**
 * Until we have ES6 String.repeat
 */
function repeat(str, count) {
  'use strict';
  if (str == null) {
    throw new TypeError('can\'t convert ' + str + ' to object');
  }
  str = '' + str;
  count = +count;
  if (count != count) {
    count = 0;
  }
  if (count < 0) {
    throw new RangeError('repeat count must be non-negative');
  }
  if (count == Infinity) {
    throw new RangeError('repeat count must be less than infinity');
  }
  count = Math.floor(count);
  if (str.length == 0 || count == 0) {
    return '';
  }
  // Ensuring count is a 31-bit integer allows us to heavily optimize the
  // main part. But anyway, most current (august 2014) browsers can't handle
  // strings 1 << 28 chars or longer, so:
  if (str.length * count >= 1 << 28) {
    throw new RangeError('repeat count must not overflow maximum string size');
  }
  var rpt = '';
  for (;;) {
    if ((count & 1) == 1) {
      rpt += str;
    }
    count >>>= 1;
    if (count == 0) {
      break;
    }
    str += str;
  }
  return rpt;
}
