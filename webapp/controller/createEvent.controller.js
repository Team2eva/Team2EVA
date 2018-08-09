sap.ui.define([
			"eventManagementEVA/controller/BaseController",
			'sap/m/Input',
			'sap/m/Button',
			'sap/m/MessageToast'
		], function(BaseController, MessageToast, Button) {
			"use strict";

			var eID = null;
			var QAstructList = [];

			return BaseController.extend("eventManagementEVA.controller.createEvent", {

					onInit: function() {
						this.getRouter().getRoute("createEvent").attachMatched(this.onRouteMatched, this);
						this._oPnl = this.byId("idPnl");

					},
					onRouteMatched: function(oEvent) {
						eID = oEvent.getParameter("arguments").eventID;
						//id_event sau IdEvent
						console.log("S-a transmis event ID-ul : " + eID);

					},

					addInput: function() {
						var oView = this.getView();
						var oModel = oView.getModel();
						var oInput1 = new sap.m.Input();
						var delIcon = new sap.ui.core.Icon({
							src: "sap-icon://delete",
							press: this.onDeleteCcMail
						});
						var _oCcLayout = new sap.m.FlexBox({
							alignItems: "Center",
							justifyContent: "Start",
							items: [oInput1, delIcon]
						});
						this._oPnl.addContent(_oCcLayout);
					},

					addQuestionPress: function() {

						var QAstruct = {
							question_text: "",
							answer_text: []
						};
						var pnlDom = this._oPnl.getDomRef();
						$(pnlDom).find('input').each(function(index, elem) {
							if (index === 0) {
								QAstruct.question_text = $(elem)[0].value;
								//oModel.create("/Question" );
							} else {
								QAstruct.answer_text.push($(elem)[0].value);
							}
						});
						QAstructList.push(QAstruct);
					},

					onDeleteCcMail: function(oEvent) {
						var rowItemContainer = oEvent.getSource().getParent();
						rowItemContainer.destroy();
					},

					onCreate: function(oEvent) {

						var oView = this.getView();
						var oModel = oView.getModel();

						var title = this.getView().byId("Title").getValue();
						var location = this.getView().byId("Location").getValue();
						var latitude = this.getView().byId("Latitude").getValue();
						var longitude = this.getView().byId("Longitude").getValue();
						var date = this.getView().byId("Date").getValue();
						var time = this.getView().byId("Time").getValue();
						console.log(time);
						var dressCode = this.getView().byId("Dresscode").getValue();
						var picture = this.getView().byId("Picture").getValue();

						var oData = {
							Title: title,
							Location: location,
							Latitude: latitude,
							Longitude: longitude,
							Data: date,
							Time: time,
							Dresscode: dressCode,
							Picture: picture
						};

						var route = this.getRouter();
						oModel.create("/EventSet", oData, {
								success: function(oCompletedEntry) {
									console.log("Event ID-ul este: " + oCompletedEntry.IdEvent);
									QAstructList.forEach(function(item) {
												var oQuestionData = {
													IdEvent: oCompletedEntry.IdEvent,
													QuestionText: item.question_text

												};

												oModel.create("/QuestionSet", oQuestionData, {
														success: function(oCompleteEntry) {
															
														},
														error: function(oError) {
															console.log("There has been an error creating the event! Please try again.")
														}
													
												});
										});
									
								},
										error: function(oError) {
											console.log("There has been an error creating the event! Please try again.")
										}
								});
						}

					});

			});