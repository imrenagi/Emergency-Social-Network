var expect = require('expect.js');
var encryptor = require('../../helpers/passwordEncryptor');

suite('Password Encryptor Test', function() {

	test('Created hash should be the same with the encrypted plain text', function(done) {
		var hash = encryptor.createHash('password1234');
		expect(encryptor.compare('password1234', hash)).to.not.be(undefined);
		done()
	})

})
