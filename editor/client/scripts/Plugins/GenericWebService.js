/**
* Copyright (c) 2018 Jesper B. Hansen
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

if (!ORYX.Plugins) {
	ORYX.Plugins = new Object();
}

/**
* Generic Web Service plugin
*
* @class
* @extends ORYX.Plugins.AbstractPlugin
*/
ORYX.Plugins.GenericWebService = ORYX.Plugins.AbstractPlugin.extend({
	construct: function() {
		// Call super class constructor
		arguments.callee.$.construct.apply(this, arguments);

		this.facade.offer({
			'name': 'Generic Web Service', // ORYX.I18N.GenericWebService.name
			'functionality': this.react.bind(this),
			'group': 'analysis', // ORYX.I18N.GenericWebService.group
			'icon': ORYX.PATH + "images/icon-ws.png",
			'description': 'Generic Web Service plugin', // ORYX.I18N.GenericWebService.desc
			'index': 0,
			'toggle': true,
			'minShape': 0,
			'maxShape': 0
		});

		var window;
		this.window = window;
	},

	react: function(button, pressed) {
		if (pressed) {
			this.setActivated(button, false);

			if(!this.window) {
				this.window =  new Ext.Window({
					width: 500,
					height: 300,
					closeAction: 'hide',
					plain: true,
					autoScroll: true,
					buttons: [{
						text: 'Close',
						handler: function() {
							this.window.hide();
						}.bind(this)
					}]
				});
				this.window.show(
					this,
					function() {
						this.getOperations({
							onSuccess: function(response) {
								var operations = response.map(function(operation) {
									return {
										text: operation.title,
										handler: function() {
											this.request({
												request: operation.request,
												onSuccess: function(response) {
													console.log(response);
												}.bind(this),
												onFailure: function(response) {
													console.log(response);
												}.bind(this)
											});
										}.bind(this)
									};
								}.bind(this));
								this.window.add({tbar: operations});
								this.window.doLayout();
							}.bind(this),
							onFailure: function(response) {
								console.log(response);
							}
						});
					}.bind(this)
				);
			} else {
				this.window.show();
			}
		}
	},

	setActivated: function(button, activated) {
		button.toggle(activated);
		if (activated === undefined) {
			this.active = !this.active;
		} else {
			this.active = activated;
		}
	},

	getOperations: function(options) {
		Ext.applyIf(options || {}, {
			showErrors: true,
			onSuccess: Ext.emptyFn,
			onFailure: Ext.emptyFn
		});

		Ext.Ajax.request({
			url: 'http://localhost:1234/operations.json',
			method: 'GET',
			success: function(request) {
				var res = Ext.decode(request.responseText);
				options.onSuccess(res);
			}.bind(this),
			failure: function(request) {
				options.onFailure(request);
			}.bind(this)
		});
	},

	retrieveDoc: function(options) {
		Ext.applyIf(options || {}, {
			showErrors: true,
			onSuccess: Ext.emptyFn,
			onFailure: Ext.emptyFn
		});

		var serialized_rdf = this.getRDFFromDOM();
		if (!serialized_rdf.startsWith("<?xml")) {
			serialized_rdf = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
			+ serialized_rdf;
		}

		var resource = location.href;
		var tool = 'lola';

		Ext.Ajax.request({
			url: ORYX.CONFIG.SIMPLE_PNML_EXPORT_URL,
			method: 'POST',
			success: function(request) {
				console.log('success');
				console.log(request);
				options.onSuccess(request);
			}.bind(this),
			failure: function(request) {
				console.log('failure');
				console.log(request);
				options.onFailure(request);
			}.bind(this),
			params: {
				resource: resource,
				data: serialized_rdf,
				tool: tool
			}
		});
	},

	request: function(options) {
		Ext.applyIf(options || {}, {
			showErrors: true,
			onSuccess: Ext.emptyFn,
			onFailure: Ext.emptyFn
		});

		var request = options.request
		var parameters = {};
		request.parameters.forEach(function(parameter) {
			parameters[parameter.key] = parameter.value;
		})

		this.retrieveDoc({
			onSuccess: function(response) {
				parameters['input'] = response.responseText;

				Ext.Ajax.request({
					url: request.url,
					method: request.method,
					success: function(request) {
						var item = {
							title: Date.now(),
							html: request.responseText
						};
						this.window.insert(1, item);
						this.window.doLayout();
						options.onSuccess(request.responseText);
					}.bind(this),
					failure: function(request) {
						console.log(this.window);
						options.onFailure(request);
					}.bind(this),
					params: parameters
				});
			}.bind(this),
			onFailure: function(response) {
				console.log(response);
			}.bind(this)
		})
	}
});
