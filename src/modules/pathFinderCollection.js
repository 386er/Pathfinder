
define(['jquery',
	'backbone',
	'moment'
	//'underscore'
], function($,
	Backbone,
	moment
	//_
	) {

	var PathFinderCollection  = Backbone.Collection.extend({


		renderData: function() {
			this._prepareCoordinates();
			this._createIdRegister();
			this._defineConnections();
		},

		_ranNum: function() {
			return Math.floor(Math.random() * 60 ) - 30;
		},

		_prepareCoordinates: function() {
			var that = this,
			width = 730,
			segmentWidth = (width / 7),
			halfSegmentWidth = (width / 14);
			that.each(
				function(model) {
					/*jshint sub:true*/
					var segmentType = that._getSegmentType(
						model.attributes['group_type']);
					model.attributes.x =
						halfSegmentWidth + segmentWidth *
						segmentType + that._ranNum();
					var clusterTimeStamp = that._getClusterTime(model.attributes);
					var clusterDate = moment.unix(clusterTimeStamp).toDate();
					model.attributes.y = clusterDate;
					var count = model.attributes.count;
					model.attributes.r = 5 + count;

				}	/*jshint sub:false*/
			);
		},

		_createIdRegister: function() {
			var that = this;
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
				}
			);						/*jshint sub:false*/

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
									var inX = that.idRegister[inID].x,
									inY = that.idRegister[inID].y;
									model.attributes.connections.push([inX, inY]);
								}
							}
						);
					} /*jshint sub:false*/
				}
			);
		},

		_getClusterTime : function(element) {
			var format = 'YYYY-MM-DD HH:mm:ss.SSS';
			var meantime = this.meanValue([
			/*jshint sub:true*/
						moment(element['t_min'], format ).unix(),
						moment(element['t_max'], format ).unix()
			/*jshint sub:false*/
					]);
			return meantime;
		},

		_getDateDomain : function() {
			var index = [];
			var data = this.models;
			var that = this;
			data.forEach(function(model) {
				index.push(that._getClusterTime(model.attributes));
			});
			index = [ Math.max.apply(Math, index) + 3000,
			Math.min.apply(Math, index) - 1800];
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

		meanValue: function(array) {
			var n = array.length, i = 0, value = 0;
			for (i; i < n; i++) {
				value += array[i];
			}
			return value / n;


		}

	});

	return PathFinderCollection;


});
