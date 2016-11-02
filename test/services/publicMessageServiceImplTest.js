var expect = require('expect.js');
var sinon = require('sinon');

var PublicMessageServiceImpl = require('../../services/publicMessageServiceImpl');
var PublicMessageDAOImpl = require('../../services/publicMessageDAOImpl');
var db = require('../../services/db');

var publicMessageDAO = new PublicMessageDAOImpl();
var publicMessageService = new PublicMessageServiceImpl();
//var publicMessageDAOMock = sinon.mock(publicMessageDAO);
//var dbMock = sinon.mock(db);
var getMock = sinon.mock(db.get());

suite('Public Message Service Implementation Test', function(){

	test('First Get all Messages with invalid last id should return all messages till limit', function(){
		var limit = 10;
		var query = 'SELECT pm.*, u.user_name FROM public_messages pm LEFT JOIN users u ON pm.sender_id = u.id order by pm.id desc limit ' + limit
		getMock.expects('query').once().withArgs(query).returns(
			Promise.resolve({})
		);
		publicMessageService.getAllMessages(-1,10);
		getMock.verify()
		publicMessageDAOMock.restore()
			done()
	})


	test('Store public message should trigger correct db query', function() {
		var senderId = 1
		var message = "Hi"
		var message_status = 1
		var lat = 192
		var long = 168
		var values = [senderId, message, message_status, lat, long];
    	var query = 'INSERT INTO public_messages (sender_id, message, message_status, latitude, longitude) VALUES (?,?,?,?,?)';
		var query2 = 'SELECT pm.*, u.user_name FROM public_messages pm LEFT JOIN users u ON pm.sender_id = u.id where pm.id = ?'
		var result = 1
		getMock.expects('query').once().withArgs(query, values).returns(
			Promise.resolve(1)
			);;
		publicMessageService.storeMessage(senderId, message, message_status, lat, long).then(function(result){
				expect(result).to.be(1);
			}).catch(function(err){
			done(err);
		})
		getMock.verify()
		getMock.restore()
		done()
	})





})