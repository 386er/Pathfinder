///* global console */

define([
	'jquery',
	'backbone',
	'd3',
	'underscore',
	'moment',
	'modules/toolTipView'
], function($, Backbone, d3, _, moment, ToolTipView) {

	var PathFinderView  = Backbone.View.extend({

		defaults: {
			margin: {top: 20, right: 30, bottom: 30, left:140}
		},

		render: function() {
			var margin = this.defaults.margin;
			this.width = this.el.clientWidth - margin.left - margin.right;
			this.height = this.el.clientHeight - margin.top - margin.bottom;

			this.svg = d3.select(this.el).append('svg')
				.attr('width', this.width + margin.left + margin.right)
				.attr('height', this.height + margin.top + margin.bottom)
				.attr('id', 'svg')
				.append('g')
				.attr('transform', 'translate(' +
					margin.left + ',' + margin.top + ')');

			this._renderAxes();
			this._prerenderData();
			this._renderData();
			this._drawSegmentBorders();
			this._addToolTip();

			return this;
		},

		_addToolTip: function() {
			var chart = this;
			chart.toolTip = new ToolTipView({
				model: new Backbone.Model.extend()
			});
			$(chart.el).append(this.toolTip.el);
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

		_prerenderData: function() {
			var chart = this,
			yScale = this._getYScale(),
			segmentWidth = (this.width / 7),
			halfSegmentWidth = (this.width / 14);
			chart.idRegister = {};


			chart.collection.each(
				function(model) {
					/*jshint sub:true*/
					var segmentType = chart._getSegmentType(
						model.attributes['group_type']);

					model.attributes.x =
						halfSegmentWidth + segmentWidth *
						segmentType + chart._ranNum();

					var clusterTimeStamp = chart._getClusterTime(model.attributes);
					var clusterDate = moment.unix(clusterTimeStamp).toDate();

					model.attributes.y = yScale(clusterDate);

					var count = model.attributes.count;
					model.attributes.r = 5 + count;

					chart.idRegister[
						model.attributes['cluster_id']] = {};
					chart.idRegister[
						model.attributes['cluster_id']].x = model.attributes.x;
					chart.idRegister[
						model.attributes['cluster_id']].y = model.attributes.y;

				}	/*jshint sub:false*/
			);
		},

		_renderData: function() {
			var chart = this;

			chart.collection.models.forEach(
					/*jshint sub:true*/
				function(model) {
					var outlinks = model.attributes['out_links'];
					if (outlinks.length) {
						outlinks.forEach(
							function(item) {
								var inID = item['in_cluster_id'];
					/*jshint sub:false*/
								if (chart.idRegister[inID]) {

									var outX = model.attributes.x,
									outY = model.attributes.y,
									inX = chart.idRegister[inID].x,
									inY = chart.idRegister[inID].y;

									chart.svg.append('line')
										.attr('class', 'connectionline')
										.attr('x1', outX)
										.attr('y1', outY)
										.attr('x2', inX)
										.attr('y2', inY);
								}
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
					return model.attributes.y;
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
						(d3.mouse(this)[0] - 20 ),
						(d3.mouse(this)[1] + 45));
					chart.toolTip.show();

					chart.svg.append('line')
						.attr( 'class', 'markerline')
						.attr('x1', this.cx.baseVal.value)
						.attr('y1', chart.defaults.margin.top)
						.attr('x2', this.cx.baseVal.value)
						.attr('y2', this.cy.baseVal.value - this.r.baseVal.value);

					chart.svg.append('line')
						.attr( 'class', 'markerline')
						.attr('x1', this.cx.baseVal.value)
						.attr('y1', this.cy.baseVal.value + this.r.baseVal.value)
						.attr('x2', this.cx.baseVal.value)
						.attr('y2', chart.height);

				})
				.on('mousemove', function() {
					chart.toolTip.move(
						(d3.mouse(this)[0] - 20 ),
						(d3.mouse(this)[1] + 45));
				})
				.on('mouseout', function() {
					d3.select(this)
						.style('stroke-width', 1);

					chart.toolTip.hide();

					chart.svg.selectAll('line.markerline').remove();

				});

		},

		_getClusterTime : function(element) {
			var format = 'YYYY-MM-DD HH:mm:ss.SSS';
			var meantime = d3.mean([
			/*jshint sub:true*/
						moment(element['t_min'], format ).unix(),
						moment(element['t_max'], format ).unix()
			/*jshint sub:false*/
					]);
			return meantime;
		},

		_getDateDomain : function() {
			var index = [];
			var data = this.collection.models;
			var that = this;
			data.forEach(function(model) {
				index.push(that._getClusterTime(model.attributes));
			});
			index = [d3.max(index) + 3000, d3.min(index) - 1800];
			index = index.map(function(entry) {
				return moment.unix(entry).toDate();
			});
			return index;
		},

		_getSegmentType: function(number) {
			if (number > 6) {
				return 6;
			}
			else {
				return number - 2;
			}
		},

		_getYScale: function() {
			return d3.time.scale()
				.range([0, this.height])
				.domain(this._getDateDomain());
		},

		_getXScale: function() {
			return d3.scale.linear()
				.range([0, this.width])
				.domain([1, 8]);
		}

	});

	return PathFinderView;

});
