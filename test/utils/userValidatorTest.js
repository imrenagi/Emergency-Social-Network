var expect = require('expect.js');
var userValidator = require('../../utils/userValidator');

suite('User Validator Test', function() {

	test('user name with length greater than three should be valid', function(done) {
		var validUserName = "imre";
		expect(userValidator.isUserNameValid(validUserName)).to.be.ok()
		done()
	})	

	test('user name with length equal to three should be valid', function(done) {
		var validUserName = "imr";
		expect(userValidator.isUserNameValid(validUserName)).to.be.ok()
		done()
	})	

	test('user name with empty string should be invalid', function(done) {
		var userName = "";
		expect(userValidator.isUserNameValid(userName)).to.not.be.ok()
		done()
	})	

	test('user name with length smaller than 3 should be invalid', function(done) {
		var userName = "as"
		expect(userValidator.isUserNameValid(userName)).to.not.be.ok()
		done()
	})

	test('reserved username should be invalid', function(done) {
		expect(userValidator.isUserNameValid('subdomain')).to.not.be.ok()
		expect(userValidator.isUserNameValid('register')).to.not.be.ok()
		expect(userValidator.isUserNameValid('task')).to.not.be.ok()
		expect(userValidator.isUserNameValid('xxx')).to.not.be.ok()
		done()
	})

	test('case insensitive reserved username should be invalid', function(done) {
		expect(userValidator.isUserNameValid('Subdomain')).to.not.be.ok()
		expect(userValidator.isUserNameValid('Register')).to.not.be.ok()
		expect(userValidator.isUserNameValid('Task')).to.not.be.ok()
		expect(userValidator.isUserNameValid('xxx')).to.not.be.ok()
		done()
	})

	test('pasword with length less than 4 should be invalid', function(done) {
		expect(userValidator.isPasswordValid('xxx')).to.not.be.ok()
		done()
	})

	test('empty password should be invalid', function(done) {
		expect(userValidator.isPasswordValid('')).to.not.be.ok()
		done()
	})

	test('password whose length greater or equal to 4 should be valid', function(done) {
		expect(userValidator.isPasswordValid('1234')).to.be.ok()
		expect(userValidator.isPasswordValid('12345')).to.be.ok()
		done()
	})

	test('active status should be valid', function() {
		expect(userValidator.isValidActiveStatus(0)).to.be.ok()
		expect(userValidator.isValidActiveStatus(1)).to.be.ok()
	})

	test('these active status should be invalid', function() {
		expect(userValidator.isValidActiveStatus(-1)).not.to.be.ok()
		expect(userValidator.isValidActiveStatus(2)).not.to.be.ok()
		expect(userValidator.isValidActiveStatus(3)).not.to.be.ok()
	})

	test('these privilage should be valid', function() {
		expect(userValidator.isValidPrivilage(0)).to.be.ok()
		expect(userValidator.isValidPrivilage(1)).to.be.ok()
		expect(userValidator.isValidPrivilage(2)).to.be.ok()
	})

	test('these privilage should be invalid', function() {
		expect(userValidator.isValidPrivilage(-1)).not.to.be.ok()
		expect(userValidator.isValidPrivilage(3)).not.to.be.ok()
		expect(userValidator.isValidPrivilage(4)).not.to.be.ok()
	})

})