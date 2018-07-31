sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/odata/ODataMetadata",
	'sap/m/MessageToast'

], function(Controller, History, ODataMetadata, MessageToast) {
	"use strict";

	return Controller.extend("eventManagementEVA.controller.BaseController", {
		onInit: function() {
			var oView = this.getView();
			var oModel = oView.getModel();
			//this.getModel().getServiceMetadata();
			//this.getModel().metadataLoaded();
		},
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);

			} else {
				this.getRouter().navTo("dashBoard", {}, true);
			}

		},
		
		
		
	});
});