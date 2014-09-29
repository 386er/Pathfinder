/*global module*/
/*global require*/

var config = module.exports;

config['Pathfinder Project Test'] = {
	rootPath: '..',
	environment: 'browser',
	libs: [
		'src/library/require.js',
		'test/requireConfig.js'
	],
	sources: [
		'src/library/text.js',
		'src/library/jquery.js',
		'src/library/underscore.js',
		'src/library/backbone.js',
		'src/library/mustache.js',
		'src/library/moment.min.js',
		'src/library/d3.js',
		'src/modules/*.js',
		'src/modules/*.html'
	],
	tests: [
		'test/TestPathFinderView.js'
	],
	extensions: [require('buster-amd')],
};
