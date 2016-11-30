'use strict';
var cloudinary = require('cloudinary');
var CloudImageService = require('./interfaces/cloudImageService');

class CloudImageServiceImpl extends CloudImageService{
	constructor(){
		super();
	}

	cloudinaryConfig(){
		cloudinary.config({ 
  			cloud_name: 'atadkase', 
  			api_key: '486118391826883', 
  			api_secret: 'dJ3VOT8M7cVOaElXy3XldhmXqnQ' 
		});
	}

	uploadImage(imageFile){
		return new Promise(function(resolve, reject) {
			cloudinary.v2.uploader.upload(imageFile, { eager: { quality: "jpegmini" }}, function(err, result){
				console.log(result.url);
				if(err)
					reject(err);
				else
					resolve(result.url);
			});
		});
	}
}

module.exports = CloudImageServiceImpl;
