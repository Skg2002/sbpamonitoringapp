/*global QUnit*/

sap.ui.define([
	"workflowinstanceapp/controller/workflowmaster.controller"
], function (Controller) {
	"use strict";

	QUnit.module("workflowmaster Controller");

	QUnit.test("I should test the workflowmaster controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
