var expect = require('expect.js');
var User = require('../../models/user');

suite('User Test', function() {

	test('User with default constructor and complete value should be correct', function() {
		var user = new User(1, "imre", 1, 2, 1);
		expect(user.getId()).to.be.eql(1);
		expect(user.getUserName()).to.be.eql("imre");
		expect(user.online).to.be.eql(1);
		expect(user.status).to.be.eql(2);
		expect(user.privilage).to.be.eql(1);
	}) 

	test('User with default constructor and incomplete value should be correct', function() {
		var user = new User(1, "imre");
		expect(user.getId()).to.be.eql(1);
		expect(user.getUserName()).to.be.eql("imre");
		expect(user.online).to.be.eql(0);
		expect(user.status).to.be.eql(0);
		expect(user.privilage).to.be.eql(0);
	}) 

})