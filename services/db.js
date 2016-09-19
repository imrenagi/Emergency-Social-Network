var mysql = require('mysql');

var DB = 'esn_db', TEST_DB = 'esn_test_db'

exports.MODE_TEST = 'mode_test'
exports.MODE_PRODUCTION = 'mode_production'

var state = {
	pool: null,
	mode: null
}

exports.connect = function(mode, done) {
	state.pool = mysql.createPool({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: mode === exports.MODE_PRODUCTION ? DB : TEST_DB
	})
	state.mode = mode
	done()
}

exports.get = function(){
	return state.pool
}
