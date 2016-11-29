var expect = require('expect.js');
var calc = require('../../helpers/distanceCalculator');
var Location = require('../../models/location');

suite('Distance Calculator Test', function() {

	test('Should give correct distance', function() {
		var center = new Location(38.898556, -77.037852);
		var loc = new Location(38.897147, -77.043934);
		expect(calc.distance(center, loc)).to.be.eql(0.549);
	});

	test('Should give correct distance if more than 10 km', function() {
		var p1 = new Location(37.3992766,-122.0894144);
		var p2 = new Location(37.7576793,-122.5076405);
		expect(calc.distance(p1, p2)).to.be.eql(54.299);
	})

	test('p2 should be in range', function() {
		var center = new Location(38.898556, -77.037852);
		var loc = new Location(38.897147, -77.043934);
		expect(calc.isInRange(center, loc, 10)).to.be.eql(true);
	});

	test('p2 should be out of range', function() {
		var p1 = new Location(37.3992766,-122.0894144);
		var p2 = new Location(37.7576793,-122.5076405);
		expect(calc.isInRange(p1, p2, 10)).to.be.eql(false);
	});

})
