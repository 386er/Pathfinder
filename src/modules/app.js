/* global console */


define(['jquery',
	'backbone',
	'underscore',
	'modules/pathFinderView',
	'modules/pathFinderCollection',
	'd3',
	'modules/daimlerdata'

], function($,
	Backbone,
	_,
	PathFinderView,
	PathFinderCollection,
	d3,
	jsondaimler
	) {

	var pageloader = {

		init : function() {

			var chart = new PathFinderView({
				el: '#container',
				collection: new PathFinderCollection(jsondaimler.data.cluster)
			});
			
			chart.render();
		}
	};

	return pageloader;

});
