var expect = require('expect.js');
var Location = require('../../models/location');

suite('Location Test', function() {

	test('Location with default constructor and complete value should be correct', function() {
		var loc = new Location(100.0, 121.0);
		expect(loc.lat).to.be.eql(100.0);
		expect(loc.long).to.be.eql(121.0);
	}) 

})