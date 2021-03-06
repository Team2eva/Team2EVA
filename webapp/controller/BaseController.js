sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/odata/ODataMetadata",
	'sap/m/MessageToast',
	'sap/m/Button',
	'sap/ui/core/Popup'

], function(Controller, History, ODataMetadata, MessageToast, Button, Popup) {
	"use strict";

	return Controller.extend("eventManagementEVA.controller.BaseController", {
		onInit: function() {

		},

		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},

		onSwitchEditMode: function(oEvent) {
			var bState = oEvent.getSource().getState();
			if (bState) {
				sap.ui.getCore().getConfiguration().setLanguage("de");
			} else {
				sap.ui.getCore().getConfiguration().setLanguage("en");
			}
		},

		onMenuAction: function(oEvent) {

			var oItem = oEvent.getParameter("item"),
				sItemPath = "";
			while (oItem instanceof sap.m.MenuItem) {
				sItemPath = oItem.getText();
				oItem = oItem.getParent();
			}
			if (sItemPath === "Change Password" || sItemPath === "Passwort ändern") {
				this.changePass();
			} else if (sItemPath === "Delete Event") {
				var viewID = this.getView().getId();
				// console.log("The view ID in controller Delete Event is : " + viewID);
				var view = sap.ui.getCore().byId(viewID);

				// var deleteEventButton = view.byId("deleteEventBtn");
				// deleteEventButton.setVisible(true);
				view.getController().enableDeleteBtns();
			} else if (sItemPath === "Cancel Delete") {
				viewID = this.getView().getId();
				view = sap.ui.getCore().byId(viewID);
				view.getController().disableDeleteBtns();
			} else if (sItemPath === "Logout") {
				var thisViewID = this.getView().getId();
				var oView = sap.ui.getCore().byId(thisViewID);
				var oModel = oView.getModel();
				oModel.refresh(true);
				this.getOwnerComponent().getRouter().navTo("Login");
			}
		},

		onLogOut: function() {
			var viewID = this.getView().getId();
			var oView = sap.ui.getCore().byId(viewID);
			var oModel = oView.getModel();
			oModel.refresh(true);
			this.getOwnerComponent().getRouter().navTo("Login");
		},

		changePass: function() {
			var viewID = this.getView().getId();
			var oView = sap.ui.getCore().byId(viewID);
			var oDialog = new sap.m.Dialog("Dialog1", {
				title: oView.getModel("i18n").getResourceBundle().getText("DialogTitle"),
				type: "Message",
				modal: true,
				contentWidth: "5rem",
				content: [new sap.m.Label({
						text: oView.getModel("i18n").getResourceBundle().getText("DialogUserName")
					}),
					new sap.m.Input({
						maxLength: 20,
						id: "userName"
					}),
					new sap.m.Label({
						text: oView.getModel("i18n").getResourceBundle().getText("DialogPassword")
					}),
					new sap.m.Input({
						maxLength: 20,
						type: "Password",
						id: "oldPass"
					}),
					new sap.m.Label({
						text: oView.getModel("i18n").getResourceBundle().getText("DialogNewPassword")
					}),
					new sap.m.Input({
						maxLength: 20,
						type: "Password",
						id: "newPass"
					}),
					new sap.m.Label({
						text: oView.getModel("i18n").getResourceBundle().getText("DialogConfirmPassword")
					}),
					new sap.m.Input({
						maxLength: 20,
						type: 'Password',
						id: "newPassConfirm",
						liveChange: function(oEvent) {
							var parent = oEvent.getSource().getParent();
							parent.getBeginButton().setEnabled(true);
						}
					})
				],

				beginButton: new Button({

					text: "Submit changes",
					enabled: false,
					press: function(oEvent) {
						console.log("Merge1!");
						this.viewID = this.getView().getId();
						this.view = sap.ui.getCore().byId(this.viewID);
						var userName = sap.ui.getCore().byId("userName").getValue();
						var oldPass = sap.ui.getCore().byId("oldPass").getValue();
						var newPass = sap.ui.getCore().byId("newPass").getValue();
						var newPassConfirm = sap.ui.getCore().byId("newPassConfirm").getValue();
						var oModel = this.view.getModel();
						var oData = {
							IdUser: userName,
							Password: newPass
						};
						oModel.read("/UserSet(IdUser='" + userName + "')", {
							success: function(oCompleteEntry) {
								if (oCompleteEntry.Password === oldPass) {
									if (newPass === newPassConfirm) {
										console.log("Merge2!");
										oModel.update("/UserSet(IdUser='" + userName + "')", oData, {
											success: function(oCompletedEntry) {
												oDialog.close();
												MessageToast.show("Password change successful for user " + userName + "!", {
													animationDuration: 6000
												});
												console.log("SUCCESS?");
											},
											error: function(oError) {
												MessageToast.show("Changes could not be made! Please try again.", {
													animationDuration: 6000
												});
												console.log("ERROR?");
											}
										});
									}
								} else {
									MessageToast.show("Invalid username or password! Please try again.", {
										animationDuration: 6000
									});
								}
							}.bind(this),
							error: function(oError) {
								MessageToast.show("Invalid username or password! Please try again.", {
									animationDuration: 6000
								});
								console.log("ERROR?");
							}
						});
					}.bind(this)
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function() {
						oDialog.close();
					}
				}),
				afterClose: function() {
					oDialog.destroy();
				}
			});
			sap.ui.getCore().byId('Dialog1').open();
		},

		onNavBack: function() {
			var oHistory = sap.ui.core.routing.History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.back();

			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("default", true);
			}
		}

	});
});