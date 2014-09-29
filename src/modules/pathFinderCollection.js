/* global console */

define(['jquery',
	'backbone',
	'moment',
	'underscore'
], function($,
	Backbone,
	moment,
	_
	) {

	var PathFinderCollection  = Backbone.Collection.extend({


		prepareData: function() {
			this._prepareCoordinates();
			this._createIdRegister();
			this._defineConnections();
		},

		_ranNum: function(width) {
			return Math.floor(Math.random() * 2 * width ) - width;
		},

		_prepareCoordinates: function() {
			var that = this, width = 730,
			segWidth = (width / 7), halfsegWidth = (width / 14);
			that.each(
				function(model) {
					/*jshint sub:true*/
					var segmentType = that._getSegmentType(
						model.attributes['group_type']);
					model.attributes.x =
						halfsegWidth + segWidth *
						segmentType + that._ranNum(30);
					var clusterTimeStamp = that._getClusterTime(model.attributes);
					var clusterDate = moment.unix(clusterTimeStamp).toDate();
					model.attributes.y = clusterDate;
					var count = model.attributes.count;
					model.attributes.r = 3 + count;

				}	/*jshint sub:false*/
			);
		},

		_createIdRegister: function() {
			var that = this;
			var count = 0;
			that.idRegister = {};
			that._prepareCoordinates();
			that.each(
				function(model) {
					that.idRegister[ /*jshint sub:true*/
						model.attributes['cluster_id']] = {};
					that.idRegister[
						model.attributes['cluster_id']].x = model.attributes.x;
					that.idRegister[
						model.attributes['cluster_id']].y = model.attributes.y;
					count += model.attributes.count;
				}
			);
			console.log(count);					/*jshint sub:false*/
		},

		_defineConnections: function() {
			var that = this;
			that.each( /*jshint sub:true*/
				function(model) {
					var outlinks = model.attributes['out_links'];
					if (outlinks.length) {
						model.attributes.connections = [];
						outlinks.forEach(
							function(item) {
								var inID = item['in_cluster_id'];
								if (that.idRegister[inID]) {
									var connection = {};
									connection.x = that.idRegister[inID].x;
									connection.y = that.idRegister[inID].y;
									connection.id = inID;
									model.attributes.connections.push(connection);
								}
							}
						);
					} /*jshint sub:false*/
					model.attributes.connections = _.uniq(
						model.attributes.connections, function(item) {
							return item.id;
						});
				}
			);
		},

		_getClusterTime : function(element) {
			var format = 'YYYY-MM-DD HH:mm:ss.SSS';
			var meantime = this._meanValue([
			/*jshint sub:true*/
						moment(element['t_min'], format ).unix(),
						moment(element['t_max'], format ).unix()
			/*jshint sub:false*/
					]);
			return meantime;
		},

		_getDateDomain : function() {
			var index = [], data = this.models, that = this;
			data.forEach(function(model) {
				index.push(that._getClusterTime(model.attributes));
			});
			index = [ Math.max.apply(Math, index) + 3000,
			Math.min.apply(Math, index) - 3000];
			index = index.map(function(entry) {
				return moment.unix(entry).toDate();
			});
			return index;
		},

		_getSegmentType: function(number) {
			if (number > 6) {
				return 6;
			}
			if (number < 2 ) {
				return 2;
			}
			else { return number - 2;
			}
		},

		_meanValue: function(array) {
			var n = array.length, i = 0, value = 0;
			for (i; i < n; i++) {
				value += array[i];
			}
			return value / n;


		}

	});

	return PathFinderCollection;


});
