
var R = 6373; //Earth radius in KM

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

exports.isInRange = function(firstLocation, secondLocation, rangeInKM){
	if (this.distance(firstLocation, secondLocation) < rangeInKM) {
		return true
	} else {
		return false;
	}
};

exports.distance = function(loc1, loc2) {
	var φ1 = loc1.lat.toRad();
	var φ2 = loc2.lat.toRad();
	var Δφ = (loc2.lat-loc1.lat).toRad();
	var Δλ = (loc2.long-loc1.long).toRad();

	var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
	        Math.cos(φ1) * Math.cos(φ2) *
	        Math.sin(Δλ/2) * Math.sin(Δλ/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	return d.toFixed(3);
};