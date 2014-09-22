
define([
	'backbone',
	'd3',
	'underscore',
	'moment'
], function(Backbone, d3, _, moment) {

	var BarChart  = Backbone.View.extend({

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
			this._renderData();
			this._drawSegmentBorders();
			this._addToolTip();

			return this;
		},

		_addToolTip: function() {
			var chart = this;
			chart.div = d3.select('#container').append('div')
				.attr('class', 'tooltip')
				.style('opacity', 0);
		},

		_drawSegmentBorders: function() {
			var margin = this.defaults.margin;
			var NUMBER_GROUPS = 7;
			var groupWidth = (this.width / NUMBER_GROUPS);
			for (
				var i = 1; i <= 7; i++) {
				this.svg.append('line')
					.attr('stroke', 'grey')
					.attr('stroke-width', '1')
					.attr('fill', 'red')
					.attr('x1', groupWidth * i)
					.attr('y1', margin.top)
					.attr('x2', groupWidth * i)
					.attr('y2', this.height)
					.attr('transform', 'translate(0,0)');
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
			var chart = this,
			segmentWidth = (this.width / 7),
			halfgroupwidth = (this.width / 14),
			y = this._getYScale();

			var resetToolTip = function() {
				chart.div
					.style('top', '20px')
					.style('left', '20px');
			};

			var showToolTip = function() {
				chart.div
					.transition().duration(200)
					.style('opacity', 1);
			};

			this.svg.selectAll('circle')
				.data(chart.collection.models)
				.enter()
				.append('circle')
				.attr('class', 'mention')
				.attr('cx', function(d) {
						/*jshint sub:true*/
					return halfgroupwidth +
						segmentWidth *
						(chart._getGroupType(d.attributes['group_type'] - 2 ) ) +
						chart._ranNum();
						/*jshint sub:false*/
				})
				.attr('cy', function(d) {
					var date = moment.unix(
						chart._getClusterTime(d.attributes)
					).toDate();
					return y(date);
				})
				.attr('r', function(model) {return 5 + model.attributes.count;})
				.on('mouseover', function(d) {
					d3.select(this).transition().duration(200)
						.style('opacity', 0.5)
						.style('stroke', 'orange');
					chart.div.transition().duration(0)
						.style('left', (d3.mouse(this)[0] + 55) + 'px')
						.style('top', (d3.mouse(this)[1] + 45)  + 'px')
						.each('end', showToolTip);

										/*jshint sub:true*/
					chart.div.html(
						'<span>' + chart._setMentionInfo(d.attributes) + '</span>');
										/*jshint sub:false*/
				})
				.on('mousemove', function() {
					chart.div
						.style('left', (d3.mouse(this)[0] + 55 ) + 'px')
						.style('top', (d3.mouse(this)[1] + 45)  + 'px');

				})
				.on('mouseout', function() {
					d3.select(this).transition().duration(200)
						.style('opacity', 1)
						.style('stroke', '#EFF5FB');
					chart.div.transition().duration(200)
						.style('opacity', 0)
						.each('end', resetToolTip);
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
			data.forEach(function(d) {
				index.push(that._getClusterTime(d.attributes));
			});
			index = [d3.max(index) + 3000, d3.min(index) - 1800];
			index = index.map(function(entry) {
				return moment.unix(entry).toDate();
			});
			return index;
		},

		_getGroupType: function(number) {
			if (number >= 6) {
				return 6;
			}
			else {
				return number;
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
		},

		_setMentionInfo: function(d) {
			var infoline = '';
			var mentions = '';
			if (d.count == 1) {
				infoline = '1 mention is here <br>';
			}
			else {
				infoline = d.count + ' mentions are here <br>';
			}
			for (
				var i = 0; i < d.items.length; i++ ) {

				if (d.items[i].title.length <= 50 ) {
					mentions += d.items[i].title + ' <br>';
				}
				else {
					mentions += d.items[i].title.substring(0, 50) +
					'... <br>';
				}
			}
			return infoline + mentions;
		}



	});

	return BarChart;

});
