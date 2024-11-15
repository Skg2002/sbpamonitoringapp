/*global QUnit*/

sap.ui.define([
	"destinationapp/controller/destinationView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("destinationView Controller");

	QUnit.test("I should test the destinationView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
