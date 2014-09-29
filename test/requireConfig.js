/*global require*/
require.config({

	baseUrl: './src',
	paths: {
		'test': '../test',
		text: 'library/text',
		jquery: 'library/jquery',
		underscore: 'library/underscore',
		backbone: 'library/backbone',
		mustache: 'library/mustache',
		moment: 'library/moment.min',
		d3:'library/d3'
	},
	shim:{
		d3:{
			exports:'d3'
		}
	}
});
