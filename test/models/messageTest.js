var expect = require('expect.js');
var Message = require('../../models/message');

suite('Message Test', function() {

	test('Message with default constructor and complete value should be correct', function() {
		var msg = new Message(1, 2, "message", 123123, 0, {lat : 100.0, long:102.0});
		expect(msg.id).to.be.eql(1)
		expect(msg.sender).to.be.eql(2)
		expect(msg.text).to.be.eql("message")
		expect(msg.timestamp).to.be.eql(123123)
		expect(msg.status).to.be.eql(0)
		expect(msg.location.lat).to.be.eql(100.0)
		expect(msg.location.long).to.be.eql(102.0)
	}) 
})