/* global console */


define(['jquery',
	'backbone',
	'underscore',
	'modules/pathFinderView',
	'modules/pathFinderCollection',
	'd3',
	'modules/daimlerdata',
	'modules/siemensdata',
	'modules/siemens2data',
	'modules/otwodata',
	'modules/vodafonedata',
	'modules/daimlerdata2',
	'modules/bvbdata',
	'modules/crowddata',
	'modules/crowddata2',
	'modules/yildizdata',
	'modules/tvdata',
	'modules/merkeldata',
	'modules/fcbdata',
	'modules/daimlerdata3',
	'modules/tvdata2',
	'modules/vodafonedata2',
	'modules/otwodata2'


], function($,
	Backbone,
	_,
	PathFinderView,
	PathFinderCollection,
	d3,
	jsondaimler,
	jsonsiemens,
	jsonsiemens2,
	jsonotwo,
	jsonvodafone,
	jsondaimler2,
	jsonbvb,
	jsoncrowd,
	jsoncrowd2,
	jsonyildiz,
	jsontv,
	jsonmerkel,
	jsonfcb,
	jsondaimler3,
	jsontv2,
	jsonvodafone2,
	jsonotwo2
	) {

	var pageloader = {

		init : function() {

			var chart = new PathFinderView({
				el: '#container',
				collection: new PathFinderCollection(jsondaimler.data.cluster)
			});
			chart.render();
/*
			var newdata = _.union(chart.collection.models, jsonsiemens.data.cluster, jsonsiemens2.data.cluster);
			chart.collection.reset(newdata);
			newdata = _.union(chart.collection.models, jsonotwo.data.cluster, jsonvodafone.data.cluster);
			chart.collection.reset(newdata);
			newdata = _.union(chart.collection.models, jsondaimler2.data.cluster);
			chart.collection.reset(newdata);
			newdata = _.union(chart.collection.models, jsonbvb.data.cluster, jsoncrowd.data.cluster);
			chart.collection.reset(newdata);
			newdata = _.union(chart.collection.models, jsoncrowd2.data.cluster, jsonyildiz.data.cluster);
			chart.collection.reset(newdata);
			newdata = _.union(chart.collection.models, jsontv.data.cluster, jsonmerkel.data.cluster);
			chart.collection.reset(newdata);
			newdata = _.union(chart.collection.models, jsonfcb.data.cluster, jsondaimler3.data.cluster);
			chart.collection.reset(newdata);
			newdata = _.union(chart.collection.models, jsontv2.data.cluster);
			chart.collection.reset(newdata);
*/

			var newdata = _.union(chart.collection.models,
						jsonsiemens.data.cluster,
						jsonsiemens2.data.cluster,
						jsonotwo.data.cluster,
						jsonvodafone.data.cluster,
						jsondaimler2.data.cluster,
						jsonbvb.data.cluster,
						jsoncrowd.data.cluster,
						jsoncrowd2.data.cluster,
						jsonyildiz.data.cluster,
						jsontv.data.cluster,
						jsonmerkel.data.cluster,
						jsonfcb.data.cluster,
						jsondaimler3.data.cluster,
						jsontv2.data.cluster,
						jsonvodafone2.data.cluster,
						jsonotwo2.data.cluster);

			chart.collection.reset(newdata);

			console.log('Total cluster: ' + chart.collection.models.length);

		}
	};

	return pageloader;

});
