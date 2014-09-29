/*global buster*/
define([
	'modules/pathFinderView',
	'modules/pathFinderCollection',
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
	'modules/vodafonedata2'
], function(PathFinderView,
			PathFinderCollection,
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
				jsonvodafone2) {

	var daimler = jsondaimler.data.cluster,
	siemens = jsonsiemens.data.cluster,
	siemens2 = jsonsiemens2.data.cluster,
	otwo = jsonotwo.data.cluster,
	vodafone = jsonvodafone.data.cluster,
	daimler2 = jsondaimler2.data.cluster,
	bvb = jsonbvb.data.cluster,
	crowd = jsoncrowd.data.cluster,
	crowd2 = jsoncrowd2.data.cluster,
	yildiz = jsonyildiz.data.cluster,
	tv = jsontv.data.cluster,
	merkel = jsonmerkel.data.cluster,
	fcb = jsonfcb.data.cluster,
	daimler3 = jsondaimler3.data.cluster,
	tv2 = jsontv2.data.cluster,
	vodafone2 = jsonvodafone2.data.cluster;

	var clusterdata = _.union(daimler, siemens, siemens2,
			otwo, vodafone, daimler2, bvb, crowd, crowd2,
			yildiz, tv, merkel, fcb, daimler3, tv2, vodafone2 );

	var assert = buster.assert;

	buster.testCase('A PathFinderView test case', {
		'setUp': function() {
			var collection = new PathFinderCollection(clusterdata.slice(0, 1000));
			this.item = new PathFinderView({ collection: collection });

		},

		'for general setup': function() {
			assert.isFunction(this.item.render);
		},


		'for render function': function() {
			var spy = this.spy(this.item, '_renderAxes');
			this.item.render();
			assert.called(spy);
		},

		'for first render duration': function() {
			this.item.render();
			assert.less(this.item.duration, 0.4);
		},
		'for second render duration': function() {
			this.item.collection.reset(clusterdata.slice(1001, 2000));
			assert.less(this.item.duration, 0.45);
		},
		'for third render duration': function() {
			this.item.collection.reset(clusterdata.slice(2001, 3000));
			assert.less(this.item.duration, 0.45);
		}


	});
});
