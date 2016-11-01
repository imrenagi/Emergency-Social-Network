var mysql = require('mysql');

var DB = process.env.DB_NAME , 
TEST_DB = 'esn_db_test',
CIRCLE_TEST_DB = 'circle_test'

exports.MODE_TEST = 'mode_test'
exports.MODE_CIRCLE_TEST = 'mode_circle'
exports.MODE_PRODUCTION = 'mode_production'

var state = {
	pool: null,
	mode: null
}

function getDB(mode) {
	var db = DB;
	if (mode === exports.MODE_TEST) {
		db = TEST_DB
	} else if (mode === exports.MODE_CIRCLE_TEST) {
		db = CIRCLE_TEST_DB
	} 
	return db;
}

exports.connect = function(mode, done) {
	state.pool = mysql.createPool({
		host: process.env.DB_HOST || 'localhost',
		user: process.env.DB_USER || 'root',
		password: process.env.DB_PASSWORD || '',
		database: getDB(mode)
	})
	state.mode = mode
	done()
}

exports.get = function(){
	return state.pool
}
