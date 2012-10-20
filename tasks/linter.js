/*!
 * grunt-linter
 * https://github.com/circusbred/grunt-linter
 *
 * Copyright (c) 2012 David Sturley, Stephen Mathieson
 * Licensed under the MIT license.
 */

/*jslint node:true, nomen:true*/

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

	var isJSLint,
		templates = {},
		options = conf('options') || {};

	filepath = options.linter || filepath;

	vm.runInContext(grunt.file.read(filepath), ctx);

	linter = ctx.JSLINT || ctx.JSHINT;
	isJSLint = linter === ctx.JSLINT;

	templates.standard = grunt.file.read(__dirname + '/templates/standard.tmpl');
	templates.errors_only = grunt.file.read(__dirname + '/templates/errors-only.tmpl');
	templates.junit = grunt.file.read(__dirname + '/templates/junit.tmpl');

	grunt.registerTask('linter', 'Your task description goes here.', function () {

		var template,
			files = conf('files'),
			excludedFiles = conf('exclude') || [],
			options = conf('options') || {},
			directives = conf('directives') || {},
			globals = conf('globals') || {},
			filesInViolation = 0,
			errorCount = 0,
			report = {
				files: []
			};

		if (!files) {
			grunt.log.error('NO FILES?!?');
			return false;
		}
		if (isJSLint) {
			directives.predef = Object.keys(globals);
		}

		excludedFiles = grunt.file.expandFiles(excludedFiles);

		files = grunt.file.expandFiles(files).filter(function (file) {
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
			template = grunt.template.process(templates.errors_only, report);
		} else {
			template = grunt.template.process(templates.standard, report);
		}

		grunt.log.write(template);

		if (options.log) {
			grunt.file.write(options.log, grunt.log.uncolor(template));
		}

		if (options.junit) {
			template = grunt.template.process(templates.junit, report);

			grunt.file.write(options.junit, template);
		}

		if (errorCount) {
			return false;
		}

	});

};