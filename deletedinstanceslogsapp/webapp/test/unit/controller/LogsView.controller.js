/*global QUnit*/

sap.ui.define([
	"deletedinstanceslogsapp/controller/LogsView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("LogsView Controller");

	QUnit.test("I should test the LogsView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
