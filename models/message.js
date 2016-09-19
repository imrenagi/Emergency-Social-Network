var db = require('../services/db')


// exports.getPreviousMessages = function(lastId, limit, next) {
// 	db.get().query('SELECT * FROM messages where id >='+ (lastId-limit) + ' and id < ' + lastId, function(err, result){
// 		if (err) return next(err, null)
// 		next(null, result)
// 	})
// }