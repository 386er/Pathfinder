/* global console */

define([
	'jquery',
	'backbone',
	'd3',
	'underscore',
	'modules/toolTipView'
], function($, Backbone, d3, _, ToolTipView) {

	var PathFinderView  = Backbone.View.extend({

		defaults: {
			margin: {top: 20, right: 30, bottom: 30, left:140}
		},

		initialize: function() {
			this.collection.on('reset', this.render, this);
		},

		render: function() {

			var timestamp = Date.now();

			this._clearChart();
			this._setWidthHeight();
			this._createSVG();
			this._renderAxes();
			this.collection.prepareData();
			this._renderData();
			this._drawSegmentBorders();
			this._addToolTip();

			var duration = (Date.now() - timestamp) / 1000;
			console.log('Render took ' +
				duration + ' seconds');

			this.duration = duration;

			return this;
		},

		_addToolTip: function() {
			var chart = this;
			chart.toolTip = new ToolTipView({
				model: new Backbone.Model.extend()
			});
			$(chart.el).append(this.toolTip.el);
		},

		_clearChart: function() {
			d3.select('svg').selectAll('*').remove();
			this.$el.html('');

		},

		_createSVG: function() {
			var margin = this.defaults.margin;
			this.svg = d3.select(this.el).append('svg')
				.attr('width', this.width + margin.left + margin.right)
				.attr('height', this.height + margin.top + margin.bottom)
				.attr('id', 'svg')
				.append('g')
				.attr('transform', 'translate(' +
					margin.left + ',' + margin.top + ')');
		},

		_drawSegmentBorders: function() {
			var margin = this.defaults.margin;
			var NUMBER_SEGMENTS = 7;
			var segmentWidth = (this.width / NUMBER_SEGMENTS);
			for (
				var i = 1; i <= NUMBER_SEGMENTS; i++) {
				this.svg.append('line')
					.attr('class', 'segmentline')
					.attr('x1', segmentWidth * i)
					.attr('y1', margin.top)
					.attr('x2', segmentWidth * i)
					.attr('y2', this.height);
			}
		},

		_ranNum: function() {
			return Math.floor(Math.random() * 60 ) - 30;
		},

		_renderAxes: function() {

			var yAxis = d3.svg.axis()
				.scale(this._getYScale())
				.orient('left')
				.tickFormat(d3.time.format('%b %d %Y, %H:%M'));

			var xAxis = d3.svg.axis()
				.scale(this._getXScale())
				.orient('bottom');

			this.svg.append('g')
				.attr('class', 'xAxis')
				.attr('transform', 'translate(0,' + this.height + ')')
				.call(xAxis);

			this.svg.append('g')
				.attr('class', 'yAxis')
				.call(yAxis);
		},

		_renderData: function() {
			var chart = this, yScale = this._getYScale();

			chart.collection.models.forEach(
					/*jshint sub:true*/
				function(model) {
					var connections = model.attributes.connections;
					if (connections) {
						connections.forEach(
							function(connection) {
								chart.svg.append('line')
									.attr('class', 'connectionline')
									.attr('x1', model.attributes.x)
									.attr('y1', yScale(model.attributes.y))
									.attr('x2', connection.x)
									.attr('y2', yScale(connection.y));
							}
						);
					}
				}
			);

			chart.svg.selectAll('circle')
				.data(chart.collection.models)
				.enter()
				.append('circle')
				.attr('class', 'mention')
				.attr('id', function(model) {
					/*jshint sub:true*/
					return model.attributes['cluster_id'];
					/*jshint sub:false*/
				})
				.attr('cx', function(model) {
					return model.attributes.x;
				})
				.attr('cy', function(model) {
					return yScale(model.attributes.y);
				})
				.attr('r', function(model) {
					return model.attributes.r;
				})
				.on('mouseover', function(model) {

					d3.select(this)
						.style('stroke-width', 3);

					chart.toolTip.model = model;
					chart.toolTip.render();
					chart.toolTip.move(
						(d3.mouse(this)[0] - 10 ),
						(d3.mouse(this)[1] + 45));
					chart.toolTip.show();

				})
				.on('mousemove', function() {
					chart.toolTip.move(
						(d3.mouse(this)[0] - 10 ),
						(d3.mouse(this)[1] + 45));
				})
				.on('mouseout', function() {
					d3.select(this)
						.style('stroke-width', 1);

					chart.toolTip.hide();

				});

		},

		_getYScale: function() {
			return d3.time.scale()
				.range([0, this.height])
				.domain(this.collection._getDateDomain());
		},

		_getXScale: function() {
			return d3.scale.linear()
				.range([0, this.width])
				.domain([1, 8]);
		},

		_setWidthHeight: function() {
			var margin = this.defaults.margin;
			this.width = this.el.clientWidth - margin.left - margin.right;
			this.height = this.el.clientHeight - margin.top - margin.bottom;
		}

	});

	return PathFinderView;

});
