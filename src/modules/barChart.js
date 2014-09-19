
define([
	'backbone',
	'd3',
	'underscore',
	'modules/chartBase'
], function(Backbone, d3, _, ChartBase) {

	var BarChart  =  ChartBase.extend({

		defaults: _.defaults({
			barPadding: 0.1
		}, ChartBase.prototype.defaults),

		getXScale: function() {
			var padding = this.defaults.barPadding;
			return d3.scale.ordinal()
				.rangeRoundBands([0, this.width], padding)
				.domain(this.collection.pluck('letter'));
		},

		getYScale: function() {
			return d3.scale.linear()
				.rangeRound([this.height, 0])
				.domain([0, d3.max(this.collection.pluck('frequency'))]);
		},


		renderAxes: function() {
			var xAxis = d3.svg.axis()
				.scale(this.scales.x)
				.orient('bottom');

			var yAxis = d3.svg.axis()
				.scale(this.scales.y)
				.orient('left')
				.tickFormat(d3.format('.0%'));

			this.svg.append('g')
				.attr('class', 'x axis')
				.attr('transform', 'translate(0,' + this.height + ')')
				.call(xAxis);

			this.svg.append('g')
				.attr('class', 'y axis')
				.call(yAxis);
		},

		renderData: function() {
			var chart = this,
			x = this.scales.x,
			y = this.scales.y;

			this.svg.selectAll('.bar')
				.data(this.collection.models) // { x: xAttr, y: yAttr }
			.enter().append('rect')
				.attr('class', 'bar')
				.attr('x', function(d) { return x(d.attributes.letter); })
				.attr('width', x.rangeBand())
				.attr('y', function(d) { return y(d.attributes.frequency); })
			.attr('height', function(d) { return chart.height - y(d.attributes.frequency); });

		}




	});


	return BarChart;

});
