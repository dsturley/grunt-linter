# grunt-jslint

Validates JavaScript files with [JSHint](https://github.com/jshint/jshint) or [JSLint](https://github.com/douglascrockford/JSLint) as a [grunt](https://github.com/cowboy/grunt) task.  JSHint is bundled with the plugin.

## Installation
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-linter`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-linter');
```

[npm_registry_page]: http://search.npmjs.org/#/grunt-linter
[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md

## Documentation

A single-task to validate your JavaScript files with JSHint or JSLint.

Supports the following options:

<dl>
	<dt>files</dt>
	<dd>An array of files or <a href="https://github.com/gruntjs/grunt/blob/master/docs/api_file.md#file-lists-and-wildcards">wildcards</a> which you want to be validated with the linter.</dd>

	<dt>exclude</dt>
	<dd>A String/filepath/wildcard option which, when provided, tells the plugin which files should be ignored (not scanned).
	</dd>

	<dt>directives</dt>
	<dd>Configuration options/settings to pre-define in JSHint.</dd>

	<dt>globals</dt>
	<dd>Pre-defined globals; should be an object: <code>{
		jQuery: true
	}</code></dd>

	<dt>options</dt>
	<dd>Configuration options/settings for the plugin itself.  Currently supports the following:

		<dl>
			<dt>errorsOnly</dt>
			<dd>A Boolean option which tells the plugin to only display errors when set to `true`.</dd>

			<dt>log</dt>
			<dd>A String/filepath option which, when provided, tells the plugin where to write a verbose log to.</dd>

			<dt>junit</dt>
			<dd>A String/filepath option which, when provided, tells the plugin where to write a JUnit-style XML file to.</dd>

			<dt>linter</dt>
			<dd>A String/filepath option which, when provided, tells the plugin where to load JSHint or JSLint from.</dd>

		</dl>

	</dd>
</dl>


## Example Usage
```javascript
/*jslint node:true*/

module.exports = function (grunt) {

	'use strict';

	grunt.loadNpmTasks('grunt-linter'); // load the task

	grunt.initConfig({
		watch: {
			files: '<config:linter.files>',
			tasks: 'linter'
		},

		// TAKE NOTE - this has changed since 0.1.8

		linter: { // configure the task
			files: [ // some example files
				'grunt.js',
				'src/**/*.js'
			],
			exclude: [
				'**/ignore-*.js',
				'bananas.js'
			],
			directives: { // example directives
				browser: true,
				todo: true
			},
			globals: {
				jQuery: true
			}
			options: {
				junit: 'out/junit.xml', // write the output to a JUnit XML
				log: 'out/lint.log',
				errorsOnly: true, // only display errors
				linter: '/path/to/jshint.js'
			}
		}

	});

	grunt.registerTask('default', 'watch');
};
```


## Release History
* 0.1.1 - Made `options` optional
* 0.1.0 - Forked from grunt-jslint; first release

## License
Copyright (c) 2012 David Sturley, Stephen Mathieson
Licensed under the MIT license.
