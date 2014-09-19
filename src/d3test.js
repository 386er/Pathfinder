/* global d3 */
/*global moment*/

var canvas = d3.select('#container')
	.append('svg')
	.attr('class', 'svg');

var div = d3.select('#container').append('div')
	.attr('class', 'tooltip');




d3.json('data.json', function(data) {

	data = data.data.cluster;

	var clusterMeanTime = function(element) {
		var format = 'YYYY-MM-DD HH:mm:ss.SSS';
		var meantime = d3.mean([
			/*jshint sub:true*/
						moment(element['t_min'], format ).unix(),
						moment(element['t_max'], format ).unix()
			/*jshint sub:false*/
					]);
		return meantime;
	};


	var getDateDomain = function() {
		var index = [];
		data.forEach(function(d) {
			index.push(clusterMeanTime(d));
		});
		index = [d3.max(index) + 3000, d3.min(index)];
		index = index.map(function(entry) {
			return moment.unix(entry).toDate();
		});

		return index;
	};


	var getGroupType = function(number) {
		if (number >= 8) {
			return 8;
		}
		else {
			return number;
		}
	};

	var ranNum = function() {
		return Math.floor(Math.random() * 60 ) - 30;
	};


	var height = 500;
	var width = 800;

	var yScale = d3.time.scale()
			.domain(getDateDomain())
			.range([0, height]);

	var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient('left')
			.tickFormat(d3.time.format('%b %d %Y, %H:%M'));

	var xScale = d3.scale.linear()
			.domain([1, 8])
			.range([0, width - 100]);

	var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('top');

	canvas.append('g')
		.attr('class', 'yAxis')
		.attr('transform', 'translate(150,50)')
		.call(yAxis);

	canvas.append('g')
		.attr('class', 'xAxis')
		.attr('transform', 'translate(150,50)')
		.call(xAxis);

	for (
		var i = 1; i <= 7; i++) {
		canvas.append('line')
			.attr('stroke', 'grey')
			.attr('stroke-width', '1')
			.attr('fill', 'red')
			.attr('x1', 100 * i)
			.attr('y1', 50)
			.attr('x2', 100 * i)
			.attr('y2', 550)
			.attr('transform', 'translate(150,0)');
	}


	var mentions = canvas.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.attr('class', 'mention')
		.attr('cx', function(d) {
						/*jshint sub:true*/
			return 100 * getGroupType(d['group_type']) + ranNum();
						/*jshint sub:false*/
		})
		.attr('cy', function(d) {
			return yScale(
				moment.unix(
					clusterMeanTime(d)
				).toDate()
			);
		})
		.attr('r', function(d) {return 5 + d.count;} );



	mentions.on('mouseover', function(d) {
		d3.select(this).transition().duration(200)
		.style('opacity', 0.5)
		.style('stroke', 'orange');
		div.transition().duration(100).style('opacity', 1);
						/*jshint sub:true*/
		div.html('<span>' + d['cluster_id']  + '</span>');
						/*jshint sub:false*/
	})

	.on('mouseout', function() {
		d3.select(this).transition().duration(200)
		.style('opacity', 1)
		.style('stroke', '#EFF5FB');
		div.transition().duration(200).style('opacity', 0);
	});

});

