var coverageFolder = process.env.CIRCLE_TEST_REPORTS === undefined ? 'coverage' : process.env.CIRCLE_TEST_REPORTS + '/coverage';
module.exports = function(grunt) {

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		mochaTest : {
			local: {
				options: {
					reporter: 'spec',
					quiet: false,
					clearRequireCache: false,
					ui: 'tdd'
				},
				src: ['test/services/publicMessageServiceImplTest.js']
			},
			circleci: {
	          options: {
	            ui: 'tdd',
	            reporter: 'mocha-junit-reporter',
	            quiet: false,
	            reporterOptions: {
	              mochaFile: coverageFolder + '/mocha/results.xml'
	            }
	          },
	          src: ['test/**/*.js']
	        },
		},
		mocha_istanbul: {
	        coverage: {
	            src: ['test/**/*.js'],
	            options: {
	                mochaOptions: ['--ui', 'tdd'], 
	                istanbulOptions: ['--dir', coverageFolder]
	            }
	        }
	    }
	});

	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-mocha-istanbul');

	grunt.registerTask('default', []);

	grunt.registerTask('test', ['mochaTest:local']);
	grunt.registerTask('circleci', ['mochaTest:circleci', 'mocha_istanbul']);
	grunt.registerTask('coverage', ['mocha_istanbul']);

}