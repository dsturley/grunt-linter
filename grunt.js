/*jslint node: true */
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
				'grunt.js',
				'tasks/linter.js'
			],
			directives: { // some example JSHint directives
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
			options: {
				junit: 'out/junit.xml',
				log: 'out/lint.log',
				errorsOnly: false/*,
				linter: '/Users/davidsturley/jslint.js' */

			},
			// superfluous; node:true sets this too
			globals: {
				require: true,
				module: true
			}
		}

	});

	// Load local tasks.
	grunt.loadTasks('./tasks');

	// Default task.
	grunt.registerTask('default', 'linter');

};
