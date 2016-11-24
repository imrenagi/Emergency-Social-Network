'use strict';
class CloudImageService {
	constructor() {
	}

	cloudinaryConfig(){
		return new Error("Must override!");
	}
	
	uploadImage() {
		return new Error("Must override!");
	}

}

module.exports = CloudImageService;