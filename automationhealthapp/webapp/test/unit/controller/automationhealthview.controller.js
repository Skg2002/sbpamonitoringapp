/*global QUnit*/

sap.ui.define([
	"automationhealthapp/controller/automationhealthview.controller"
], function (Controller) {
	"use strict";

	QUnit.module("automationhealthview Controller");

	QUnit.test("I should test the automationhealthview controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
