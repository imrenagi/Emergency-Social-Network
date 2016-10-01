var moment = require('moment')

exports.convert = function(date){
	return moment(date,'x').format('YYYY-MM-DD HH:mm:ss')
}

exports.convertDateToTimestamp = function(date) {
	return moment(date,'YYYY-MM-DD HH:mm:ss').unix()
}