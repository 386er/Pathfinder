
define([
	'backbone',
	'd3'
], function(Backbone, d3) {

	var ChartBase =  Backbone.View.extend({

		defaults: {
			xAttr: 'x',
			yAttr: 'y',
			margin: {top: 20, right: 20, bottom: 30, left:40}
		},

		render: function() {

			var margin = this.defaults.margin;
			this.width = 900 - margin.left - margin.right;
			this.height = 600 - margin.top - margin.bottom;

			this.svg = d3.select(this.el).append('svg')
				.attr('width', this.width + margin.left + margin.right)
				.attr('height', this.height + margin.top + margin.bottom)
				.append('g')
				.attr('transform', 'translate(' +
					margin.left + ',' + margin.top + ')');

			this.scales = {
				x: this.getXScale(),
				y: this.getYScale()
			};

			this.renderAxes();
			this.renderData();

			return this;
		}

	});

	return ChartBase;

});
