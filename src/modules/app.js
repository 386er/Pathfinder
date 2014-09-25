/* global console */


define(['jquery',
	'backbone',
	'underscore',
	'modules/pathFinderView',
	'modules/pathFinderCollection',
	'd3',
	'modules/data'
], function($,
	Backbone,
	_,
	PathFinderView,
	pathFinderCollection,
	d3,
	json
	) {

	var pageloader = {

		init : function() {

			var chart = new PathFinderView({
				el: '#container',
				collection: new pathFinderCollection(json.data.cluster)
			});

			chart.render();

			console.log(chart.collection);

		}
	};

	return pageloader;

});
