/* global console */


define(['jquery',
	'backbone',
	'underscore',
	'modules/barChart',
	'd3',
	'modules/data'
], function($,
	Backbone,
	_,
	BarChart,
	d3,
	json
	) {

	var pageloader = {

		init : function() {

			var chart = new BarChart({
				el: '#container',
				collection: new Backbone.Collection(json.data.cluster)
			});

			chart.render();
		}
	};

	return pageloader;

});
