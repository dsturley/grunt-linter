

module.exports = function (grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({

		watch: {
			files: '<config:linter.files>',
			tasks: 'default'
		},

		linter: {
			files: [ // some example files
				'*.js',
				'tasks/**/*.js'
			],
			options: {
				//linter: '/Users/davidsturley/jslint.js',
				junit: 'out/junit.xml',
				log: 'out/lint.log',
				errorsOnly: false

			},

			// if .jshintrc is found in pwd or above, it will override all of these directives
			directives: {
				node: true,
				forin: true,
				noarg: true,
				noempty: true,
				eqeqeq: true,
				bitwise: true,
				strict: true,
				undef: true,
				unused: true,
				curly: true,
				white: true
			},

			globals: {
				require: true,
				module: true
			}
		}

	});

	grunt.loadTasks('./tasks');
	grunt.registerTask('default', 'linter');

};
