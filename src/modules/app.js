/* global console */


define(['jquery',
	'backbone',
	'underscore',
	'modules/barChart',
	'd3',
	'modules/json'
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
				collection: new Backbone.Collection(json),

				xAttr: 'letter',
				yAttr: 'frequency'

			});



			chart.render();

			console.log(chart.collection.pluck(chart.defaults.xAttr));


			$('#container').html(chart.el);

		}

	};

	return pageloader;

});
