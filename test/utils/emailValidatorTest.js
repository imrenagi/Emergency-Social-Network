var expect = require('expect.js');
var sinon = require('sinon');

var validator = require('../../utils/emailValidator');

suite('Email Validator Test', function() {

	test('these emails should be valid', function() {
		expect(validator.isValid("prettyandsimple@example.com")).to.be.ok();
		expect(validator.isValid("very.common@example.com")).to.be.ok();
		expect(validator.isValid("disposable.style.email.with+symbol@example.com")).to.be.ok();
		expect(validator.isValid("other.email-with-dash@example.com")).to.be.ok();
		expect(validator.isValid("x@example.com")).to.be.ok();
		expect(validator.isValid("\"much.more unusual\"@example.com")).to.be.ok();
		expect(validator.isValid("\"very.unusual.@.unusual.com\"@example.com")).to.be.ok();
		expect(validator.isValid("example-indeed@strange-example.com")).to.be.ok();
		expect(validator.isValid("\" \"@example.org")).to.be.ok();
		expect(validator.isValid("example@s.solutions")).to.be.ok();
	});

	test('these emails should be invalid', function() {
		expect(validator.isValid("Abc.example.com")).not.to.be.ok();
		expect(validator.isValid("A@b@c@example.com")).not.to.be.ok();
		expect(validator.isValid("just\"not\"right@example.com")).not.to.be.ok();
		expect(validator.isValid("this is\"not\\allowed@example.com")).not.to.be.ok();
		expect(validator.isValid("john..doe@example.com")).not.to.be.ok();
		expect(validator.isValid("john.doe@example..com")).not.to.be.ok();
		expect(validator.isValid("prettyandsimple@example.com ")).not.to.be.ok();
		expect(validator.isValid(" prettyandsimple@example.com")).not.to.be.ok();
	})

});
