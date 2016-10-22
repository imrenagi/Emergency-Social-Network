var mysql = require('mysql');

var DB = process.env.DB_NAME , TEST_DB = 'esn_db_test'

exports.MODE_TEST = 'mode_test'
exports.MODE_PRODUCTION = 'mode_production'

var state = {
	pool: null,
	mode: null
}

exports.connect = function(mode, done) {
	state.pool = mysql.createPool({
		host: process.env.DB_HOST || 'localhost',
		user: process.env.DB_USER || 'root',
		password: process.env.DB_PASSWORD || '',
		database: mode === exports.MODE_PRODUCTION ? DB : TEST_DB
	})
	state.mode = mode
	done()
}

exports.get = function(){
	return state.pool
}
