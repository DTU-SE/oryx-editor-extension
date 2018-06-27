if(!ORYX) { var ORYX = {} }
if(!ORYX.Gazelle) { ORYX.Gazelle = {} }
if(!ORYX.Gazelle.Views) { ORYX.Gazelle.Views = {} }

ORYX.Gazelle.Views.Operation = Clazz.extend({
	construct: function(options) {
		arguments.callee.$.construct.apply(this, arguments);

		this.container = undefined;
	},

	load: function(options) {
		this.container = this.CreateFormPanel({
			onSubmit: options.onSubmit,
			operation: options.model
		});
	},

	CreateFormPanel: function(options) {
		var request = options.operation.request;
		var items = request.parameters.map(function(parameter) {
			var item = {
				name: parameter.key,
				fieldLabel: parameter.label.text
			};
			if (parameter.type === "INTEGER") {
				return new Ext.form.NumberField(item)
			} else if (parameter.type === "STRING") {
				return new Ext.form.TextField(item);
			} else if (parameter.type === "MODEL") {
				return new Ext.form.Hidden(item);
			} else {
				return new Ext.form.TextField(item);
			}
		});

		var formPanel = new Ext.FormPanel({
			url: request.url,
			method: request.method,
			title: options.operation.label.text,
			submit: function(form) { options.onSubmit(form) }.bind(this),
			labelWidth: 150,
			collapsible: true,
			collapsed: false,
			autoWidth: true,
			// defaultType: 'textfield',
			items: items,
			buttons: [
				{
					text: 'Submit',
					type: 'submit',
					handler: function(formPanel) {
						var form = formPanel.ownerCt.getForm();
						form.submit(form);
					}
				},
				{
					text: 'Reset',
					type: 'reset',
					handler: function(formPanel) {
						var form = formPanel.ownerCt.getForm();
						form.reset();
					}
				}
			]
		});
		return formPanel;
	}
});
