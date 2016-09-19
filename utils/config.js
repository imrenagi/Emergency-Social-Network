module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            return {
            	gmaps: {
            		apikey: ''
            	}
            };
        case 'staging':
        	return {
            	gmaps: {
            		apikey: ''
            	}
            };
        case 'production':
            return {
            	gmaps: {
            		apikey: ''
            	}
            };
        default:
            return {
            	gmaps: {
            		apikey: ''
            	}
            };
    }
};