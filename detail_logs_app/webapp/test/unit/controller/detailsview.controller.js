/*global QUnit*/

sap.ui.define([
	"detail_logs_app/controller/detailsview.controller"
], function (Controller) {
	"use strict";

	QUnit.module("detailsview Controller");

	QUnit.test("I should test the detailsview controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
