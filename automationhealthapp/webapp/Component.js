/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "automationhealthapp/model/models",
        "sap/m/BusyDialog"
    ],
    function (UIComponent, Device, models,BusyDialog) {
        "use strict";

        return UIComponent.extend("automationhealthapp.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                this._busyDialog = new BusyDialog();

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            },
            openBusyDialog: function () {
                this._busyDialog.open();
            },
    
            closeBusyDialog: function () {
                this._busyDialog.close();
            }
        });
    }
);