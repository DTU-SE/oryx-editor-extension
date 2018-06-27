if(!ORYX) { var ORYX = {} }
if(!ORYX.Gazelle) { ORYX.Gazelle = {} }
if(!ORYX.Gazelle.Controllers) { ORYX.Gazelle.Controllers = {} }

ORYX.Gazelle.Controllers.ServiceController = Clazz.extend({
	construct: function(props) {
		arguments.callee.$.construct.apply(this, arguments);

		this.model = new ORYX.Gazelle.Models.Service();
		this.view = new ORYX.Gazelle.Views.Service();
	},

	initialize: function(options) {
		this.model.load({url: options.url})
		.then(function(response) {
			this.view.load(this.model.get());
			options.onSuccess();
		}.bind(this))
		['catch'](function(error) {
			// TODO
			console.log(error);
		});
	},

	getLinks: function() {
		return this.model.getLinks();
	},

	getView: function() {
		return this.view;
	},

	addComponentToView: function(component) {
		this.view.addComponent(component);
	}
});
