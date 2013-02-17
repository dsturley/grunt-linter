/*!
 * grunt-linter
 * https://github.com/circusbred/grunt-linter
 *
 * Copyright (c) 2012 David Sturley, Stephen Mathieson
 * Licensed under the MIT license.
 */

var linter,
	vm = require('vm'),
	ctx = vm.createContext(),
	filepath = __dirname + '/../lib/jshint/src/stable/jshint.js';

module.exports = function (grunt) {
	'use strict';


	/**
	 * Grabs a config option from the `linter` namespace
	 *
	 * @param  {String} option The option/configuration key
	 * @return {Mixed|Any}     The key's value
	 */
	function conf(option) {
		return grunt.config('linter.' + option);
	}

	var underscore, isJSLint, jshintrc, directives, globals,
		// are we stupid? changing APIs/namespaces and not documenting them is pretty fucking cool
		isStupid = false,
		templates = {},
		options = conf('options') || {};

	filepath = options.linter || filepath;

	/**
	 * Fetch underscore (lodash?) from the grunt utils namespace.  The namespace
	 * changed from 0.3.x to 0.4.x, so we're checking for both.
	 */
	underscore = (function () {

		// 0.4.x
		if (grunt.util && grunt.util._) {
			isStupid = true;
			return grunt.util._;
		}

		// 0.3.x
		return grunt.utils._;

	}());

	vm.runInContext(grunt.file.read(filepath), ctx);

	linter = ctx.JSLINT || ctx.JSHINT;
	isJSLint = linter === ctx.JSLINT;

	templates.standard = grunt.file.read(__dirname + '/templates/standard.tmpl');
	templates.errors_only = grunt.file.read(__dirname + '/templates/errors-only.tmpl');
	templates.junit = grunt.file.read(__dirname + '/templates/junit.tmpl');


	if (isStupid) {
		jshintrc = grunt.file.findup('.jshintrc');

	} else {
		jshintrc = grunt.file.findup('.', '.jshintrc');

	}

	if (jshintrc) {
		jshintrc = grunt.file.readJSON(jshintrc);

		if (jshintrc) {
			if (jshintrc.globals) {
				globals = jshintrc.globals;
				delete jshintrc.globals;
			}

			directives = jshintrc;
		}
	}

	grunt.registerTask('linter', 'Your task description goes here.', function () {

		var template,
			files = conf('files'),
			excludedFiles = conf('exclude') || [],
			filesInViolation = 0,
			errorCount = 0,
			report = {
				files: []
			};


		directives = directives || conf('directives') || {};
		globals = globals || conf('globals') || {};

		if (!files) {
			grunt.log.error('NO FILES?!?');
			return false;
		}
		if (isJSLint) {
			directives.predef = Object.keys(globals);
		}

		excludedFiles = grunt.file.expand(excludedFiles);

		files = grunt.file.expand(files).filter(function (file) {
			return excludedFiles.indexOf(file) === -1;
		});

		files.forEach(function (filepath, index) {
			var source = grunt.file.read(filepath),
				passed = linter(source, directives, globals),
				errors = linter.errors;

			if (errors.length) {
				errorCount += errors.length;
				filesInViolation += 1;
			}

			report.files[index] = {
				filepath: filepath,
				passed: passed,
				errors: errors
			};

		});

		report.failures = errorCount;
		report.filesInViolation = filesInViolation;

		if (options.errorsOnly) {
			// use underscore for templating directly rather than relying on
			// grunt's impl of it
			template = underscore.template(templates.errors_only, {
				'obj': report
			});
		} else {
			template = underscore.template(templates.standard, {
				'obj': report
			});
		}

		grunt.log.write(template);

		if (options.log) {
			grunt.file.write(options.log, grunt.log.uncolor(template));
		}

		if (options.junit) {
			template = underscore.template(templates.junit, {
				'obj': report
			});
			grunt.file.write(options.junit, template);
		}

		if (errorCount) {
			return false;
		}

	});

};
