"use strict"; 
var R = require('ramda');
 
class UserDataObjectImpl {
 
 	constructor(db) {
		this.db = db;
 	}
 
 	getAllEmails() {
 		var that = this;
 		return new Promise(function(resolve, reject) {
 			that.db.get().query('select email from users where email is not null', function(err, result) {
 				if(err) {
 					reject(err);
 				} else {
 					let res = JSON.parse(JSON.stringify(result));
 					let out = R.map(result => result.email, res);
					resolve(out);
 				}
 			});
 		});
 	}

 	updateEmails(userId, email) {
 		var that = this;
 		return new Promise(function(resolve, reject) {
 			that.db.get().query('update users set email = "'+email+'" where id = "'+userId+'";', function(err, result) {
 				if(err) {
 					reject(err);
 				} else {
 					resolve(result);
 				}
 			});
 		});
 	}

 	getEmail(userId) {
 		var that = this;
 		return new Promise(function(resolve, reject) {
 			that.db.get().query('select email from users where id = ?', userId, function(err, result) {
 				if(err) {
 					reject(err);
 				} else {
 					let res = JSON.parse(JSON.stringify(result));
 					resolve(res[0]);
 				}
 			});
 		});
 	}
 }
 
 module.exports = UserDataObjectImpl;
