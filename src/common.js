/*global require*/
require.config({

	baseUrl: '.',
	paths: {
		text: 'library/text',
		jquery: 'library/jquery',
		underscore: 'library/underscore',
		backbone: 'library/backbone',
		mustache: 'library/mustache',
		d3: 'library/d3'
	},
	shim:{
		d3:{
			exports:'d3'
		}
	}
});

require(['modules/app'], function(pageloader) {

	pageloader.init();

});

