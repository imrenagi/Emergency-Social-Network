var expect = require('expect.js');
var JoinServiceImpl = require('../../services/joinServiceImpl');
var joinService = new JoinServiceImpl();

suite('Join Service Implementation Test', function() {

	test('user name with length greater than three should be valid', function(done) {
		var validUserName = "imre";
		expect(joinService.isUserNameValid(validUserName)).to.be.ok()
		done()
	})	

	test('user name with length equal to three should be valid', function(done) {
		var validUserName = "imr";
		expect(joinService.isUserNameValid(validUserName)).to.be.ok()
		done()
	})	

	test('user name with empty string should be invalid', function(done) {
		var userName = "";
		expect(joinService.isUserNameValid(userName)).to.not.be.ok()
		done()
	})	

	test('user name with length smaller than 3 should be invalid', function(done) {
		var userName = "as"
		expect(joinService.isUserNameValid(userName)).to.not.be.ok()
		done()
	})

	test('reserved username should be invalid', function(done) {
		expect(joinService.isUserNameValid('subdomain')).to.not.be.ok()
		expect(joinService.isUserNameValid('register')).to.not.be.ok()
		expect(joinService.isUserNameValid('task')).to.not.be.ok()
		expect(joinService.isUserNameValid('xxx')).to.not.be.ok()
		done()
	})

	test('case insensitive reserved username should be invalid', function(done) {
		expect(joinService.isUserNameValid('Subdomain')).to.not.be.ok()
		expect(joinService.isUserNameValid('Register')).to.not.be.ok()
		expect(joinService.isUserNameValid('Task')).to.not.be.ok()
		expect(joinService.isUserNameValid('xxx')).to.not.be.ok()
		done()
	})

	test('pasword with length less than 4 should be invalid', function(done) {
		expect(joinService.isPasswordValid('xxx')).to.not.be.ok()
		done()
	})

	test('empty password should be invalid', function(done) {
		expect(joinService.isPasswordValid('')).to.not.be.ok()
		done()
	})

	test('password whose length greater or equal to 4 should be valid', function(done) {
		expect(joinService.isPasswordValid('1234')).to.be.ok()
		expect(joinService.isPasswordValid('12345')).to.be.ok()
		done()
	})

})