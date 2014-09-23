
define(['jquery',
	'backbone',
	'mustache',
	'text!modules/toolTip.html',
	'underscore'
], function($,
	Backbone,
	Mustache,
	toolTipHTML,
	_
	) {

	var ToolTipView  = Backbone.View.extend({

		id: 'tooltip',

		render: function() {
			var attributes = this.model.toJSON();
			if (attributes.count == 1 ) {
				attributes.multiple = false;
			}
			else {
				attributes.multiple = true;
			}
			attributes = this.setMentionInfo(attributes);
			this.$el.html(Mustache.render(toolTipHTML,
				attributes));
		},

		move: function(left, top) {
			this.$el.css({
				'left': left + 'px' ,
				'top': top + 'px'
			});
		},

		show: function() {
			this.$el.show();
		},

		hide: function() {
			this.$el.css({
				'left': '20px',
				'top': '20px'
			});
			this.$el.html('');
			this.$el.hide();
		},

		setMentionInfo: function(attributes) {
			_.each(attributes.items, function(item) {
				if (item.title.length > 50) {
					item.title = item.title.substring(0, 50) + '...';
				}
			});
			if (attributes.items.length > 10) {
				attributes.items = attributes.items.slice(0, 10);
			}
			return attributes;
		}


	});


	return ToolTipView;

});
