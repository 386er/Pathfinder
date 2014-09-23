///* global console */


define(['jquery',
	'backbone',
	'underscore',
	'modules/pathFinderView',
	'd3',
	'modules/data'
], function($,
	Backbone,
	_,
	PathFinderView,
	d3,
	json
	) {

	var pageloader = {

		init : function() {

			var chart = new PathFinderView({
				el: '#container',
				collection: new Backbone.Collection(json.data.cluster)
			});

			chart.render();
		}
	};

	return pageloader;

});
