var bcrypt = require('bcrypt-nodejs');

var salt = bcrypt.genSaltSync(10);

exports.compare = function(plain, encrypted) {
	return bcrypt.compareSync(plain, encrypted); 
};

exports.createHash = function(plain) {
	return bcrypt.hashSync(plain, salt);
}